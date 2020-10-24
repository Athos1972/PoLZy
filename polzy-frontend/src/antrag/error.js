import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import { CardErrorHide, CardError, CardTop, CardMiddle, hideTime } from '../policy/CardStyles'
import { AntragTitle } from './components'
import { removeAntrag } from '../redux/actions'

function AntragCard(props) {
  const {hidden, content} = props

  return(
    <React.Fragment>
      {hidden ? (
        <CardErrorHide>
          {content}
        </CardErrorHide>
      ) : (
        <CardError>
          {content}
        </CardError>
      )}
    </React.Fragment>
  )
}

function ErrorAntrag(props) {
  const {index, antrag} = props
  const { t } = useTranslation('antrag', 'policy')
  const [hidden, setHidden] = useState(false)

  const handleCloseClick = () => {
    setHidden(true)
    setTimeout(() => {props.closeAntrag(index)}, hideTime)
  }

  return(
    <AntragCard
      hidden={hidden}
      content={
        <React.Fragment>
          <CardTop
            action={
              <Tooltip title={t('policy:close')}>
                <IconButton 
                  aria-label="close"
                  onClick={handleCloseClick}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
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
        </React.Fragment>
      }
    />
  )
}

// connect to redux store
export default connect(null, {closeAntrag: removeAntrag})(ErrorAntrag)
