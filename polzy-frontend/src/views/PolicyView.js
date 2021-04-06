import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import NewPolicy from '../policy/newPolicy'
import DisabledPolicy from '../policy/disabledPolicy'
import ErrorPolicy from '../policy/errorPolicy'
import ActivePolicy from '../policy/activePolicy'
import Customer from '../policy/customer'
import { ErrorBoundary } from "@sentry/react"
import ErrorCard from '../sentry/fallBack'
import { getDialogOptions, getPolicyContext, getUser } from '../sentry/utils'

// set styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

}))

/*
** Policy Card Mapper
*/
function RenderPolicyCard(props) {
  const { index, policy } = props

  console.log(policy)
  
  switch (policy.request_state) {
    case "ok":
      return(
        <ActivePolicy index={index} policy={policy} />
      )
    case "waiting":
      return(
        <DisabledPolicy index={index} policy={policy} />
      )
    case "customer":
      return(
        <Customer index={index} customer={policy.customer} />
      )
    default:
      return(
        <ErrorPolicy index={index} policy={policy} />
      )
  }
}

RenderPolicyCard.propTypes = {
  index: PropTypes.number,
  policy: PropTypes.object,
}


/*
** Policy View
*/
function PolicyView(props) {
  const classes = useStyles()
  const {t} = useTranslation('common', 'feedback')

  return(
    <div className={classes.container}>
      <ErrorBoundary
        fallback={(errorData)  => (
          <ErrorCard error={errorData.error} />
        )}
        showDialog
        dialogOptions={getDialogOptions(props.user, t)}
        beforeCapture={(scope) => {
          scope.setUser(getUser(props.user))
          scope.setTag("view", "policy")
          scope.setContext("polzy", getPolicyContext(props.user))
        }}
      >
        <NewPolicy />
      </ErrorBoundary>
      {props.policies.map((policy, index) => (
        <ErrorBoundary
          key={policy.key}
          fallback={(errorData)  => (
            <ErrorCard error={errorData.error} />
          )}
          showDialog
          dialogOptions={getDialogOptions(props.user, t)}
          beforeCapture={(scope) => {
            scope.setUser(getUser(props.user))
            scope.setTag("view", "policy")
            scope.setContext("polzy", getPolicyContext(props.user, policy))
          }}
        >
          <RenderPolicyCard index={index} policy={policy} />
        </ErrorBoundary>
      ))}
    </div>
  )
}

PolicyView.propTypes = {
  user: PropTypes.object,
  policies: PropTypes.array,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  policies: state.policies,
})

export default connect(mapStateToProps)(PolicyView)