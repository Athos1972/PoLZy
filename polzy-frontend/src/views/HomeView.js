import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
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
import { useLocation } from 'react-router-dom'
import htmlParse from 'html-react-parser'
import AdminView from './AdminView'
import BadgeView from './BadgeView'
import RankingView from './RankingView'
import PolicyView from './PolicyView'
import AntragView from './AntragView'
import NotAllowedView from './NotAllowedView'
import { VIEW_HOME, VIEW_ADMIN, VIEW_BADGE, VIEW_RANKING } from './MainView'
import Header from'../components/header'
import Copyright from '../components/copyright'
import { BadgeToast } from '../components/toasts'
import { apiHost } from '../utils'
import { pushNotifications } from '../api/notifications'
import { loadAntrag } from '../api/antrag'
import { addAntrag } from '../redux/actions'



/*
** Avalable Views

export const VIEW_HOME = 'home'
export const VIEW_ADMIN = 'admin'
export const VIEW_BADGE = 'badge'
export const VIEW_RANKING = 'ranking'

// set styles
const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
}))
*/

/*
** Tab View Mapper
*/
function MapTabView(props) {

  switch(props.view) {
    case 'policy':
      return <PolicyView />
    case 'antrag':
      return <AntragView />
    default:
      return <NotAllowedView />
  }
}

MapTabView.propTypes = {
  view: PropTypes.string,
}

/*
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
*/

function HomeView(props) {
  const {t} = useTranslation('policy', 'antrag')
  const location = useLocation()
  const {enqueueSnackbar} = useSnackbar()

  const [tab, setTab] = useState()
  const [allowedViews, setAllowedViews] = useState([])
  const {permissions} = props.user

  // update allowed views
  useEffect(() => {
    const views = Object.keys(permissions).filter(item => permissions[item])
    setAllowedViews(views)
    
    if (props.tab && views.includes(props.tab)) {
      setTab(props.tab)
    } else {
      setTab(views.length > 0 ? views[0] : null)
    }
  }, [permissions])

  // load antrag from URL
  useEffect(() => {
    const instanceId = location.pathname.split('/')[2]
    if (instanceId) {
      loadAntrag(props.user, instanceId).then(data => {
        props.addAntrag({
          request_state: "ok",
          addressList: {},
          ...data,
        })
      }).catch(error => {
        console.log(error)
        enqueueSnackbar(
          t('antrag:load.error'),
          {
            variant: 'error',
            preventDuplicate: true,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          },
        )
      })
    }
  }, [])

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
            <React.Fragment>
            <div
              key={view}
              role="tabpanel"
              hidden={view !== tab}
              id={`tabpanel-${view}`}
              aria-labelledby={`tab-${view}`}
            >
              { view === tab && <MapTabView view={view} /> }
            </div>
{/*}
            <TabPanel
              key={view}
              name={view}
              value={tab}
            >
              <GetTabView view={view} />
            </TabPanel> */}
            </React.Fragment>
          ))}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {allowedViews.length === 1 ? (
            <MapTabView view={allowedViews[0]} />
          ) : (
            <NotAllowedView />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}


/*
** Main View
*/
/*
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
      return <HomeView tab={props.tab} />
  }
}

function MainViewBase(props) {
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [view, setView] = useState(VIEW_HOME)
  //const [tab, setTab] = useState(props.tab)
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

  const parseTextWithLink = (text) => {
    const formatToastText = (textObject) => {
      // format link object
      if (textObject.type == "a") {
        return ({
          ...textObject,
          props: {
            ...textObject.props,
            target: "_blank",
            className: "toast-link",
          },
        })
      }

      // return intact object if it is not a link
      return textObject
    }

    // parse message text
    const result = htmlParse(text)

    // multiple objects parsed
    if (Array.isArray(result)) {
      return result.map(item => formatToastText(item))
    }

    // single object parsed
    return formatToastText(result)
  }

  // get toasts from backend
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
        parseTextWithLink(text),
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
          currentView={view}
          onChange={setView}
          updateBadges={updateBadges}
          onBadgesUpdated={handleOnBadgesUpdated}
        />
        <RenderCurrentView
          view={view}
          tab={props.tab}
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
*/
// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  addAntrag: addAntrag,
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeView)


//export default connect(mapStateToProps)(MainViewBase)

