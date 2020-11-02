import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'

// product icons
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


export function ProductIcon(props) {
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