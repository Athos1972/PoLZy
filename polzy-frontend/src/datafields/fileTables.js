import React from 'react'
import { connect } from 'react-redux'
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
  Box,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import EmailIcon from '@material-ui/icons/Email'
import PrintIcon from '@material-ui/icons/Print'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import DataFieldSelect from './selectField'
import { apiHost } from '../utils'
import { getFile, editFile, deleteFile, getDocuments } from '../api/general'


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

  filterMenu: {
    width: 300,
  },

  slider: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "95%",
  },
}))

const useRowStyles = makeStyles(theme => ({
  row: {
    cursor: "pointer",
  },

  editAction: {
    padding: theme.spacing(1),
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

    //console.log(sortedData)

    return sortedData
  }

function DocumentTableBase(props) {

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
    // build payload
    const payload = {
      parentId: props.parentId,
      documentsId: selected,
      action: "get",
    }

    // get documents
    getDocuments(props.user, payload).then(src => {
      // update antrag instance
      props.updateAntrag()

      // open document(s) in a new tab
      window.open(src, "_blank")
    }).catch(error => {
      console.log(error)
    })
  }

  //console.log('Document Table:')
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


function AttachmentRowBase(props) {
  const classes = useRowStyles()
  const {t} = useTranslation('common')

  const [typeEdit, setTypeEdit] = React.useState(false)
  const [fileType, setFileType] = React.useState(props.type)

  const handleAction = (action) => {
    //console.log(`Action: ${action}`)
    //console.log(props)

    switch (action) {
      case "preview":
        getFile(props.user, props.id).then(src => {
          window.open(src, "_blank")
        }).catch(error => {
          console.log(error)
        })
        return
      case "edit":
        setTypeEdit(true)
        return
      case "delete":
        deleteFile(props.user, props.id).then(() => {
          props.onDelete()
        }).catch(error => {
          console.log(error)
        })
        return
      default:
        console.log(`WARNING: no logic for action: ${action}`)
        return
    }
  }

  const handleTypeChange = (value) => {
    setFileType(value.fileType)
  }

  const handleCancelUpdate = () => {
    setTypeEdit(false)
  }

  const handleUpdate = () => {
    editFile(props.user, props.id, fileType).then(() => {
      props.onDelete()
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      setTypeEdit(false)
    })
  }

  return (
    <TableRow
      className={classes.row}
      hover
    >
      {props.headers.map(header => (
        <TableCell key={header}>
          {header === "type" && typeEdit ? (
            <Box display="flex">
              <Box flexGrow={1}>
                <DataFieldSelect
                  id={props.id}
                  value={fileType}
                  data={{
                    name: 'fileType',
                    brief: 'File Type',
                    inputRange: ['async', 'fileType'],
                  }}
                  hideHelper
                  onChange={handleTypeChange}
                />
              </Box>

              {/* Edit Actions */}
              <Tooltip title={t("common:accept")}>
                <div>
                  <IconButton
                    className={classes.editAction}
                    onClick={handleUpdate}
                  >
                    <CheckCircleIcon color="primary" />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip title={t("common:cancel")}>
                <div>
                  <IconButton
                    className={classes.editAction}
                    onClick={handleCancelUpdate}
                  >
                    <CancelIcon color="secondary" />
                  </IconButton>
                </div>
              </Tooltip>
            </Box>
          ) : (
            props[header]
          )}
        </TableCell>
      ))}

      {/* Actions Cell */}
        <TableCell>
          <Grid container spacing={1}>
            {props.actions && props.actions.map((action) => (
              <Grid item key={action}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => handleAction(action)}
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
                onClick={() => handleAction('preview')}
              >
                {t("common:preview")}
              </Link>
            </Grid>
          </Grid>
        </TableCell>
    </TableRow>
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
            <AttachmentRow
              {...row}
              key={row.id}
              headers={tableHeaders}
              onDelete={props.onDelete}
            />
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

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const AttachmentRow = connect(mapStateToProps)(AttachmentRowBase)
export const DocumentTable = connect(mapStateToProps)(DocumentTableBase)
