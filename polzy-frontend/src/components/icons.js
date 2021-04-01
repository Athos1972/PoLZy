import React from 'react'
import PropTypes from 'prop-types'
import SvgIcon from '@material-ui/core/SvgIcon'
import Icon from '@material-ui/core/Icon'
import { makeStyles } from '@material-ui/core/styles'

/*
** WARNING: importing product icons as component fails: something wrong with rendering layers
*/ 

// product icons
import carIcon from '../icons/car_filled.svg'
import docIcon from '../icons/document_filled.svg'
import forestIcon from '../icons/forest_filled.svg'
import handshakeIcon from '../icons/handshake_filled.svg'
import houseIcon from '../icons/house_filled.svg'
import medicineIcon from '../icons/medicine_filled.svg'

// activity icons
import { ReactComponent as Handshake } from '../icons/handshake_filled.svg'
import { ReactComponent as Calculate } from '../icons/calculate.svg'
import { ReactComponent as Pdf } from '../icons/pdf.svg'
import { ReactComponent as Partnersearch } from '../icons/partnersearch.svg'
import { ReactComponent as SaveToVNG } from '../icons/saveToVNG.svg'
import { ReactComponent as IconSaveRecommendation } from '../icons/iconSaveRecommendation.svg'
import { ReactComponent as IconSearchEurotax } from '../icons/iconSearchEurotax.svg'
import { ReactComponent as IconSearchPerson } from '../icons/iconSearchPerson.svg'
import { ReactComponent as IconUpDownload } from '../icons/downUploadDocuments.svg'
import { ReactComponent as IconQuestions } from '../icons/iconQuestions.svg'

//styles
const useStyles = makeStyles({
  svgIcon: {
    display: 'flex',
    height: 'inherit',
    width: 'inherit',
  }
})

/*
** Product Icon
*/
export function ProductIcon(props) {
  const classes = useStyles()

  const getIcon = () => {
    switch (props.icon) {
      case 'car_filled.svg':
        return carIcon
      case 'house_filled.svg':
        return houseIcon
      case 'document_filled.svg':
        return docIcon
      case 'forest_filled.svg':
        return forestIcon
      default:
        return handshakeIcon
    }
  } 
  
  return (
    <Icon>
      <img className={classes.svgIcon} src={getIcon()} alt={props.icon}/>
    </Icon>
  )
}

ProductIcon.propTypes = {
  icon: PropTypes.string,
}


/*
** Activity Icon
*/
export function ActivityIcon(props) {

  switch (props.icon) {
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
    case 'iconSaveRecommendation.svg':
      return (<SvgIcon>
          <IconSaveRecommendation />
        </SvgIcon>
        )
    case 'iconSearchEurotax.svg':
      return (
        <SvgIcon>
          <IconSearchEurotax />
        </SvgIcon>
        )
    case 'iconSearchPerson.svg':
      return (<SvgIcon>
          <IconSearchPerson />
        </SvgIcon>
        )
    case 'iconQuestions.svg':
      return (<SvgIcon>
          <IconQuestions />
        </SvgIcon>
        )
    case 'downUploadDocuments.svg':
      return (<SvgIcon>
          <IconUpDownload />
        </SvgIcon>
        )
    default:
      return <Handshake />
  }
}

ActivityIcon.propTypes = {
  icon: PropTypes.string,
}
