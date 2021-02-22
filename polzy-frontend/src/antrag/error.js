import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Typography, IconButton, Tooltip, Collapse } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import { CardErrorHide, CardError, CardTop, CardMiddle, hideTime } from '../styles/cards'
import { AntragTitle } from './components'
import { removeAntrag } from '../redux/actions'
import CardCloseButton from '../components/closeButton'


function ErrorAntrag(props) {
  const {index, antrag} = props
  const { t } = useTranslation('common')
  const [isVisible, setIsVisible] = React.useState(false)

  // card appear animation
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

// connect to redux store
export default connect(null, {closeAntrag: removeAntrag})(ErrorAntrag)
