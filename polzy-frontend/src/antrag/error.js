import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Typography, IconButton, Tooltip, Collapse } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import { CardErrorHide, CardError, CardTop, CardMiddle, hideTime } from '../styles/cards'
import { AntragTitle } from './components'
import { removeAntrag } from '../redux/actions'
import CardCloseButton from '../components/closeButton'

/**
 * This component renders a product offer card with the request status _failed_.
 * @see [MapAntragCard]{@link AntragView.MapAntragCard} for possible request status of product offer
 *
 * @component
 * @category Product Offer
 */
function ErrorAntrag(props) {
  const {index, antrag} = props
  const { t } = useTranslation('common')

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State: Boolean flag that defines the card visibility.
   * Used to animate the card appearance and closure. 
   *
   * @name isVisible
   * @default false
   * @prop {boolean} isVisible - state
   * @prop {function} setIsVisible - setter
   * @type {state}
   * @memberOf ErrorAntrag
   * @inner
   */
  const [isVisible, setIsVisible] = React.useState(false)

  /**
   * Implements animation of the card appearance
   * by setting state [isVisible]{@link ErrorAntrag~isVisible} to _true_.
   *
   * @name useEffect
   * @function
   * @memberOf ErrorAntrag
   * @inner
   */
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  return(
    <Collapse
      in={isVisible}
      timeout={hideTime}
      unmountOnExit
    >
      <CardError>
        <CardTop
          action={
            <CardCloseButton
              onClose={() => setIsVisible(false)}
              onDelete={() => props.closeAntrag(index)}
            />
          }
          title={<AntragTitle product={antrag.product_line.name} />}
        />
        <CardMiddle>
          <Typography
            component="p"
            variant="h5"
          >
            {"error" in antrag ? (antrag.error) : (t("antrag:invalid.antrag"))}
          </Typography>
        </CardMiddle>
      </CardError>
    </Collapse>
  )
}

ErrorAntrag.propTypes = {
  /**
   * The index of the product offer in the _redux_ store
   */
  index: PropTypes.number,
  /**
   * The product offer instance
   */
  antrag: PropTypes.object,
  /**
   * _Redux_ action that removes a product offer instance from the store
   */
  closeAntrag: PropTypes.func,
}

// connect to redux store
export default connect(null, {closeAntrag: removeAntrag})(ErrorAntrag)
