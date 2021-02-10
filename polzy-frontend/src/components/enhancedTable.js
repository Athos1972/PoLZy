import React from 'react'
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
import FilterListIcon from '@material-ui/icons/FilterList'
import { makeStyles } from '@material-ui/core/styles'


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

  filterMenu: {
    width: 300,
  },

  slider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "95%",
  },
}))

function FilterMenu(props) {
  const classes = useStyles()
  const {t} = useTranslation('common')
  const [filterList, setFilterList] = React.useState(props.filterList)

  React.useEffect(() => {
    setFilterList(props.filterList)
  }, [props.filterList])

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

  const handleSelect = (index) => (event, value) => {
    updateStringInFilterList(index, value)
  }

  const handleSliderChange = (index) => (event, value) => {
    updateNumberInFilterList(index, value)
  }

  const handleChangeMin = (index) => (event) => {
    updateNumberInFilterList(
      index, [
        event.target.value,
        filterList[index].values.range[1],
      ],
    )
  }

  const handleChangeMax = (index) => (event) => {
    updateNumberInFilterList(
      index,
      [
        filterList[index].values.range[0],
        event.target.value,
      ],
    )
  }

  const validateMin = (index) => {
    const {min, range} = filterList[index].values
    return range[0] >= min && range[0] < range[1]
  }

  const validateMax = (index) => {
    const {max, range} = filterList[index].values
    return range[1] > range[0] && range[1] <= max
  }

  const handleClear = () => {
    props.onResetFilter()
  }

  const handleApply = () => {
    props.onUpdateFilter(filterList)
  }

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
        {filterList.map((item, index) => (
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

export default function EnhancedTable(props) {

  const classes = useStyles()
  const {t} = useTranslation('common')
  const {title, data} = props

  const [orderBy, setOrderBy] = React.useState(null)
  const [order, setOrder] = React.useState(1)
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [selectedRow, setSelectedRow] = React.useState(null)

  const defaultFilterList = () => (
    data === null ? null : 
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
   
  const [filterList, setFilterList] = React.useState(defaultFilterList())
  const [openFilterMenu, setOpenFilterMenu] = React.useState(false)

  const cloneFilterList = (sourceList) => {
    
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

  // filter algorithm
  const rowFiltered = () => {
    return filterList === null ? [] :
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

  // sort algorithm
  const rowsSorted = () => {
    const index = data.columns.map((col) => (col.label)).indexOf(orderBy)
    if (index < 0) {
      return rowFiltered()
    }

    //const rowsCopy = [...props.data.rows]
    return rowFiltered().sort((a, b) => (
      a[index] > b[index] ? order : (
        a[index] < b[index] ? -order : 0
      )
    ))
  }

  const sortDirection = (header, label=false) => {
    if (orderBy !== header) {
      return label ? 'asc' : false
    }

    return order === 1 ? 'asc' : 'desc'
  }

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSort = (header) => (event) => {
    //console.log('Header Clicked:')
    //console.log(header)

    setOrder(header === orderBy ? -order : 1)
    setOrderBy(header)
  }

  const handleUpdateFilter = (newFilterList) => {
    //console.log('CLOSE:')
    
    setOpenFilterMenu(false)
    setFilterList(newFilterList)
  }

  const handleResetFilter = () => {
    setFilterList(defaultFilterList())
  }

  const handleRowClick = (row) => {
    // get hidden elements
    const hiddenValues = data.columns.reduce((result, col, index) => (
      col.type === 'hidden' || col.isKey ? {
        ...result,
        [col.label]: row[index], 
      } : result
    ), {})

    //console.log('row click')
    //console.log(hiddenValues)

    setSelectedRow(row)
    props.onChange(hiddenValues)
    if (props.updateAntrag) {
      props.updateAntrag(hiddenValues)
    }
  }

  const handleRowDoubleClick = () => {
    console.log('row doubled clicked:')
    //console.log(row)

    if (props.onCloseActivity) {
      props.onCloseActivity()
    } else {
      props.onChange()
    }
  }

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