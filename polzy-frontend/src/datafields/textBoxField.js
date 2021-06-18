import React from 'react'
import PropTypes from 'prop-types'
import { TextField } from '@material-ui/core'


/**
 * Renders data field of type _TextBox_.
 *
 * @component
 * @category Data Fields
 */
function DataFieldLongText(props) {
  /**
   * Field data extracted from _prop_ [data]{@link DataFieldLongText}
   *
   * @name data
   * @type {object}
   * @memberOf DataFieldLongText
   * @prop {string} name
   * the name of the field
   * @prop {string} brief
   * a short description of the field
   * @prop {bool} isMandatory
   * a boolean flag that shows if the field is mandatory
   */
  const {data, value} = props

  /**
   * Event Handler<br/>
   * **_Event:_** change input value.<br/>
   * **_Implementation:_** calls prop [onChange]{@link DataFieldLongText}
   * pushing to it a pair of the field name and current value:
   * ```javascript
   * {
   *   <datafieldName>: <currentValue>
   * }
   * ```
   */
  const handleChange = (event) => {
    props.onChange({
      [data.name]: event.target.value
    })
  }

  return (
    <TextField
      id={`${data.name}`}
      label={data.brief}
      multiline
      fullWidth
      variant="outlined"
      value={value ? value : ""}
      onChange={handleChange}
      required={data.isMandatory}
      size="small"
    />
  )
}

DataFieldLongText.propTypes = {
  /**
   * ID of the parent instance
   */
  id: PropTypes.string,
  /**
   * Field data (see [data]{@link DataFieldText.data})
   */
  data: PropTypes.object.isRequired,
  /**
   * Value of the text field
   */
  value: PropTypes.string,
  /**
   * Callback fired to change the value of the data field
   */
  onChange: PropTypes.func.isRequired,
}

export default DataFieldLongText
