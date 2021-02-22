import React from 'react'
import clsx from 'clsx'
import { Tooltip, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useTranslation } from 'react-i18next'

export default function CLoseButton(props) {

  return (
    <Tooltip title={t('close')}>
      <IconButton 
        aria-label="close"
        onClick={handleCloseClick}
      >
        <CloseIcon />
      </IconButton>
    </Tooltip>
  )
}