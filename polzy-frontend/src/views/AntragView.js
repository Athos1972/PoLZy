import React from 'react'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import NewAntrag from '../antrag/newAntrag'
import DisabledAntrag from '../antrag/disabled'
import ErrorAntrag from '../antrag/error'
import ActiveAntrag from '../antrag/active'

// set styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
}));

function AntragCard(props) {
  const { index, antrag } = props
  
  switch (antrag.request_state) {
    case "ok":
      return(
        <ActiveAntrag index={index} antrag={antrag} />
      )
    case "waiting":
      return(
        <DisabledAntrag index={index} antrag={antrag} />
      )
    default:
      return(
        <ErrorAntrag index={index} antrag={antrag} />
      )
  }
}

function AntragView(props) {
  const classes = useStyles()

  return(
    <div className={classes.container}>
      <NewAntrag />
      {props.antrags.map((antrag, index) => (
        <AntragCard key={`antrag-${antrag.key}`} index={index} antrag={antrag} />
      ))}
    </div>
  )
}

// connect to redux store
export default connect((state) => ({
  antrags: state.antrags,
}))(AntragView)