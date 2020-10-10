import React from 'react'
import { makeStyles } from '@material-ui/core/styles'


export default function Brand(props) {
  const classes = useStyles(props)

  return(
    <div className={classes.brand}>
      PoLZy
    </div>
  )
}

const useStyles = makeStyles({
  brand: {
    display: "flex",
    justifyContent: "center",
    color: "#00c853",
    fontFamily: "Indie Flower",
    fontWeight: 800,
    fontSize: props => props.fontSize,
    marginTop: props => props.marginTop,
    marginBottom: props => props.marginBottom,
  },
})