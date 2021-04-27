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

/**
 * It is a mapper component that renders a specific type of a [policy card]{@link PolicyCards}
 * depending on the the value of prop `policy.request_state` as follow:
 * | Value                       | Policy Card Component |
 * | --------------------------- | ---------------------------- |
 * | "ok"                        | {@link ActivePolicy} |
 * | "waiting"                   | {@link DisabledPolicy} |
 * | "customer"                  | {@link Customer} |
 * | "error" (or any other value)| {@link ErrorPolicy} |
 *
 * @prop {number} props.index - The index of the policy in the _redux_ store
 * @prop {object} props.anrag - The policy instance
 *
 * @memberOf PolicyView
 */
const MapPolicyCard = (props) => {
  switch (props.policy.request_state) {
    case "ok":
      return(
        <ActivePolicy {...props} />
      )
    case "waiting":
      return(
        <DisabledPolicy {...props} />
      )
    case "customer":
      return(
        <Customer index={props.index} customer={props.policy.customer} />
      )
    default:
      return(
        <ErrorPolicy {...props} />
      )
  }
}
/*
RenderPolicyCard.propTypes = {
  index: PropTypes.number,
  policy: PropTypes.object,
}
*/


/**
 * It is a view component that defines the layout for the policy cards.
 * It renders policy creation card and all the policy cards stored in the _redux_ store.
 * Additionally, it sets [Sentry]{@link Sentry} error boundaries for each card to track possible errors.
 *
 * @component
 * @category Views
 * 
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
          <MapPolicyCard index={index} policy={policy} />
        </ErrorBoundary>
      ))}
    </div>
  )
}

PolicyView.propTypes = {
  /**
   * Object that contains user credentials.
   */
  user: PropTypes.object,
  /**
   * Array that holds all the loaded policy objects.
   */
  policies: PropTypes.array,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  policies: state.policies,
})

export default connect(mapStateToProps)(PolicyView)