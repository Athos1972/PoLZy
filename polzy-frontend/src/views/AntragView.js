import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Portal from '@material-ui/core/Portal'
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
}))


/*
** Antrag Card Mapper
*/
function RenderAntragCard(props) {
  const { scrollTop, ...defaultProps } = props
  
  switch (props.antrag.request_state) {
    case "ok":
      return(
        <ActiveAntrag {...props} />
      )
    case "waiting":
      return(
        <DisabledAntrag {...defaultProps} />
      )
    default:
      return(
        <ErrorAntrag {...defaultProps} />
      )
  }
}

RenderAntragCard.propTypes = {
  scroll: PropTypes.number,
  index: PropTypes.number,
  antrag: PropTypes.object,
}


/*
** Antrag View
*/
function AntragView(props) {
  const classes = useStyles()
  const {t} = useTranslation('common', 'feedback')

  // scroll track
  const [scrollTop, setScrollTop] = React.useState(0);

  React.useEffect(() => {
    const onScroll = (event) => {
      setScrollTop(event.target.documentElement.scrollTop)
    }
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollTop]);

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
          <RenderAntragCard
            index={index}
            antrag={antrag}
            scrollTop={scrollTop}
          />
        </ErrorBoundary>
      ))}
    </div>
  )
}

AntragView.propTypes = {
  user: PropTypes.object,
  antrags: PropTypes.array,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  antrags: state.antrags,
})

export default connect(mapStateToProps)(AntragView)