import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  Toolbar,
  Typography,
  Paper,
  Tooltip,
  IconButton,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import FilterListIcon from '@material-ui/icons/FilterList'
import { makeStyles } from '@material-ui/core/styles'
import FilterMenu from './filterMenu'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },

  title: {
    flex: '1 1 100%',
  },

  row: {
    cursor: "pointer",
  },
}))

/**
 * Renders data field of type _Table_.
 *
 * @component
 * @category Data Fields
 */
function EnhancedTable(props) {

  const classes = useStyles()
  const {t} = useTranslation('common')
  /**
   * Table data extracted from _prop_ [data]{@link EnhancedTable}
   *
   * @name data
   * @type {object}
   * @memberOf EnhancedTable
   * @prop columns {array}
   * List of objects that describe the columns of the table.
   * Each object defines the following properties of the column:
   * @prop columns.label {string} - title of the column
   * @prop columns.type {string} - type of the values within the column.
   * Possible values: 'hidden', 'string', 'number'
   * @prop columns.filter {bool}
   * boolean flag that shows if the filtering by this column is available
   * @prop columns.isKey {bool}
   * boolean flag that shows if the current column keeps the key data of the records
   * (the key data is set to the value of the _Table_ data field when a row selected)
   * @prop rows {array}
   * list of row records. Each record is an array of values that correspond to the columns.
  */
  const {title, data} = props

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State<br/>
   * Header of a column according to which the table data should be ordered.
   *
   * @name orderBy
   * @default null
   * @prop {string|null} orderBy - state
   * @prop {function} setOrderBy - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [orderBy, setOrderBy] = React.useState(null)
  /**
   * State<br/>
   * Sets order direction. The ordering is aplied to the column defined by
   * state [orderBy]{@link EnhancedTable~orderBy}.<br/>
   * Possible values:
   * * 1 - ascending
   * * -1 - descending
   * * 0 - no ordering
   *
   * @name order
   * @default 0
   * @prop {number} order - state
   * @prop {function} setOrder - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [order, setOrder] = React.useState(1)
  /**
   * State<br/>
   * Defines which page of data is currently rendering.
   *
   * @name page
   * @default 0
   * @prop {number} page - state
   * @prop {function} setPage - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [page, setPage] = React.useState(0)
  /**
   * State<br/>
   * Defines the maximum number of data records (rows) per page.
   *
   * @name rowsPerPage
   * @default 5
   * @prop {number} rowsPerPage - state
   * @prop {function} setRowsPerPage - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  /**
   * State<br/>
   * The currently selected data record (row).
   *
   * @name selectedRow
   * @default null
   * @prop {array|null} selectedRow - state
   * @prop {function} setSelectedRow - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [selectedRow, setSelectedRow] = React.useState(null)
  /**
   * State<br/>
   * A list of the current filter options.
   * Pushed to component {@link FilterMenu} as a prop.
   * @see {@link FilterMenu} for description of the filter options.
   *
   * @name filterList
   * @default undefined
   * @prop {array} filterList - state
   * @prop {function} setFilterList - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [filterList, setFilterList] = React.useState()
  /**
   * State<br/>
   * Boolean flag that shows if state [filterList]{@link EnhancedTable~filterList}
   * should be [reset]{@link EnhancedTable.useEffect}.
   *
   * @name initFilterList
   * @default true
   * @prop {bool} initFilterList - state
   * @prop {function} setInitFilterList - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [initFilterList, setInitFilterList] = React.useState(true)
  /**
   * State: Boolean flag that opens [Filter Menu]{@link FilterMenu}.
   *
   * @name openFilterMenu
   * @default false
   * @prop {bool} openFilterMenu - state
   * @prop {function} setOpenFilterMenu - setter
   * @type {state}
   * @memberOf EnhancedTable
   * @inner
   */
  const [openFilterMenu, setOpenFilterMenu] = React.useState(false)


  /**
   * Resets state [filterList]{@link EnhancedTable~filterList}.
   * By default, the filter options bounds all possible values of data.
   * @see {@link FilterMenu} for description of the filter options.
   *
   * @name useEffect
   * @function
   * @memberOf EnhancedTable
   * @inner
   * @arg {bool} initFilterList
   * state [initFilterList]{@link EnhancedTable~initFilterList}
   */
  React.useEffect(() => {
    if (!initFilterList) {
      return
    }

    setFilterList(data === null ?
      null : 
      data.columns.map((col, index) => {  
        const {filter, ...colData} = col
        if (!filter) {
          return null
        }

        const values = data.rows.map((row) => (row.[index]))

        if (col.type === 'string') {
          return {
            ...colData,
            filter: false,
            values: values.reduce((result, string) => ({
              ...result,
              [string]: false,
            }), {}),
          }
        }

        if (col.type === 'number') {
          const min = Math.min(...values)
          const max = Math.max(...values)
          return {
            ...colData,
            filter: false,
            values: {
              min: min,
              max: max,
              range: [min, max],
            },
          }
        }
        return null
      })
    )
    setInitFilterList(false)
  }, [initFilterList])
   
  /**
   * Method<br/>
   * Creates a copy of the given list of filter options before pushing it to component {@link FilterMenu}.
   * @see {@link FilterMenu} for description of the filter options.
   *
   * @function
   * @arg {array} sourceList
   * A list of filter options to be cloned.
   * @returns {array}
   */
  const cloneFilterList = (sourceList) => {

    if (!sourceList) {
      return
    }
    
    return sourceList.map(item => {
      if (!Boolean(item)) {
        return null
      }

      const {values, ...otherKeys} = item
      const {range, otherValues} = {values}

      return Boolean(range) ?
      {
        ...otherKeys,
        values: {
          ...otherValues,
          range: [...range],
        }
      } :
      {
        ...otherKeys,
        values: {
          ...values,
        }
      }
    })
  }

  /**
   * Method<br/>
   * Returns a list of data rows which match the current filter options defined by
   * state [filterList]{@link EnhancedTable~filterList}.
   *
   * @function
   * @returns {array}
   */
  const rowFiltered = () => {
    return !filterList ? [] :
      data.rows.filter(row => (

        filterList.reduce((result, col, index) => {
          if (col === null || !col.filter) {
            return result && true
          }

          const {values} = col
          const valueToValidate = row[index] 

          if (col.type === 'string') {
            return result && values[valueToValidate]
          }

          return result && valueToValidate >= values.range[0] && valueToValidate <= values.range[1]
        }, true)
      ))
  }

  /**
   * Method<br/>
   * Returns a sorted list of data rows which match the current filter options.<br/>
   * States [orderBy]{@link EnhancedTable~orderBy} and [order]{@link EnhancedTable~order}
   * define the sort options.<br/>
   * Utilizes method [rowFiltered]{@link EnhancedTable.rowFiltered} to filter the data.
   *
   * @function
   * @returns {array}
   */
  const rowsSorted = () => {
    const index = data.columns.map((col) => (col.label)).indexOf(orderBy)
    if (index < 0) {
      return rowFiltered()
    }

    return rowFiltered().sort((a, b) => (
      a[index] > b[index] ? order : (
        a[index] < b[index] ? -order : 0
      )
    ))
  }

  /**
   * Method<br/>
   * Derives the sort direction of the current column to render its header component.
   *
   * @function
   * @arg {string} header
   * The header of the current column
   * @arg {bool} label
   * A boolean flag that shows the type of component which requested the method:
   * * _true_ - table sort label
   * * _false_ - table area-sort
   * @returns {'asc'|'desc'|fasle}
   */
  const sortDirection = (header, label=false) => {
    if (orderBy !== header) {
      return label ? 'asc' : false
    }

    return order === 1 ? 'asc' : 'desc'
  }

  /**
   * Method<br/>
   * Checks if state [selectedRow]{@link EnhansedTable~selectedRow} currently keeps the given row.
   *
   * @function
   * @arg {array} row
   * The row data
   * @returns {bool}
   */
  const isRowSelected = (row) => {

    if (!(selectedRow instanceof Array)) {
      return false
    }

    if (!(row instanceof Array)) {
      return false
    }

    if (row.length !== selectedRow.length) {
      return false
    }

    for (var index = 0; index < row.length; index++) {
      if (row[index] !== selectedRow[index]) {
        return false
      }
    }

    return true
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click a page button of the table pagination element.<br/>
   * **_Implementation:_** sets _newPage_ value to state [page]{@link EnhancedTable~page}.
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** change the value of number of rows of the table pagination element.<br/>
   * **_Implementation:_** sets the new value to state [rowsPerPage]{@link EnhancedTable~rowsPerPage}
   * and current page (state [page]{@link EnhancedTable~page}) to the first page.
   */
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click the sort label on column header.<br/>
   * **_Implementation:_** sets the given _header_ to state [orderBy]{@link EnhancedTable~orderBy}
   * and corresponded order direction (ascending if the header is newly clicked or
   * reversed in case of multiple clicks) to state [order]{@link EnhancedTable~order}.
   */
  const handleSort = (header) => (event) => {
    setOrder(header === orderBy ? -order : 1)
    setOrderBy(header)
  }

  /*
   * Callback<br/>
   * Fired when a filter option changed in component {@link FilterMenu}. 
   * @see {@link FilterMenu}
   *
   * @arg {array} newFilter
   * New filter options
   */
  const handleUpdateFilter = (newFilterList) => {
    setOpenFilterMenu(false)
    setFilterList(newFilterList)
  }

  /*
   * Callback<br/>
   * Fired when the filter options reset in component {@link FilterMenu}. 
   * @see {@link FilterMenu}
   */
  const handleResetFilter = () => {
    setInitFilterList(true)
  }


  /**
   * Event Handler<br/>
   * **_Event:_** click a data row.<br/>
   * **_Implementation:_**
   * * sets the hidden and key values of the given row to
   * the current [activity values]{@link ActiveAntrag~activityValues} of the product offer
   * * [updates]{@link ActiveAntrag.updateAntrag} the current product offer with
   * the hidden and key values
   * * sets the given _row_ to state [selectedRow]{@link EnhancedTable~selectedRow}
   *
   * @arg {array} row
   * the data of the clicked row
   */
  const handleRowClick = (row) => {
    // get hidden elements
    const hiddenValues = data.columns.reduce((result, col, index) => (
      col.type === 'hidden' || col.isKey ? {
        ...result,
        [col.label]: row[index], 
      } : result
    ), {})

    setSelectedRow(row)
    if (props.onChange) {
      props.onChange(hiddenValues)
    }
    if (props.updateParent) {
      props.updateParent(hiddenValues)
    }
  }

   /**
   * Event Handler<br/>
   * **_Event:_** double click a data row.<br/>
   * **_Implementation:_** closes the current activity of the product offer.
   */
  const handleRowDoubleClick = () => {
    if (props.onCloseActivity) {
      props.onCloseActivity()
    }
  }

  /**
   * Method<br/>
   * Checks if the filter button should be shown within the table header.
   * The filter button is visible if any column of the data allows filtering.
   * @see [data.columns]{@link EnhancedTable.data}
   *
   * @returns {bool} 
   */
  const showFilter = () => {
    return data.columns.reduce((result, col) => (result || col.filter), false)
  }

  //console.log('ENHANCED TABLE:')
  //console.log(props)
  //console.log(showFilter())
  //console.log('FILTER LIST')
  //console.log(filterList)
  //console.log(props)

  return (
    <Paper>

      {/* Table Title & Toolbar */}
      <Toolbar>
        <Typography
          className={classes.title}
          variant="h6"
          component="div"
        >
          {title}
        </Typography>

        {showFilter() &&
          <Tooltip title={t("common:filter")}>
            <div>
              <IconButton 
                aria-label="filter-list"
                onClick={() => setOpenFilterMenu(true)}
                disabled={data === null}
              >
                <FilterListIcon />
              </IconButton>
            </div>
          </Tooltip>
        }
      </Toolbar>

      {/* Table Data */}
      {data === null ? (
        <Typography
          className={classes.title}
          variant="button"
          component="div"
          align="center"
        >
          {t("error:no.data")}
        </Typography>
        ):(
        <React.Fragment>
          <Table
            aria-labelledby="table-title"
            size="medium"
            aria-label="data-table"
          >
            <TableHead>
              <TableRow>
                {data.columns.filter(col => col.type !== 'hidden').map(col => (
                  <TableCell
                    key={col.label}
                    sortDirection={sortDirection(col.label)}
                  >
                    <TableSortLabel
                      active={orderBy === col.label}
                      direction={sortDirection(col.label, true)}
                      onClick={handleSort(col.label)}
                    >
                    {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsSorted().slice(page*rowsPerPage, (page + 1)*rowsPerPage).map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={classes.row}
                  hover
                  selected={isRowSelected(row)}
                  onClick={() => handleRowClick(row)}
                  onDoubleClick={handleRowDoubleClick}
                >
                  {row.filter((value, index) => data.columns[index].type !== 'hidden').map((value, index) => (
                    <TableCell key={`${rowIndex}-${index}`}>
                      {value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={data.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />

          {/* Filter Menu */}
          <FilterMenu
            open={openFilterMenu}
            title={title}
            filterList={cloneFilterList(filterList)}
            onClose={() => setOpenFilterMenu(false)}
            onUpdateFilter={handleUpdateFilter}
            onResetFilter={handleResetFilter}
          />
        </React.Fragment>
      )}
    </Paper>
  )
}

EnhancedTable.propTypes = {
  /**
   * Title of the table
   */
  title: PropTypes.string,
  /**
   * Data of the table
   */
  data: PropTypes.object.isRequired,
  /**
   * Callback fired when a data row selected
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the current activity of the product offer should be closed
   */
  onCloseActivity: PropTypes.func,
  /**
   * Callback fired to update the parent instance 
   */
  updateParent: PropTypes.func,
}

export default EnhancedTable
