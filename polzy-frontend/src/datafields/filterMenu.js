import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  Drawer,
  List,
  ListItem,
  Divider,
  Slider,
  TextField,
  Grid,
  Button,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'


const useStyles = makeStyles((theme) => ({
  filterMenu: {
    width: 300,
  },

  slider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "95%",
  },
}))

/**
 * Renders a filter menu for a [Table]{@link EnhancedTable} data field.
 *
 * @component
 * @category Data Fields
 */
function FilterMenu(props) {
  const classes = useStyles()
  const {t} = useTranslation('common')

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State<br/>
   * A list of the current filter options.
   * Each filter option is an object with keys described below.
   *
   * @name filterList
   * @default undefined
   * @prop {array} filterList - state
   * @prop {string} filterList.label
   * the label of the filter option
   * @prop {string} filterList.type
   * the type of the filter option: _string_ or _number_
   * @prop {bool} filterList.filter
   * if _true_, the filter option is active 
   * @prop {object} filterList.values
   * the values associated with the filter option based on the option type:
   * * string - each value is a pair _valueText_: _true_|_false_
   * * number - each value defines the high (prop _max_) and the low (prop _min_) boundaries
   * and the currently selected range of values<br/>_range_: [_selectedMinimum_, _selectedMaximum_]
   *
   * @prop {function} setFilterList - setter
   * @type {state}
   * @memberOf FilterMenu
   * @inner
   */
  const [filterList, setFilterList] = React.useState(props.filterList)

  /**
   * Sets prop [filterList]{@link FilterMenu} to
   * state [filterList]{@link FilterMenu~filterList}.
   *
   * @name useEffect
   * @function
   * @memberOf FilterMenu
   * @inner
   * @arg {bool} filterList
   * prop [filterList]{@link FilterMenu}
   */
  React.useEffect(() => {
    setFilterList(props.filterList)
  }, [props.filterList])

  /**
   * Method<br/>
   * Updates _filter_ and _values_ props of the item under the given _index_
   * in state [filterList]{@link FilterMenu~filterList} as follow:
   * * filter - _false_ if _selectedValues_ is an empty array
   * * values - sets _true_ to the listed in _selectedValues_ props and
   * _false_ to every another prop
   *
   * The item should be of type _string_. 
   *
   * @function
   * @arg {number} index
   * index of the item in state [filterList]{@link FilterMenu~filterList} to be updated
   * @arg {array} selectedValues
   * array of the currently selected values of the given _string_ item 
   */
  const updateStringInFilterList = (index, selectedValues) => {
    const {values, filter, ...otherKeys} = filterList[index]

    setFilterList([
      ...filterList.slice(0, index),
      {
        ...otherKeys,
        filter: selectedValues.length > 0,
        values: Object.keys(values).reduce((result, string) => ({
            ...result,
            [string]: selectedValues.includes(string),
          }), {}), 
      },
      ...filterList.slice(index + 1),
    ])
  }


  /**
   * Method<br/>
   * Updates _filter_ and _values.range_ props of the item under the given _index_
   * in state [filterList]{@link FilterMenu~filterList} as follow:
   * * filter - _false_ if the pushed _range_ equals to [_values.min_, _values.max_]
   * * values.range - sets to the pushed _range_
   *
   * The item should be of type _number_. 
   *
   * @function
   * @arg {number} index
   * index of the item in state [filterList]{@link FilterMenu~filterList} to be updated
   * @arg {array} range
   * array of two numeric values which will be the lower and the higher filter boundaries 
   */
  const updateNumberInFilterList = (index, range) => {
    const {values, filter, ...otherKeys} = filterList[index]

    setFilterList([
      ...filterList.slice(0, index),
      {
        ...otherKeys,
        filter: values.min !== range[0] || values.max !== range[1],
        values: {
          ...values,
          range: [...range],
        }, 
      },
      ...filterList.slice(index + 1),
    ])
  }

  /**
   * Event Handler<br/>
   * **_Event:_** select an item from a drop-down list within the filter menu.<br/>
   * **_Implementation:_** calls [updateStringInFilterList]{@link FilterMenu~updateStringInFilterList}.
   */
  const handleSelect = (index) => (event, value) => {
    updateStringInFilterList(index, value)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** change values of a slider within the filter menu.<br/>
   * **_Implementation:_** calls [updateNumberInFilterList]{@link FilterMenu~updateNumberInFilterList}
   * pushing the slider range to it.
   */
  const handleSliderChange = (index) => (event, value) => {
    updateNumberInFilterList(index, value)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** change the value of a left numeric input field within the filter menu.<br/>
   * **_Implementation:_** calls [updateNumberInFilterList]{@link FilterMenu~updateNumberInFilterList}
   * pushing the input value as the lower boundary of the filter range.
   */
  const handleChangeMin = (index) => (event) => {
    updateNumberInFilterList(
      index, [
        event.target.value,
        filterList[index].values.range[1],
      ],
    )
  }

  /**
   * Event Handler<br/>
   * **_Event:_** change the value of a right numeric input field within the filter menu.<br/>
   * **_Implementation:_** calls [updateNumberInFilterList]{@link FilterMenu~updateNumberInFilterList}
   * pushing the input value as the higher boundary of the filter range.
   */
  const handleChangeMax = (index) => (event) => {
    updateNumberInFilterList(
      index,
      [
        filterList[index].values.range[0],
        event.target.value,
      ],
    )
  }

  /**
   * Method<br/>
   * Checks if the value of a left numeric input field is between the lowest value
   * and the current high (right) value within the a numeric filter item.
   *
   * @function
   * @arg {number} index
   * index of the item in state [filterList]{@link FilterMenu~filterList} to be validated
   * @returns {bool}
   */
  const validateMin = (index) => {
    const {min, range} = filterList[index].values
    return range[0] >= min && range[0] < range[1]
  }

  /**
   * Method<br/>
   * Checks if the value of a right numeric input field is between the current low (left) value
   * and the highest value within the a numeric filter item.
   *
   * @function
   * @arg {number} index
   * index of the item in state [filterList]{@link FilterMenu~filterList} to be validated
   * @returns {bool}
   */
  const validateMax = (index) => {
    const {max, range} = filterList[index].values
    return range[1] > range[0] && range[1] <= max
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _clear_ button.<br/>
   * **_Implementation:_** calls prop [onResetFilter]{@link FilterMenu}
   */
  const handleClear = () => {
    props.onResetFilter()
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _apply_ button.<br/>
   * **_Implementation:_** calls prop [onUpdateFilter]{@link FilterMenu}
   */
  const handleApply = () => {
    props.onUpdateFilter(filterList)
  }

  //console.log('Filter Menu:')
  //console.log(props)

  return(
    <Drawer 
      anchor="right"
      open={props.open}
      onClose={props.onClose}
    >
      <List classes={{root: classes.filterMenu}}>
        <ListItem>
          <Typography
            id="filter-title"
            variant="h6"
            component="div"
          >
            {props.title}
          </Typography>
        </ListItem>
        {Boolean(filterList) && filterList.map((item, index) => (
          <React.Fragment key={index}>
          {Boolean(item) &&
            <React.Fragment>
              <ListItem>
                <Typography
                  id={`${item.label}-label`}
                  variant="subtitle2"
                  component="div"
                >
                  {item.label}
                </Typography>
              </ListItem>
              <ListItem>
                {item.type === 'string' ? (
                  <Autocomplete
                    multiple
                    fullWidth
                    id={`${item.label}-select`}
                    options={Object.keys(item.values).sort()}
                    value={Object.keys(item.values).filter(value => item.values[value])}
                    onChange={handleSelect(index)}
                    filterSelectedOptions
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                      />
                    )}
                  />
                ) : (
                  <Grid
                    container
                    direction="column"
                    spacing={1}
                  >
                    <Grid item container spacing={1}>
                      <Grid item xs={5}>
                        <TextField
                          error={!validateMin(index)}
                          value={item.values.range[0]}
                          onChange={handleChangeMin(index)}
                          variant="outlined"
                          size="small"
                          inputProps={{
                            min: item.values.min,
                            max: item.values.max,
                            type: 'number',
                          }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Typography
                          variant="h5"
                          component="div"
                          align="center"
                        >
                          &mdash;
                        </Typography>
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          error={!validateMax(index)}
                          value={item.values.range[1]}
                          onChange={handleChangeMax(index)}
                          type="number"
                          variant="outlined"
                          size="small"
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Slider
                        classes={{root: classes.slider}}
                        min={item.values.min}
                        max={item.values.max}
                        value={item.values.range}
                        onChange={handleSliderChange(index)}
                        valueLabelDisplay="auto"
                        marks={[
                          {
                            value: item.values.min,
                            label: item.values.min,
                          },
                          {
                            value: item.values.max,
                            label: item.values.max,
                          }
                        ]}
                        aria-labelledby={`${item.label}-label`}
                      />
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          }
          </React.Fragment>
        ))}
        <ListItem>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                size="small"
                onClick={handleApply}
              >
                {t("common:apply")}
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                size="small"
                onClick={handleClear}
              >
                {t("common:clear")}
              </Button>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Drawer>
  )
}

FilterMenu.propTypes = {
  /**
   * Boolean flag that shows if the component should be rendered
   */
  open: PropTypes.bool.isRequired,
  /**
   * The title of the menu
   */
  title: PropTypes.string,
  /**
   * A list of the current filter options
   */
  filterList: PropTypes.array.isRequired,
  /**
   * Callback that closes the menu
   */
  onClose: PropTypes.func,
  /**
   * Callback that updates the filter options within the parent component
   */
  onUpdateFilter: PropTypes.func,
  /**
   * Callback that resets the filter options within the parent component
   */
  onResetFilter: PropTypes.func,
}

export default FilterMenu