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

/**
 * **PoLZy** uses a set of string flags to define which a view is rendered currently.
 * The table below shows the list of the flags and the corresponding views. 
 *
 * | Name         | Type     | Value     | Corresponded View            |
 * | ------------ | -------- | --------- | ---------------------------- |
 * | VIEW_HOME    | `string` | "home"    | [HomeView]{@link HomeView}   |
 * | VIEW_ADMIN   | `string` | "admin"   | [AdminView]{@link AdminView} |
 * | VIEW_BADGE   | `string` | "badge"   | [BadgeView]{@link BadgeView} |
 * | VIEW_RANKING | `string` | "ranking" | [RankingView]{@link RankingView} |
 *
 * @category Views
 * @name View Flags
 * @alias ViewFlags
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

    /**
     * Push a new badge toast
     * 
     * @listens newbadge
     */
    eventSource.addEventListener("newbadge", (e) => {
      const {text, uri, ...toastProps} = JSON.parse(e.data)

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

    /**
     * Push a regular text toast
     * 
     * @listens message
     */
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
   * Callback<br/>
   * **_Fired_** when received data on user's badges from the back-end.<br/>
   * **_Implementation_**: sets state [_updateBadge_]{@link MainView~updateBadge} to `false`.
   */
  const handleOnBadgesUpdated = () => {
    setUpdateBadges(false)
  }

  /**
   * Callback<br/>
   * **_Fired_** when exiting any view.<br/>
   * **_Implementation_**: sets the view flag to `VIEW_HOME`.
   */
  const goToHome = () => {
    setView(VIEW_HOME)
  } 

  /**
   * Inner component<br/>
   * Close button for toast snackbars
   *
   * @inner
   * @arg {string} key - `key` of a toast snackbar component
   */
  const closeToastAction = (key) => (
    <IconButton onClick={() => {closeSnackbar(key)}}>
      <CloseIcon />
    </IconButton>
  )

  /**
   * Inner component<br/>
   * It is a mapper component that renders a specific view
   * by matching state [_view_]{@link MainView~view} with [view flags]{@link global#ViewFlags}.
   */
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
