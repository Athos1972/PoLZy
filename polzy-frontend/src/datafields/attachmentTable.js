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
import AttachmentRow from './attachmentRow'
import {comparator, sortedData} from './tableUtils'


const useStyles = makeStyles((theme) => ({
  title: {
    flex: '1 1 100%',
  },

  emptyMessage: {
    paddingLeft: theme.spacing(2),
  },
}))


/**
 * Renders data field of type _Attachments_.
 *
 * @component
 * @category Data Fields
 */
function AttachmentTable(props) {

  const classes = useStyles()
  const {t} = useTranslation('attachment')

  /**
   * Defines the headers of the columns to be rendered within the component and its order.
   *
   * @type {array}
   */
  const tableHeaders = [
    'name',
    'type',
    'created',
  ]

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State<br/>
   * Header of a table column according to which the attachments should be ordered.
   *
   * @name orderBy
   * @default null
   * @prop {string|null} orderBy - state
   * @prop {function} setOrderBy - setter
   * @type {state}
   * @memberOf AttachmentTable
   * @inner
   */
  const [orderBy, setOrderBy] = React.useState(null)
  /**
   * State<br/>
   * Sets order direction. The ordering is applied to the column defined by
   * state [orderBy]{@link AttachmentTable~orderBy}.<br/>
   * Possible values:
   * * 'asc' - ascending
   * * 'desc' - descending
   *
   * @name order
   * @default 'asc'
   * @prop {string} order - state
   * @prop {function} setOrder - setter
   * @type {state}
   * @memberOf AttachmentTable
   * @inner
   */
  const [order, setOrder] = React.useState('asc')

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
          {sortedData(props.data, orderBy, order === 'asc').map((row) => (
            <AttachmentRow
              {...row}
              key={row.id}
              headers={tableHeaders}
              updateParent={props.updateParent}
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

AttachmentTable.propTypes = {
  /**
   * Title of the table
   */
  title: PropTypes.string,
  /**
   * Data of the table
   */
  data: PropTypes.object.isRequired,
  /**
   * Callback fired to update the parent instance on the back-end
   */
  updateParent: PropTypes.func,
}

export default AttachmentTable
