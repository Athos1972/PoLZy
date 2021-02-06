import React from 'react'
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

}));

function PolicyCard(props) {
  const { index, policy } = props
  
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
        <Customer index={index} customer={policy} />
      )
    default:
      return(
        <ErrorPolicy index={index} policy={policy} />
      )
  }
}

function PolicyView(props) {
  const classes = useStyles()
  const {t} = useTranslation('common', 'feedback')

  console.log(props.policies)

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
          <PolicyCard index={index} policy={policy} />
        </ErrorBoundary>
      ))}
    </div>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  policies: state.policies,
})

export default connect(mapStateToProps)(PolicyView)