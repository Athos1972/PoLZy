import React from 'react'
import { Typography } from '@material-ui/core'
import { withTranslation, useTranslation } from 'react-i18next'


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

export function PolicyTitle2(props) {
  const {t} = useTranslation('policy')
  const {number} = props

  return(
    <React.Fragment>
      {t('policy') + ' ' + number}
    </React.Fragment>
  )
}