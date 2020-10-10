import React from 'react'
import { Grid, Card, CardHeader, CardActions, CardContent, Typography, Button, IconButton } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'

const CardError = withStyles(() => ({
  root: {
    backgroundColor: "#fbb",
  },
}))(Card)

const CardErrorHeader = withStyles(() => ({
  root: {
    paddingBottom: 0,
  },
}))(CardHeader)

const CardErrorContent = withStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingTop: 0,
  },
}))(CardActions)

const useStyles = makeStyles({
  card: {
    backgroundColor: "#fbb",
  },

  cardText: {
    color: "#b71c1c",
  },
})

export default function ErrorPolicy(props) {

  const {policy} = props
  const classes = useStyles()

  return(
    <CardError>
      <CardErrorHeader
        action={ 
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        }
        title={"Policy #" + policy.number}
        subheader={policy.date}
      />
      <CardErrorContent>
        <Typography
          className={classes.cardText}
          component="p"
          variant="h5"
        >
          {policy.status === "failed" ? ("Policy Not Found") : ("Invalid Response Status")}
        </Typography>
      </CardErrorContent>
    </CardError>
  )
}
