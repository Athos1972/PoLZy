import React from 'react'
import { 
  Button,
  CircularProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

// Styles
const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },

  button: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -theme.spacing(4) / 2,
    marginLeft: -theme.spacing(4) / 2,
  }
}))


/*
**  Button with progress 
*/
export default function ProgressButton(props) {
  const {title, loading, disabled, onClick } = props
  const classes = useStyles()

  return(
    <div className={classes.container}>
      <Button 
        variant="contained"
        color="primary"
        onClick={onClick}
        disabled={disabled || loading}
      >
        {title}
      </Button>
      {loading && <CircularProgress size={24} className={classes.button} />}
    </div>
  )
}