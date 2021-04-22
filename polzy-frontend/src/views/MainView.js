import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  Container,
  IconButton,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useSnackbar } from 'notistack'
import { makeStyles } from '@material-ui/core/styles'
import HomeView from './HomeView'
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
import { parseHtmlTextWithLink } from '../utils'

/*
** Avalable Views Flags
*/
export const VIEW_HOME = 'home'
export const VIEW_ADMIN = 'admin'
export const VIEW_BADGE = 'badge'
export const VIEW_RANKING = 'ranking'


// styles
const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
}))


/*
** View Mapper
*//*
function RenderView(props) {
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

RenderView.propTypes = {
  view: PropTypes.string,
  tab: PropTypes.string,
  updateBadges: PropTypes.bool,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onBadgesUpdated: PropTypes.func,
}
*/

/**
 * This component renders the current view using, defines the logic for transition between the views
 * and provides alerts for **_PoLZy_** system.
 *
 * @component
 * @category Views
 * 
 */
function MainView(props) {
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * @name view
   * @desc State: String flag of the current view.
   * @prop {string} view - state
   * @prop {function} setView - setter
   * @type {state}
   * @memberOf MainView
   * @inner
   */
  const [view, setView] = React.useState(VIEW_HOME)
  /**
   * @name updateBadges
   * @desc State: Boolean flag that shows if badge info is updating currently.
   * @prop {boolean} updateBadges - state
   * @prop {function} setUpdateBadges - setter
   * @type {state}
   * @memberOf MainView
   * @inner
   */
  const [updateBadges, setUpdateBadges] = React.useState(true)


  // push notifications every minute
  /**
   * Periodically (by default, once per minute) requests the back-end for pushing system messages.
   *
   * @name useEffect
   * @function
   * @memberOf MainView
   * @inner
   * @variation 1
   */
  React.useEffect(() => {
    setInterval(() => {
      pushNotifications(props.user).catch(error => {
        console.log(error)
      })
    }, 60000)
  }, [])

  // get toasts from backend
  /**
   * Defines event listener which constantly monitors back-end route `/api/listen`.
   * If event occurs, the event listener pushes either a toast that signals about
   * achieving a new badge (event `newbadge`) or a regular text toast (event `message`).
   *
   * @name useEffect
   * @function
   * @memberOf MainView
   * @inner
   * @variation 2
   */
  React.useEffect(() => {
    const eventSource = new EventSource(apiHost + "api/listen")

    eventSource.addEventListener("newbadge", (e) => {
      const {text, uri, ...toastProps} = JSON.parse(e.data)
      console.log('Badge:')
      console.log(uri)

      // enqueue toast
      enqueueSnackbar(
        <BadgeToast text={text} uri={uri} />,
        {
          ...toastProps,
          variant: 'default',
          preventDuplicate: true,
          action: closeToastAction,
        },       
      )

      // update user badges
      setUpdateBadges(true)
    })

    eventSource.onmessage = (e) => {
      const {text, ...toastProps} = JSON.parse(e.data)
      enqueueSnackbar(
        parseHtmlTextWithLink(text, true),
        {
          ...toastProps,
          preventDuplicate: true,
          action: closeToastAction,
        },
      )
    }
  }, [])

  /**
   * Callback.
   * **_Fired_** when received data on user's badges from the back-end.<br/>
   * **_Implementation_**: sets state `updateBadge` to `false`.
   * @callback
   */
  const handleOnBadgesUpdated = () => {
    setUpdateBadges(false)
  }

  const goToHome = () => {
    setView(VIEW_HOME)
  } 

  const closeToastAction = (key) => (
    <IconButton onClick={() => {closeSnackbar(key)}}>
      <CloseIcon />
    </IconButton>
  )

  const CurrentView = () => {
    switch(view) {
      case VIEW_ADMIN:
        return <AdminView onClose={goToHome} />
      case VIEW_BADGE:
        return (
          <BadgeView
            onClose={goToHome}
            updateBadges={updateBadges}
            onBadgesUpdated={handleOnBadgesUpdated}
          />
        )
      case VIEW_RANKING:
        return <RankingView onClose={goToHome} />
      default:
        return <HomeView tab={props.tab} />
    }
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
        <CurrentView />
        {/*<RenderView
          view={view}
          tab={props.tab}
          onClose={goToHome}
          onChange={setView}
          updateBadges={updateBadges}
          onBadgesUpdated={handleOnBadgesUpdated}
        />*/}
      </Container>
      <footer className={classes.footer}>
        <Copyright />
      </footer>
    </React.Fragment>
  )
}

MainView.propTypes = {
  /**
   * Object that contains user credentials.
   */
  user: PropTypes.object,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(MainView)
