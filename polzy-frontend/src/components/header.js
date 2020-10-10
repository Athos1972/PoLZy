import React from 'react'
import { Toolbar, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Brand from './brand'

export default function Header(props){
  const classes = useStyles()

  return(
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
      <div className={classes.title}>
        <Brand fontSize={40} marginBottom={10} />
      </div>
      <Typography
        classes={{root: classes.user}}
        variant="button"
      >
        Admin
      </Typography>
      <Button 
        variant="outlined"
        size="small"
        onClick={props.auth}
      >
        Sign out
      </Button>
      </Toolbar>
    </React.Fragment>
  )
}

const useStyles = makeStyles({
  toolbar: {
    borderBottom: "2px solid",
    //borderBottomColor: "#00c853",
    borderBottomColor: "#aaa",
    marginBottom: 10,
  },

  title: {
    flex: 1,
  },

  user: {
    marginRight: 10,
    color: "grey",
  }
})