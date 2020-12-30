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
} from '@material-ui/core'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import HomeIcon from '@material-ui/icons/Home'
import ReportProblemIcon from '@material-ui/icons/ReportProblem'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import LanguageSelector from '../components/languageSelector'
import { signOut, clearPolicy, clearAntrag } from '../redux/actions'
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

  const handleToggleAdminPannel = () => {
    props.openAdmin(!props.adminActive)
    setOpenMenu(false)
  }

  const handleSignOut = () => {
    // clear policy and antrag store
    props.clearPolicy()
    props.clearAntrag()
    // sign out 
    props.signOut()
  }

  return (
    <React.Fragment>

    {/* Toggle Button */}
      <Button
        onClick={() => setOpenMenu(true)}
      >
        {props.user.name}
      </Button>

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

          {/* Admin Pannel */}
          {props.user.isSupervisor &&
            <ListItem
              button
              onClick={handleToggleAdminPannel}
            >
              <ListItemIcon>
                {props.adminActive ? (
                  <HomeIcon />
                ) : (
                  <SupervisorAccountIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={props.adminActive ? t('admin:quit') : t('admin:pannel')} />
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
  clearPolicy: clearPolicy,
  clearAntrag: clearAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserMenu)