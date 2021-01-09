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
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../components/languageSelector'
import { getBadges } from '../api/gamification'
import { VIEW_HOME, VIEW_ADMIN, VIEW_BADGE } from '../views/HomeView'
import { signOut, updateUser, clearPolicy, clearAntrag } from '../redux/actions'
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
  const {t} = useTranslation('auth', 'admin', 'common', 'feedback')
  const classes = useStyles()

  const [openMenu, setOpenMenu] = React.useState(false)

  // update user badges
  React.useEffect(() => {
    getBadges(props.user).then((data) => {
      console.log('BADGES:')
      console.log(data)
      props.setBadges(data)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  const handleGoToHome = () => {
    props.onChange(VIEW_HOME)
    setOpenMenu(false)
  }

  const handleShowAdmin = () => {
    props.onChange(VIEW_ADMIN)
    setOpenMenu(false)
  }

  const handleShowBadges = () => {
    props.onChange(VIEW_BADGE)
    setOpenMenu(false)
  }

  const handleSignOut = () => {
    // clear policy and antrag store
    props.clearPolicy()
    props.clearAntrag()
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

  console.log('USER MENU:')
  console.log(props)

  return (
    <React.Fragment>

    {/* Toggle Button */}
      <Badge
        color="secondary"
        badgeContent={getUnseenBadgeNumber()}
        invisible={getUnseenBadgeNumber() == 0}
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

          {/* Go To Home */}
          {props.currentView !== VIEW_HOME &&
            <ListItem
              button
              onClick={handleGoToHome}
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
              onClick={handleShowAdmin}
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
              onClick={handleShowBadges}
            >
              <ListItemIcon>
                <LoyaltyIcon />
              </ListItemIcon>
              <ListItemText primary={t('admin:badges')} />
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
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)