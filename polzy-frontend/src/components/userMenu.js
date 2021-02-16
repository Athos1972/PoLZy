import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import LoyaltyIcon from '@material-ui/icons/Loyalty'
import HomeIcon from '@material-ui/icons/Home'
import ReportProblemIcon from '@material-ui/icons/ReportProblem'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import LanguageSelector from './languageSelector'
import FileUploadDialog from './fileUploads'
import { getBadges } from '../api/gamification'
import { VIEW_HOME, VIEW_ADMIN, VIEW_BADGE, VIEW_RANKING } from '../views/HomeView'
import { signOut, updateUser, clearPolicy, clearAntrag, clearValues } from '../redux/actions'
import { ErrorBoundary } from "@sentry/react"
import { getManualDialogOptions, getManualReportContext, getUser } from '../sentry/utils'


const useStyles = makeStyles({
  list: {
    width: 250,
  },

  languageSelector: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
  }
})

function ReportButton(props) {
  const [report, setReport] = React.useState(false)

  const handleClick = () => {
    props.onClick()
    setReport(true)
  }

  React.useEffect(() => {
    if (report) {
      setReport(false)
    }
  }, [report])

  if (report) {
    throw new Error("Report Problem")
  }

  return (
    <ListItem
      button
      onClick={handleClick}
    >
      <ListItemIcon>
        <ReportProblemIcon />
      </ListItemIcon>
      <ListItemText primary={props.caption} />
    </ListItem>
  )
}

function UserMenu(props) {
  const {t} = useTranslation('auth', 'admin', 'common', 'feedback', 'gamification')
  const classes = useStyles()

  const [openMenu, setOpenMenu] = React.useState(false)
  const [openUpload, setOpenUpload] = React.useState(false)

  // update user badges
  React.useEffect(() => {
    if (!props.updateBadges) {
      return
    }

    getBadges(props.user).then((data) => {
      //console.log('BADGES:')
      //console.log(data)
      // set user badges
      props.setBadges(data)
      // disable bdges update
      props.onBadgesUpdated()
    }).catch(error => {
      // disable badges update
      props.onBadgesUpdated()
      console.log(error)
    })
  }, [props.updateBadges])

  const handleShowView = (view) => {
    props.onChange(view)
    setOpenMenu(false)
  }

  const handleSignOut = () => {
    // clear policy and antrag store
    props.clearPolicy()
    props.clearAntrag()
    // clear lists of values
    props.clearValues()
    // sign out 
    props.signOut()
  }

  const getUnseenBadgeNumber = () => {
    if (!(props.user.badges instanceof Array)) {
      return 0
    }

    const unseenBadges = props.user.badges.filter(badge => !badge.isSeen)

    return unseenBadges.length
  }

  const handleOpenUploadDialog = () => {
    setOpenMenu(false)
    setOpenUpload(true)
  }

  //console.log('USER MENU:')
  //console.log(props)

  return (
    <React.Fragment>

    {/* Toggle Button */}
      <Badge
        color="secondary"
        badgeContent={getUnseenBadgeNumber()}
        invisible={getUnseenBadgeNumber() === 0}
        overlap="circle"
      >
        <Button
          onClick={() => setOpenMenu(true)}
        >
          {props.user.name}
        </Button>
      </Badge>

    {/* User Menu */}
      <Drawer 
        anchor="right"
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
        <List classes={{root: classes.list}}>

          {/* Language Selector */}
          <ListItem classes={{root: classes.languageSelector}}>
            <LanguageSelector
              noBorders
              withLabel
            />
          </ListItem>
          
          <Divider />

          {/* Problem Reporting */}
          <ErrorBoundary
            showDialog
            dialogOptions={getManualDialogOptions(props.user, t)}
            beforeCapture={(scope) => {
              scope.setUser(getUser(props.user))
              scope.setTag("view", "user menu")
              scope.setContext("user report", getManualReportContext(props.user, "user menu"))
            }}
          >
            <ReportButton
              caption={t('feedback:report.problem')}
              onClick={()=>setOpenMenu(false)}
            />
          </ErrorBoundary>

          {/* File Upload */}
          <ListItem
            button
            onClick={handleOpenUploadDialog}
          >
            <ListItemIcon>
              <CloudUploadIcon />
            </ListItemIcon>
            <ListItemText primary={t('common:upload')} />
          </ListItem>

          {/* Go To Home */}
          {props.currentView !== VIEW_HOME &&
            <ListItem
              button
              onClick={() => handleShowView(VIEW_HOME)}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t('admin:quit')} />
            </ListItem>
          }

          {/* Admin Pannel */}
          {props.currentView !== VIEW_ADMIN && props.user.isSupervisor &&
            <ListItem
              button
              onClick={() => handleShowView(VIEW_ADMIN)}
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary={t('admin:pannel')} />
            </ListItem>
          }

          {/* Badges */}
          {props.currentView !== VIEW_BADGE &&
            <ListItem
              button
              onClick={() => handleShowView(VIEW_BADGE)}
            >
              <ListItemIcon>
                <Badge
                  color="secondary"
                  badgeContent={getUnseenBadgeNumber()}
                  invisible={getUnseenBadgeNumber() === 0}
                >
                  <LoyaltyIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText primary={t('gamification:badges')} />
            </ListItem>
          }

          {/* Ranking */}
          {props.user.company.attributes && props.user.company.attributes.hitList && props.currentView !== VIEW_RANKING &&
            <ListItem
              button
              onClick={() => handleShowView(VIEW_RANKING)}
            >
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary={t('gamification:ranking')} />
            </ListItem>
          }

          {/* Sign Out */}
          <ListItem
            button
            onClick={handleSignOut}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={t('auth:signout.button')} />
          </ListItem>
        </List>
      </Drawer>

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={openUpload}
        onClose={() => setOpenUpload(false)}
      />
    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  signOut: signOut,
  setBadges: updateUser,
  clearPolicy: clearPolicy,
  clearAntrag: clearAntrag,
  clearValues: clearValues, 
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)