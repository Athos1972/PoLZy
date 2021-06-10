import React from 'react'
import PropTypes from 'prop-types'
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
import { getFile, editFile, deleteFile, getDocuments, generateEml } from '../api/general'
import {comparator, sortedData} from './tableUtils'


const useStyles = makeStyles((theme) => ({
  row: {
    cursor: "pointer",
  },

  title: {
    flex: '1 1 100%',
  },

  emptyMessage: {
    paddingLeft: theme.spacing(2),
  },
}))


/**
 * Renders data field of type _Documents_.
 *
 * @component
 * @category Data Fields
 */
function DocumentTable(props) {

  const classes = useStyles()
  const {t} = useTranslation('document', 'common')
  const {data} = props

  /**
   * Defines the headers of the columns to be rendered within the component and its order.
   *
   * @type {array}
   */
  const tableHeaders = [
    'name',
    'signed',
    'created',
  ]

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State<br/>
   * Header of a table column acoording to which the documents should be ordered.
   *
   * @name orderBy
   * @default null
   * @prop {string|null} orderBy - state
   * @prop {function} setOrderBy - setter
   * @type {state}
   * @memberOf DocumentTable
   * @inner
   */
  const [orderBy, setOrderBy] = React.useState(null)
  /**
   * State<br/>
   * Sets order direction. The ordering is aplied to the column defined by
   * state [orderBy]{@link DocumentTable~orderBy}.<br/>
   * Possible values:
   * * 'asc' - ascending
   * * 'desc' - descending
   *
   * @name order
   * @default 'asc'
   * @prop {string} order - state
   * @prop {function} setOrder - setter
   * @type {state}
   * @memberOf DocumentTable
   * @inner
   */
  const [order, setOrder] = React.useState('asc')
  /**
   * State<br/>
   * The currently selected documents (rows).
   *
   * @name selected
   * @default []
   * @prop {array} selected - state
   * @prop {function} setSelected - setter
   * @type {state}
   * @memberOf DocumentTable
   * @inner
   */
  const [selected, setSelected] = React.useState([])

  /**
   * Event Handler<br/>
   * **_Event:_** click the sort label within a column header.<br/>
   * **_Implementation:_** sets the given _header_ to state [orderBy]{@link DocumentTable~orderBy}
   * and corresponded order direction (see [comparator]{@link module:tableUtils~comparator})
   * to state [order]{@link DocumentTable~order}.
   *
   * @arg {string} header
   * the header of the column that the documents should be sorted by
   */
  const handleSort = (header) => (event) => {
    setOrder(comparator(order, header === orderBy))
    setOrderBy(header)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click a check-box of a document (table row).<br/>
   * **_Implementation:_** if the current document's ID is not in the list of
   * state [selected]{@link DocumentTable~selected} then adds it there.
   * Otherwise, removes the current document's ID from state [selected]{@link DocumentTable~selected}.
   */
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

  /**
   * Event Handler<br/>
   * **_Event:_** click '_Select All_' check-box.<br/>
   * **_Implementation:_** adds ID of all the documents to state
   * [selected]{@link DocumentTable~selected} if the box is not checked.
   * Otherwise, removes all documents from state [selected]{@link DocumentTable~selected}.
   */
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allSelected = data.map(row => row.id)
      setSelected(allSelected)
      return
    }

    setSelected([])
  }

  /**
   * Method<br/>
   * Checks if state [selectedRow]{@link EnhansedTable~selectedRow}
   * holds the given document's ID.
   *
   * @function
   * @arg {string} id
   * the ID of a document
   * @returns {bool}
   */
  const isRowSelected = (id) => {
    return selected.indexOf(id) !== -1
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click '_Send_' button.<br/>
   * **_Implementation:_** calls back-end [generateEml]{@link module:apiGeneral~generateEml}
   * to generate an email with the curently selected documents attached.
   */
  const handleSend = () => {
    const payload = {
      parentId: props.parentId,
      documentsId: selected,
      action: "get",
    }
    generateEml(props.user, payload).then(src => {
      // update antrag instance
      props.updateParent()

      // open document(s) in a new tab
      window.open(src, "_blank")
    }).catch(error => {
      console.log(error)
    })
    //console.log('Send Documents:')
    //console.log(selected)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click '_Print_' button.<br/>
   * **_Implementation:_** calls back-end [getDocuments]{@link module:apiGeneral~getDocuments}
   * to for the curently selected documents. If the response is successful, then opens the document
   * in a new browser tab or a download diolog.
   */
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
      props.updateParent()

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
          {sortedData(data, orderBy, order === 'asc').map((row) => (
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

DocumentTable.propTypes = {
  /**
   * ID of the parent instance
   */
  parentId: PropTypes.string,
  /**
   * Title of the table
   */
  title: PropTypes.string,
  /**
   * Data of the table
   */
  data: PropTypes.array.isRequired,
  /**
   * Object that contains user credentials
   */
  user: PropTypes.object,
  /**
   * Callback fired to update the parent instance on the back-end
   */
  updateParent: PropTypes.func,
}


// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(DocumentTable)
