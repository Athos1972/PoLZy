import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import NewAntrag from '../antrag/newAntrag'
import DisabledAntrag from '../antrag/disabled'
import ErrorAntrag from '../antrag/error'
import ActiveAntrag from '../antrag/active'
import { ErrorBoundary } from "@sentry/react"
import ErrorCard from '../sentry/fallBack'
import { getDialogOptions, getAntragContext, getUser } from '../sentry/utils'

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
}));

function AntragCard(props) {
  const { index, antrag } = props
  
  switch (antrag.request_state) {
    case "ok":
      return(
        <ActiveAntrag index={index} antrag={antrag} />
      )
    case "waiting":
      return(
        <DisabledAntrag index={index} antrag={antrag} />
      )
    default:
      return(
        <ErrorAntrag index={index} antrag={antrag} />
      )
  }
}



function AntragView(props) {
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
          scope.setTag("view", "antrag")
          scope.setContext("polzy", getAntragContext(props.user))
        }}
      >
        <NewAntrag cardsNumber={props.antrags.length}/>
      </ErrorBoundary>
      {props.antrags.map((antrag, index) => (
        <ErrorBoundary
          key={`antrag-${antrag.key}`}
          fallback={(errorData)  => (
            <ErrorCard
              error={errorData.error}
              view="antrag"
              index={index}
            />
          )}
          showDialog
          dialogOptions={getDialogOptions(props.user, t)}
          beforeCapture={(scope) => {
            scope.setUser(getUser(props.user))
            scope.setTag("view", "antrag")
            scope.setContext("polzy", getAntragContext(props.user, antrag))
          }}
        >
          <AntragCard index={index} antrag={antrag} />
        </ErrorBoundary>
      ))}
    </div>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  antrags: state.antrags,
})

export default connect(mapStateToProps)(AntragView)