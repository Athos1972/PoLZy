import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { LinearProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { CardDisabled, CardTop, CardMiddle } from '../styles/cards'
import { AntragTitle } from './components'
import { updateAntrag } from '../redux/actions'
import { fetchAntrag } from '../api/antrag'

/**
 * Waiting Animation Element
 */
const WaitingProgress = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  }
}))(LinearProgress)


/**
 * This component renders a product offer card with the request status _waiting_.
 * @see [MapAntragCard]{@link AntragView.MapAntragCard} for possible request status of product offer
 *
 * @component
 * @category Product Offer
 */
function DisabledAntrag(props) {
  const {index, antrag} = props

  /**
   * Calls the back-end [fetchAntrag]{@link module:Antrag.fetchAntrag} for a product offer instance, when the component is mounted.
   * Then pushes to prop [updateAntrag]{@link DisabledAntrag}:
   * * the received product offer instance if the response is _OK_
   * * the current product offer instance with state _failed_ if the response is _error_
   *
   * @name useEffect
   * @function
   * @memberOf DisabledAntrag
   * @inner
   */
  React.useEffect(() => {
    // fetch antrag data
    fetchAntrag(props.user, antrag).then(data => {
      if ('error' in data) {
        props.updateAntrag(
          index,
          {
            ...antrag,
            request_state: "failed",
            ...data,
          }
        )
      } else {
        props.updateAntrag(
          index,
          {
            request_state: "ok",
            addressList: {},
            ...data,
          }
        )
      }
    })
  }, [])

  //console.log('Disabled Antrag:')
  //console.log(props)

  return(
    <CardDisabled>
      <CardTop
        title={<AntragTitle product={antrag.product_line.name} />}
      />
      <CardMiddle>
        <WaitingProgress />
      </CardMiddle>
    </CardDisabled>
  )
}

DisabledAntrag.propTypes = {
  /**
   * The index of the product offer in the _redux_ store
   */
  index: PropTypes.number,
  /**
   * The product offer instance
   */
  antrag: PropTypes.object,
  /**
   * Object that contains the user credentials
   */
  user: PropTypes.object,
  /**
   * _Redux_ action that updates product offer instance in the store
   */
  updateAntrag: PropTypes.func,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  updateAntrag: updateAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(DisabledAntrag)