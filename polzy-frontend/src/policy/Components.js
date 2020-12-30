import React from 'react'
import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'


export function PolicyTitle(props) {
  const {t} = useTranslation('policy')
  const {number} = props
  
  return(
    <Typography
      component="p"
      variant="h5"
    >
      {t('policy') + ' ' + number}
    </Typography>
  )
}
