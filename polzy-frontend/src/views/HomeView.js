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


/*
** Home View
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
  tab: PropTypes.string,
  user: PropTypes.object,
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

