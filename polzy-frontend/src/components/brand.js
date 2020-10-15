import React from 'react'
import { SvgIcon } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import logo from '../logo/LEZYSEM5-01.svg'


export default function Brand(props) {
  const classes = useStyles(props)

  return(
    <div className={classes.brand}>
      {/*<SvgIcon component={logo} />*/}
      <img src={logo} height={props.size} />
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