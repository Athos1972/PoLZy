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
** Tab View Mapper
*/
/**
 * It is a mapper component that renders a specific action view by matching prop _view_ with possible view names.
 * If _view_ does not match any name (or is empty) then renders {@link NotAllowedView}
 *
 * @prop {string} props.view
 * The name of an action view (the possible names of the action views are listed [above]{@link HomeView})
 *
 * @memberOf HomeView
 */
function RenderTabView(props) {

  switch(props.view) {
    case 'policy':
      return <PolicyView />
    case 'antrag':
      return <AntragView />
    default:
      return <NotAllowedView />
  }
}

RenderTabView.propTypes = {
  view: PropTypes.string,
}


/**
 * This component renders a tab panel (if user is allowed to access multiple action views)
 * and a currently selected action view.
 * If the user is not allowed to see any action view, then the component renders {@link NotAllowedView}.
 * The possible action views are:
 * - Policy (name = "_policy_")
 * - Fast Offer (name= "_antrag_")
 *
 * @component
 * @category Views
 *
 */
function HomeView(props) {
  const {t} = useTranslation('policy', 'antrag')
  const location = useLocation()
  const {enqueueSnackbar} = useSnackbar()

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * @name tab
   * @desc State: The name of the current action view.
   * @prop {string} tab - state
   * @prop {function} setTab - setter
   * @type {state}
   * @memberOf HomeView
   * @inner
   */
  const [tab, setTab] = useState()
  /**
   * @name allowedViews
   * @desc State: A list of allowed to the _user_ action views.
   * @prop {string} allowedViews - state
   * @prop {function} setAllowedViews - setter
   * @type {state}
   * @memberOf HomeView
   * @inner
   */
  const [allowedViews, setAllowedViews] = useState([])
  const {permissions} = props.user

  /**
   * Updates state [_allowedViews_]{@link HomeView~allowedViews} from prop _user.permissions_
   * when the component is mounted or user's permissions changed.
   *
   * @name useEffect
   * @function
   * @memberOf HomeView
   * @inner
   * @variation 1
   */
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
  /**
   * Checks if user is trying to access a specific product offer by a link when the compponent is mounted.
   * If so, it fetches the product offer from the back-end and stores it to the _redux_ store
   *
   * @name useEffect
   * @function
   * @memberOf HomeView
   * @inner
   * @variation 2
   */
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

            <div
              key={view}
              role="tabpanel"
              hidden={view !== tab}
              id={`tabpanel-${view}`}
              aria-labelledby={`tab-${view}`}
            >
              { view === tab && <RenderTabView view={view} /> }
            </div>

          ))}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {allowedViews.length === 1 ? (
            <RenderTabView view={allowedViews[0]} />
          ) : (
            <NotAllowedView />
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

HomeView.propTypes = {
  /**
   * The name of the predefined action view.
   * Used if user is trying to access a record on a specific view by an external link.
   */
  tab: PropTypes.string,
  /**
   * Object that contains user credentials and permissions.
   */
  user: PropTypes.object,
  /**
   * Callback that generates _redux_ action to add a product offer instance to the store.
   * Fired when user is accessing **PoLZy** by external link on a product offer.
   */
  addAntrag: PropTypes.func,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  addAntrag: addAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)

