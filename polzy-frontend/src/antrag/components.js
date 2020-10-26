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
  InputAdornment,
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
export function InputField(props) {
  const {data, value, onChange } = props

  const handleBlur = () => {
    const min = Number(data.inputRange[1])
    const max = Number(data.inputRange[2])
    if (value < min) {
      onChange(data.name, data.fieldDataType, min)
    } else if (value > max) {
      onChange(data.name, data.fieldDataType, max)
    }
  }

  const withAdornment = /^Euro/.test(data.valueChosenOrEnteredOutput)

  return(
    <React.Fragment>
      <Tooltip
        title={data.tooltip}
        placement="top"
      >
        <FormControl
          variant="outlined"
          size="small"
          fullWidth
          required={data.isMandatory}
        >
          <InputLabel htmlFor={`${data.name}`}>
            {data.brief}
          </InputLabel>
          {data.inputRange.length > 0 ? (
            <React.Fragment>
              {data.fieldDataType === "Zahl" && data.inputRange[0] === "range" ? (
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
              ) : (
                <Select
                  id={data.name}
                  value={value}
                  onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
                  label={data.brief}
                  renderValue={(v) => (withAdornment ? `€ ${v}` : v)}
                >
                  {data.inputRange.map((itemValue, index) => (
                    <MenuItem key={index} value={itemValue}>
                      {itemValue}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </React.Fragment>
          ) : (
            <OutlinedInput
              id={data.name}
              value={value}
              onChange={(event) => onChange(data.name, data.fieldDataType, event.target.value)}
              label={data.brief}
            />
          )}
        </FormControl>
      </Tooltip>
    </React.Fragment>
  )
}
