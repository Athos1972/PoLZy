import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  Container,
  Tabs,
  Tab,
  IconButton,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import AdminView from './AdminView'
import PolicyView from './PolicyView'
import AntragView from './AntragView'
import NotAllowedView from './NotAllowedView'
import Header from'../components/header'
import Copyright from '../components/copyright'
import { apiHost } from '../utils'

// set styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },

  toast: {
    backgroundColor: theme.palette.primary.main,
  },

  toastContainer: {
    display: 'flex',
  },

  toastMessage: {
    padding: theme.spacing(1) / 2,
  }
}))

function GetView(props) {

  switch(props.view) {
    case 'policy':
      return <PolicyView />
    case 'antrag':
      return <AntragView />
    default:
      return <NotAllowedView />
  }
}

function TabPanel(props) {
  const { children, name, value } = props;

  return (
    <div
      role="tabpanel"
      hidden={name !== value}
      id={`tabpanel-${name}`}
      aria-labelledby={`tab-${name}`}
    >
      { name === value && children }
    </div>
  )
}

function HomeView(props) {
  const classes = useStyles()
  const {t} = useTranslation('policy', 'antrag')
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [tab, setTab] = useState()
  const [openAdmin, setOpenAdmin] = useState(false)
  const [allowedViews, setAllowedViews] = useState([])

  // update allowed views
  useEffect(() => {
    const views = Object.keys(props.permissions).filter(item => props.permissions[item])
    setAllowedViews(views)
    setTab(views.length > 0 ? views[0] : null)
  }, [props.permissions])

  const closeToast = (key) => (
    <IconButton onClick={() => {closeSnackbar(key)}}>
      <CloseIcon />
    </IconButton>
  )

  // get toasts
  useEffect(() => {
    const eventSource = new EventSource(apiHost + "api/listen")
    eventSource.onmessage = (e) => {
      const {text, ...toastProps} = JSON.parse(e.data)
      enqueueSnackbar(
        text,
        {
          ...toastProps,
          preventDuplicate: true,
          action: closeToast,
        },
        
      )
    }
  }, [])
  

  return(
    <React.Fragment>
      <Container maxWidth="lg">
        <Header
          adminActive={openAdmin}
          openAdmin={setOpenAdmin}
          currentView={tab}
        />
        {openAdmin ? (
          <AdminView
            closeAdmin={() => setOpenAdmin(false)}
          />
        ) : (
          <React.Fragment>
            {allowedViews.length > 1 ? (
              <React.Fragment>
                <Tabs 
                  value={tab}
                  onChange={(e, v) => {setTab(v)}}
                  indicatorColor="secondary"
                  textColor="primary"
                  variant="fullWidth"
                >
                  {allowedViews.map((view) => (
                    <Tab
                      key={view}
                      label={t(`views:${view}`)}
                      value={view}
                      id={`tab-${view}`}
                      aria-controls={`tabpanel-${view}`}
                    />
                  ))}
                </Tabs>
                {allowedViews.map((view) => (
                  <TabPanel
                    key={view}
                    name={view}
                    value={tab}
                  >
                    <GetView view={view} />
                  </TabPanel>
                ))}
              </React.Fragment>
            ) : (
              <React.Fragment>
                {allowedViews.length === 1 ? (
                  <GetView view={allowedViews[0]} />
                ) : (
                  <NotAllowedView />
                )}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Container>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </React.Fragment>
  )
}

// connect to redux store
export default connect((state) => ({
  permissions: state.user.permissions,
}))(HomeView)