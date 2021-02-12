import React from 'react'
import { connect } from 'react-redux'
import {
  Collapse,
  IconButton,
  Tooltip,
  CardHeader,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import { CardError } from '../styles/cards'
import { removePolicy, removeAntrag } from '../redux/actions'

function ErrorCard(props) {
  const {t} = useTranslation('common')
  const [open, setOpen] = React.useState(true)

  const handleClose = () => {
    // close error card
    setOpen(false)

    // delete object from redux store
    if (props.view === "policy") {
      props.removePolicy(props.index)
    }
    if (props.view === "antrag") {
      props.removeAntrag(props.index)
    }
  }

  console.log('ERROR CARD')
  console.log(props)

  return (
    <Collapse
      in={open}
      timeout="auto"
      unmountOnExit
    >
      <CardError>
        <CardHeader
          action={
            <Tooltip title={t('common:close')}>
              <IconButton 
                aria-label="close"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          }
          title={props.error.message}
        />
      </CardError>
    </Collapse>
  )
}

// connect to redux store
const mapDispatchToProps = {
  removePolicy: removePolicy,
  removeAntrag: removeAntrag,
}

export default connect(null, mapDispatchToProps)(ErrorCard)