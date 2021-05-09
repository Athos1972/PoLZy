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


/**
 * A product offer card could be in one of the following states:
 * * _disabled_ (while initilizing the offer and requesting data from the back-end for the first time)
 * * _active_ (if the offer object was successfully initialized)
 * * _error_ (if any error occures while processing the offer data)
 *
 * This mapper component renders a specific type of a product offer card
 * depending on the the value of prop `antrag.request_state` as follow:
 * | Card State | antrag.request_state        | Card Component         |
 * | -----------|-----------------------------|----------------------- |
 * | _disabled_ | "waiting"                   | {@link DisabledAntrag} |
 * | _active_   | "ok"                        | {@link ActiveAntrag}   |
 * | _error_    | "error" (or any other value)| {@link ErrorAntrag}    |
 *
 * @prop {number} props.index - The index of the product offer in the _redux_ store
 * @prop {object} props.anrag - The product offer instance
 *
 * @memberOf AntragView
 */
const MapAntragCard = (props) => {
  const {scrollTop, ...baseProps} = props 
    switch (props.antrag.request_state) {
      case "ok":
        return <ActiveAntrag {...baseProps} scrollTop={scrollTop} />
      case "waiting":
        return <DisabledAntrag {...baseProps} />
      default: 
        return <ErrorAntrag {...baseProps} />
    }
  }


/**
 * It is a view component that defines the layout for the product offer cards.
 * It renders product offer creation card and all the offers stored in the _redux_ store.
 * Additionally, it sets [Sentry]{@link Sentry} error boundaries for each card to track possible errors.
 *
 * @component
 * @category Views
 * 
 */
function AntragView(props) {
  const classes = useStyles()
  const {t} = useTranslation('common', 'feedback')

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * @name scrollTop
   * @desc State: tracks the vertical `x` coordinate of the top of the current window.
   * @prop {number} scrollTop - state
   * @prop {function} setScrollTop - setter
   * @type {state}
   * @memberOf AntragView
   * @inner
   */
  const [scrollTop, setScrollTop] = React.useState(0)


  /**
   * Tracks the current vertical scrolling position of the window
   * and sets it to state [_scrollTop_]{@link AntragView~scrollTop}.
   *
   * @name useEffect
   * @function
   * @memberOf AntragView
   * @inner
   */
  React.useEffect(() => {
    const onScroll = (event) => {
      setScrollTop(event.target.documentElement.scrollTop)
    }
    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollTop])

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
          <MapAntragCard
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
  /**
   * Object that contains user credentials.
   */
  user: PropTypes.object,
  /**
   * Array that holds all created product offer instances.
   */
  antrags: PropTypes.array,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
  antrags: state.antrags,
})

export default connect(mapStateToProps)(AntragView)