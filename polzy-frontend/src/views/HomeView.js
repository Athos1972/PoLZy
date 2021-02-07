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
import BadgeView from './BadgeView'
import RankingView from './RankingView'
import PolicyView from './PolicyView'
import AntragView from './AntragView'
import NotAllowedView from './NotAllowedView'
import Header from'../components/header'
import Copyright from '../components/copyright'
import { BadgeToast } from '../components/toasts'
import { apiHost } from '../utils'
import { pushNotifications } from '../api/notifications'

/*
** Avalable Views
*/
export const VIEW_HOME = 'home'
export const VIEW_ADMIN = 'admin'
export const VIEW_BADGE = 'badge'
export const VIEW_RANKING = 'ranking'

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

function GetTabView(props) {

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

function HomeViewBase(props) {
  const classes = useStyles()
  const {t} = useTranslation('policy', 'antrag')

  const [tab, setTab] = useState()
  const [allowedViews, setAllowedViews] = useState([])

  // update allowed views
  useEffect(() => {
    const views = Object.keys(props.permissions).filter(item => props.permissions[item])
    setAllowedViews(views)
    setTab(views.length > 0 ? views[0] : null)
  }, [props.permissions])

  return(
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
              <GetTabView view={view} />
            </TabPanel>
          ))}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {allowedViews.length === 1 ? (
            <GetTabView view={allowedViews[0]} />
          ) : (
            <NotAllowedView />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

// connect to redux store
const HomeView = connect((state) => ({
  permissions: state.user.permissions,
}))(HomeViewBase)


/*
** Main View
*/
function RenderCurrentView(props) {
  //const {view, ...otherProps} = props

  switch(props.view) {
    case VIEW_ADMIN:
      return <AdminView onClose={props.onClose} />
    case VIEW_BADGE:
      return <BadgeView {...props} />
    case VIEW_RANKING:
      return <RankingView onClose={props.onClose} />
    default:
      return <HomeView />
  }
}

function MainViewBase(props) {
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [view, setView] = useState(VIEW_HOME)
  const [tab, setTab] = useState()
  const [updateBadges, setUpdateBadges] = useState(true)

  const goToHome = () => {
    setView(VIEW_HOME)
  } 

  const closeToast = (key) => (
    <IconButton onClick={() => {closeSnackbar(key)}}>
      <CloseIcon />
    </IconButton>
  )

  // push notifications every minute
  useEffect(() => {
    setInterval(() => {
      pushNotifications(props.user).catch(error => {
        console.log(error)
      })
    }, 60000)
  }, [])

  // get toasts
  useEffect(() => {
    const eventSource = new EventSource(apiHost + "api/listen")

    eventSource.addEventListener("newbadge", (e) => {
      const {text, uri, ...toastProps} = JSON.parse(e.data)

      // enqueue toast
      enqueueSnackbar(
        <BadgeToast text={text} uri={uri} />,
        {
          ...toastProps,
          variant: 'default',
          preventDuplicate: true,
          action: closeToast,
        },       
      )

      // update user badges
      setUpdateBadges(true)
    })

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

  const handleOnBadgesUpdated = () => {
    setUpdateBadges(false)
  }
  
  return(
    <React.Fragment>
      <Container maxWidth="lg">
        <Header
          currentTab={tab}
          currentView={view}
          onChange={setView}
          updateBadges={updateBadges}
          onBadgesUpdated={handleOnBadgesUpdated}
        />
        <RenderCurrentView
          view={view}
          onClose={goToHome}
          onChange={setView}
          updateBadges={updateBadges}
          onBadgesUpdated={handleOnBadgesUpdated}
        />
      </Container>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </React.Fragment>
  )
}

// connect to redux store
export default connect((state) => ({
  user: state.user,
}))(MainViewBase)