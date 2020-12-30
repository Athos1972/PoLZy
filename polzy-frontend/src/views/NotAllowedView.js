import React from 'react'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'


// set styles
const useStyles = makeStyles((theme) => ({
  main: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    fontSize: 24,
  },
}))

export default function NotAllowedView(props) {
  const classes = useStyles()
  const {t} = useTranslation('auth')

  return (
    <Typography
      className={classes.main}
      variant="button"
      component="p"
      align="center"
    >
      {t("auth:not.allowed")}
    </Typography>
  )
}