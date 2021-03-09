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
  Checkbox,
  Link,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import EmailIcon from '@material-ui/icons/Email'
import PrintIcon from '@material-ui/icons/Print'
import { apiHost } from '../utils'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },

  title: {
    flex: '1 1 100%',
  },

  emptyMessage: {
    paddingLeft: theme.spacing(2),
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

const getComparator = (order, isCurrentHeader) => {
  if (!isCurrentHeader) {
    return 'asc'
  }

  if (order === 'asc') {
    return 'desc'
  }

  return 'asc'
}

const getSortedData = (data, orderBy, ascOrder) => {
    const sortedData = [...data]

    if (orderBy === null) {
      return sortedData
    }

    sortedData.sort((a, b) => {
      const av = a[orderBy].toLowerCase()
      const bv = b[orderBy].toLowerCase()

      if (av > bv) {
        return ascOrder ? 1 : -1
      }

      if (av < bv) {
        return ascOrder ? -1 : 1
      }

      return 0
    })

    console.log(sortedData)

    return sortedData
  }

export function DocumentTable(props) {

  const classes = useStyles()
  const {t} = useTranslation('document', 'common')
  const {data} = props
  const tableHeaders = [
    'name',
    'signed',
    'created',
  ]

  const [orderBy, setOrderBy] = React.useState(null)
  const [order, setOrder] = React.useState('asc')
  const [selected, setSelected] = React.useState([])


  const handleSort = (header) => (event) => {
    setOrder(getComparator(order, header === orderBy))
    setOrderBy(header)
  }

  const handleSelect = (event, id) => {
    const selectedIndex = selected.indexOf(id)

    if (selectedIndex === -1) {
      setSelected([
        ...selected,
        id,
      ])
      return
    }

    setSelected([
      ...selected.slice(0, selectedIndex),
      ...selected.slice(selectedIndex+1),
    ])
  }

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allSelected = data.map(row => row.id)
      setSelected(allSelected)
      return
    }

    setSelected([])
  }

  const isRowSelected = (id) => {
    return selected.indexOf(id) !== -1
  }

  const handleSend = () => {
    console.log('Send Documents:')
    console.log(selected)
  }

  const handlePrint = () => {
    console.log('Print Files:')
    data.forEach(row => {
      if (selected.includes(row.id)) {
        console.log(row.link)
        window.open(apiHost + row.link, "_blank")
      }
    })
  }

  //console.log(data)

  return (
    <Paper>

      {/* Table Title & Toolbar */}
      <Toolbar>
        <Typography
          className={classes.title}
          variant="h6"
          component="div"
        >
          {props.title}
        </Typography>

        {/* Actions */}
        {/* Send */}
        <Tooltip title={t("common:send")}>
          <div>
            <IconButton 
              onClick={handleSend}
              disabled={selected.length === 0}
            >
              <EmailIcon />
            </IconButton>
          </div>
        </Tooltip>

        {/* Print */}
        <Tooltip title={t("common:print")}>
          <div>
            <IconButton 
              onClick={handlePrint}
              disabled={selected.length === 0}
            >
              <PrintIcon />
            </IconButton>
          </div>
        </Tooltip>

      </Toolbar>

      {/* Table Data */}
      <Table
        size="medium"
        aria-label="data-table"
      >
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selected.length > 0 && selected.length < data.length}
                checked={data.length > 0 && data.length === selected.length}
                onChange={handleSelectAll}
              />
            </TableCell>
            {tableHeaders.map((header, index) => (
              <TableCell
                key={index}
                sortDirection={orderBy === header ? order : false}
              >
                <TableSortLabel
                  active={orderBy === header}
                  direction={orderBy === header ? order : 'asc'}
                  onClick={handleSort(header)}
                >
                  {t(header)}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedData(data, orderBy, order === 'asc').map((row) => (
            <TableRow
              key={row.id}
              className={classes.row}
              hover
              onClick={(event) => handleSelect(event, row.id)}
              role="checkbox"
              selected={isRowSelected(row.id)}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={isRowSelected(row.id)} />
              </TableCell>
              {tableHeaders.map(header => (
                <TableCell key={`${header}-${row.id}`}>
                  {row[header]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty Table Message */}
      {(!props.data || props.data.length === 0) &&
        <Typography
          className={classes.emptyMessage}
          variant="overline"
          component="div"
        >
          {t("empty")}
        </Typography>
      }
      
    </Paper>
  )
}


export function AttachmentTable(props) {

  const classes = useStyles()
  const {t} = useTranslation('attachment')
  const tableHeaders = [
    'name',
    'type',
    'created',
  ]

  const [orderBy, setOrderBy] = React.useState(null)
  const [order, setOrder] = React.useState('asc')


  const handleSort = (header) => (event) => {
    setOrder(getComparator(order, header === orderBy))
    setOrderBy(header)
  }

  const handleAction = (action, row) => {
    switch (action) {
      case "preview":
        window.open(apiHost + row.link, "_blank")
        return
      default:
        console.log(`Action: ${action}`)
        console.log(row)
        return
    }
  }

  return (
    <Paper>

      {/* Table Title & Toolbar */}
      <Toolbar>
        <Typography
          className={classes.title}
          variant="h6"
          component="div"
        >
          {props.title}
        </Typography>

        {/* Actions */}

      </Toolbar>

      {/* Table Data */}
      <Table
        size="medium"
        aria-label="data-table"
      >
        <TableHead>
          <TableRow>
            {tableHeaders.map((header, index) => (
              <TableCell
                key={index}
                sortDirection={orderBy === header ? order : false}
              >
                <TableSortLabel
                  active={orderBy === header}
                  direction={orderBy === header ? order : 'asc'}
                  onClick={handleSort(header)}
                >
                  {t(header)}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell>
              {t("actions")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {getSortedData(props.data, orderBy, order === 'asc').map((row) => (
            <TableRow
              key={row.id}
              className={classes.row}
              hover
            >
              {tableHeaders.map(header => (
                <TableCell key={`${header}-${row.id}`}>
                  {row[header]}
                </TableCell>
              ))}

              {/* Actions Cell */}
                <TableCell>
                  <Grid container spacing={1}>
                    {row.actions && row.actions.map((action) => (
                      <Grid item key={action}>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => handleAction(action, row)}
                        >
                          {t(`common:${action}`)},
                        </Link>
                      </Grid>
                    ))}
                    <Grid item>
                      <Link
                        classes={{root: classes.actionLink}}
                        component="button"
                        variant="body2"
                        onClick={() => handleAction('preview', row)}
                      >
                        {t("common:preview")}
                      </Link>
                    </Grid>
                  </Grid>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty Table Message */}
      {(!props.data || props.data.length === 0) &&
        <Typography
          className={classes.emptyMessage}
          variant="overline"
          component="div"
        >
          {t("empty")}
        </Typography>
      }
      
    </Paper>
  )
}