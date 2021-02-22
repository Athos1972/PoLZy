import React from 'react'
import clsx from 'clsx'
import { Tooltip, IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import { hideTime } from '../styles/cards'


export default function CardCloseButton(props) {
  const {t} = useTranslation('common')

  const handleClose = () => {
    props.onClose()
    setTimeout(() => {props.onDelete()}, hideTime)
  } 

  return (
    <Tooltip title={t('common:close')}>
      <IconButton 
        aria-label="close"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
    </Tooltip>
  )
}