import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../logo/POLZY_POLZY LIGHT.png'


export default function Brand(props) {
  const classes = useStyles(props)

  return(
    <div className={classes.brand}>
      <img src={logo} height={props.size} width={2*props.size} alt="PoLZy" />
    </div>
  )
}

const useStyles = makeStyles(props => ({
  brand: {
    display: "flex",
    justifyContent: "center",
    marginTop: props => props.marginTop,
    marginBottom: props => props.marginBottom,
  },
}))