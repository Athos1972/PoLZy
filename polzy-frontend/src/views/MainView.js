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
*/
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


/*
** Main View
*/
function MainView(props) {
  const classes = useStyles()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const [view, setView] = React.useState(VIEW_HOME)
  const [updateBadges, setUpdateBadges] = React.useState(true)

  const goToHome = () => {
    setView(VIEW_HOME)
  } 

  const closeToastAction = (key) => (
    <IconButton onClick={() => {closeSnackbar(key)}}>
      <CloseIcon />
    </IconButton>
  )

  // push notifications every minute
  React.useEffect(() => {
    setInterval(() => {
      pushNotifications(props.user).catch(error => {
        console.log(error)
      })
    }, 60000)
  }, [])

  // get toasts from backend
  React.useEffect(() => {
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
        <RenderView
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

MainView.propTypes = {
  user: PropTypes.object,

}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(MainView)
