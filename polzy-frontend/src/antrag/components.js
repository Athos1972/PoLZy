import React from 'react'
import { 
  Typography,
  FormControl,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'

/*
**   Title of Antrag Card
*/
export function AntragTitle(props) {
  const {t} = useTranslation('antrag')
  const {product} = props
  
  return(
    <Typography
      component="p"
      variant="h5"
    >
      {t('fast.offer') + ': ' + product}
    </Typography>
  )
}


/*
**  Card Input Field
*/
const ValueControl = withStyles((theme) => ({
  root: {
    width: "100%",
  }
}))(FormControl)

export function InputField(props) {
  const {data, value, onChange} = props

  return(
    <React.Fragment>
      <Tooltip
        title={data.tooltip}
        placement="top"
      >
        {data.inputRange.length > 0 ? (
          <ValueControl
            variant="outlined"
            size="small"
            required={data.isMandatory}
          >
            <InputLabel id={`${data.name}-label`}>
              {data.brief}
            </InputLabel>
            <Select
              labelId={`${data.name}-label`}
              id={data.name}
              value={value}
              onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
              label={data.brief}
            >
              {data.inputRange.map((value, index) => (
                <MenuItem key={index} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </ValueControl>
        ) : (
          <TextField
            label={data.brief}
            variant="outlined"
            size="small"
            value={value}
            onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
          />
        )}
      </Tooltip>
    </React.Fragment>
  )
}
