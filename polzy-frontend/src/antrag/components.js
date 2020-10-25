import React from 'react'
import { 
  Typography,
  FormControl,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
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

  const handleBlur = () => {
    const min = Number(data.inputRange[1])
    const max = Number(data.inputRange[2])
    if (value < min) {
      onChange(data.name, data.fieldDataType, min)
    } else if (value > max) {
      onChange(data.name, data.fieldDataType, max)
    }
  }

  return(
    <React.Fragment>
      <Tooltip
        title={data.tooltip}
        placement="top"
      >
        {data.inputRange.length > 0 ? (
          <React.Fragment>
            {data.fieldDataType === "Zahl" && data.inputRange[0] === "range" ? (
              <FormControl
                variant="outlined"
                size="small"
                fullWidth
                required={data.isMandatory}
              >
                <InputLabel htmlFor={`${data.name}`}>
                  {data.brief}
                </InputLabel>
                <OutlinedInput
                  id={data.name}
                  value={value}
                  onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
                  onBlur={handleBlur}
                  label={data.brief}
                  inputProps={{
                    min: Number(data.inputRange[1]),
                    max: Number(data.inputRange[2]),
                    type: 'number',
                  }}
                />
              </FormControl>
            ) : (
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
            )}
          </React.Fragment>
        ) : (
          <TextField
            label={data.brief}
            variant="outlined"
            size="small"
            value={value}
            required={data.isMandatory}
            onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
          />
        )}
      </Tooltip>
    </React.Fragment>
  )
}
