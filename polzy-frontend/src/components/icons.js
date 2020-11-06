import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'

// product icons
// as objects
import carIcon from '../icons/car_filled.svg'
import docIcon from '../icons/document_filled.svg'
import forestIcon from '../icons/forest_filled.svg'
import handshakeIcon from '../icons/handshake_filled.svg'
import houseIcon from '../icons/house_filled.svg'
import medicineIcon from '../icons/medicine_filled.svg'

// as component
import { ReactComponent as Car } from '../icons/car_filled.svg'
import { ReactComponent as Document } from '../icons/document_filled.svg'
import { ReactComponent as Forest } from '../icons/forest_filled.svg'
import { ReactComponent as Handshake } from '../icons/handshake_filled.svg'
import { ReactComponent as House } from '../icons/house_filled.svg'
import { ReactComponent as Medicine } from '../icons/medicine_filled.svg'

// activity icons
import { ReactComponent as Calculate } from '../icons/calculate.svg'
import { ReactComponent as Pdf } from '../icons/pdf.svg'
import { ReactComponent as Partnersearch } from '../icons/partnersearch.svg'
import { ReactComponent as SaveToVNG } from '../icons/saveToVNG.svg'

const useStyles = makeStyles({
  svgIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  }
})

export function ProductIcon(props) {
  //const {icon} = props

  const classes = useStyles()
  //console.log(classes.svgIcon)

  const icon = () => {
    switch (props.icon) {
      case 'AntragKF':
        return carIcon
      case 'AntragWo':
        return houseIcon
      case 'AntragRS':
        return docIcon
      case 'AntragLV':
        return forestIcon
      default:
        return handshakeIcon
    }
  } 
  
  return (
    <Icon>
      <img className={classes.svgIcon} src={icon()}/>
    </Icon>
  )
}


export function ProductIconSvg(props) {
  const {icon} = props

  //console.log(Car)
  
  switch (icon) {
    case 'AntragKFZ':
      return (
        <SvgIcon shapeRendering="geometricPrecision">
          <Car />
        </SvgIcon>
      )
    case 'AntragWohnen':
      return (
        <SvgIcon>
          <House />
        </SvgIcon>
      )
    case 'AntragRS':
      return (
        <SvgIcon>
          <Document />
        </SvgIcon>
      )
    default:
      return (
        <SvgIcon>
          <Handshake />
        </SvgIcon>
      )
  }
}

export function ActivityIcon(props) {
  const {icon} = props

  switch (icon) {
    case 'calculate.svg':
      return (
        <SvgIcon>
          <Calculate />
        </SvgIcon>
      )
    case 'pdf.svg':
      return (
        <SvgIcon viewBox="0 0 48 48">
          <Pdf />
        </SvgIcon>
      )
    case 'partnersearch.svg':
      return (
        <SvgIcon viewBox="0 0 964.8 964.8">
          <Partnersearch />
        </SvgIcon>
      )
    case 'saveToVNG.svg':
      return (
        <SvgIcon>
          <SaveToVNG />
        </SvgIcon>
      )
    default:
      return <Handshake />
  }
}