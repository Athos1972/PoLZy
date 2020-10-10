import React from 'react'
import { Grid, Card, CardHeader, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'


export default function DisabledPolicy(props) {

  const policy = props.policy
  const classes = useStyles()

  function Row(props) {
    return(
      <React.Fragment>
        <Grid item xs={4}>
          <Typography
            component="p"
            variant="h5"
          >
            {props.title}:
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            className={classes.value}
            component="p"
            variant="h5"
          >
            {props.value}
          </Typography>
        </Grid>
      </React.Fragment>
    )
  }

  return(
    <Card classes={{root: classes.card}}>
      <CardHeader
        title={"Policy #" + policy.number}
        subheader={policy.date}
      />
    </Card>
  )
}

const useStyles = makeStyles({
  card: {
    backgroundColor: "#ccc",
  },

  value: {
    color: "#555",
  },

})