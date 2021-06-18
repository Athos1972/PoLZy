import React from 'react'
import PropTypes from 'prop-types'
import { 
  Grid,
  Typography,
  FormHelperText,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { DataFieldSlider, SliderTitle, SliderTextLabel } from './styled'
import { validateIBAN } from '../utils'
import { inputFieldStyle, parseValue, typingTimeoutWithInputTrigger } from './util'

// Styles
const useStyles = makeStyles((theme) => ({
  slider: {
    root: {
      padding: 0,
      color: props => props.error ? theme.palette.error.main : theme.palette.primary.main,
    },
    rail: {
      height: 5,
    },
  },

}))


/**
 * Renders data field of type _Text_ with the predefined values as a slider.
 *
 * @component
 * @category Data Fields
 */
function DataFieldTextSlider(props) {
  /**
   * Field data extracted from _prop_ [data]{@link DataFieldTextSlider}
   *
   * @name data
   * @type {object}
   * @memberOf DataFieldTextSlider
   * @prop {string} name
   * the name of the data field
   * @prop {string} brief
   * a short description of the data field
   * @prop {array} inputRange
   * a list of the predefined values of the data field
   * (the 1st value defines the rendering component - '_slider_' - and will be omitted)
   * @prop {bool} inputTriggers
   * a boolean flag that shows if the parent instance should be updated
   * on the back-end using the current input value
   * @prop {string} [errorMessage]
   * error message of the field retrieved from the back-end
   */
  const {id, data } = props
  const {inputRange} = data 

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State<br/>
   * A boolean flag that shows if the current input value is invalid.
   *
   * @name error
   * @default fasle
   * @prop {bool} error - state
   * @prop {function} setError - setter
   * @type {state}
   * @memberOf DataFieldTextSlider
   * @inner
   */
  const [error, setError] = React.useState(false)
  /**
   * State<br/>
   * A helper text rendered under the input field.
   *
   * @name helperText
   * @default ''
   * @prop {string} helperText - state
   * @prop {function} setHelperText - setter
   * @type {state}
   * @memberOf DataFieldTextSlider
   * @inner
   */
  const [helperText, setHelperText] = React.useState('')
  /**
   * State<br/>
   * The index of the current value from predefined [inputRange]{@link DataFieldTextSlider.data}.
   *
   * @name index
   * @prop {number} index - state
   * @prop {function} setIndex - setter
   * @type {state}
   * @memberOf DataFieldTextSlider
   * @inner
   */
  const [index, setIndex] = React.useState(inputRange.indexOf(props.value))

  const classes = useStyles({error: error})

  /**
   * Event Handler<br/>
   * **_Event:_** slider's value changed.<br/>
   * **_Implementation:_** sets index of a new value to state
   * [index]{@link DataFieldTextSlider~index}
   */
  const handleChange = (event, newIndex) => {
    setIndex(newIndex)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** mouse-up after slider's value changed.<br/>
   * **_Implementation:_** pushes the new value to prop [onInputTrigger]{@link DataFieldTextSlider}
   * if [inputTriggers]{@link DataFieldTextSlider.data} is _true_.
   * Otherwise pushes the new value to prop [onChange]{@link DataFieldTextSlider}
   */
  const handleChangeCommitted = (event, newIndex) => {
    const newValue = {[props.data.name]: inputRange[newIndex]}
    if (props.onInputTrigger && props.data.inputTriggers) {
        // input trigger
        props.onInputTrigger(newValue)
      } else if (props.onChange) {
        // update antrag value
        props.onChange(newValue)
      }
  }

  /**
   * Sets [errorMessage]{@link DataFieldTextSlider.data} from the back-end
   * to state [helperText]{@link DataFieldTextSlider~helperText}.
   *
   * @name useEffect
   * @function
   * @memberOf DataFieldTextSlider
   * @inner
   * @arg {string} data.errorMessage
   * prop [data.errorMessage]{@link DataFieldTextSlider.data}
   */
  React.useEffect(() => {
    // check if error comes from backend
    if (Boolean(data.errorMessage)) {
      setHelperText(data.errorMessage)
      setError(true)
      return
    }

    setError(false)
    setHelperText('')
  }, [data.errorMessage])

  /**
   * Inner Component<br/>
   * Renders the predefined values within the slider's label.
   */
  const RenderValueLabel = (props) => {
   
    return (
      <SliderTextLabel
        {...props}
        value={props.value <= 1 ? inputRange[1] : inputRange[props.value]}
      />  
    )
  }

  //console.log(`Value: ${value}`)
  //console.log(typeof(value))

  return (
    <React.Fragment>
      <Grid container spacing={1}>
        <Grid item xs={12} container spacing={1}>
          <Grid item xs>
            <SliderTitle
              id={`${data.name}-${id}`}
              component="div"
            >
              <strong>
                {`${data.brief}:`}
              </strong>
            </SliderTitle>
          </Grid>
          <Grid item>
            <SliderTitle
              component="div"
            >
              {inputRange[index]}
            </SliderTitle>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <DataFieldSlider
            className={classes.slider}
            aria-labelledby={`${data.name}-${id}`}
            valueLabelDisplay="auto"
            value={index}
            min={1}
            max={inputRange.length-1}
            onChange={handleChange}
            onChangeCommitted={handleChangeCommitted}
            ValueLabelComponent={RenderValueLabel}
          />
        </Grid>
      </Grid>
      <FormHelperText error={error}>
        {helperText}
      </FormHelperText>
    </React.Fragment>
  )
}


DataFieldTextSlider.propTypes = {
  /**
   * ID of the parent instance
   */
  id: PropTypes.string.isRequired,
  /**
   * Field data (see [data]{@link DataFieldTextSlider.data})
   */
  data: PropTypes.object.isRequired,
  /**
   * Value of the data field
   */
  value: PropTypes.string,
  /**
   * Callback fired to change the value of the data field
   */
  onChange: PropTypes.func,
  /**
   * Callback fired to update the parent instance on the back-end using the current input value
   */
  onInputTrigger: PropTypes.func,
}

export default DataFieldTextSlider
