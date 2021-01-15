import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { apiHost } from '../utils'

const uriBadge = apiHost + 'api/badge/'

export function BadgeToast(props) {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <img
          src={uriBadge + props.uri}
          height={25}
          alt="New Badge"
        />
      </Grid>

      <Grid item>
        <Typography
          variant="subtitle1"
          component="div"
        >
          {props.text}
        </Typography>
      </Grid>
    </Grid>
  )
}