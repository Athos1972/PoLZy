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


const useStyles = makeStyles(theme => ({
  row: {
    cursor: "pointer",
  },

  editAction: {
    padding: theme.spacing(1),
  },
}))


/**
 * Renders a row of {@link AttachmentTable} component.
 *
 * @component
 * @category Data Fields
 */
function AttachmentRow(props) {
  const classes = useStyles()
  const {t} = useTranslation('common')

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State<br/>
   * A boolean flag that shows if the component is currently in _edit_ mode.
   * The _edit_ mode allows to change the attachment's props.
   *
   * @name editMode
   * @default false
   * @prop {bool} editMode - state
   * @prop {function} setEditMode - setter
   * @type {state}
   * @memberOf AttachmentRow
   * @inner
   */
  const [editMode, setEditMode] = React.useState(false)
  /**
   * State<br/>
   * The type of the attachment while the _edit_ mode is active.
   *
   * @name fileType
   * @default false
   * @prop {bool} fileType - state
   * @prop {function} setFileType - setter
   * @type {state}
   * @memberOf AttachmentRow
   * @inner
   */
  const [fileType, setFileType] = React.useState(props.type)

  /**
   * Event Handler<br/>
   * **_Event:_** click an action link.<br/>
   * **_Implementation:_** depends on the pushed _action_:<br/>
   * * _preview_ - calls back-end [getFile]{@link module:apiGeneral~getFile}
   * for the attachment file and opens it in a new browser tab
   * * _edit_ - sets _true_ to state [editMode]{@link AttachmentRow~editMode}
   * * _delete_ - calls back-end [deleteFile]{@link module:apiGeneral~deleteFile} to delete the attachment
   *
   * @arg {string} action
   * the name of the action to be performed
   */
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
        setEditMode(true)
        return
      case "delete":
        deleteFile(props.user, props.id).then(() => {
          props.updateParent()
        }).catch(error => {
          console.log(error)
        })
        return
      default:
        console.log(`WARNING: no logic for action: ${action}`)
        return
    }
  }

  /**
   * Event Handler<br/>
   * **_Event:_** select a file type from the drop-down list in _edit_ mode.<br/>
   * **_Implementation:_** sets the selected file type to state [fileType]{@link AttachmentRow~fileType}.
   *
   * @see [editMode]{@link AttachmentRow~editMode}
   */
  const handleTypeChange = (value) => {
    setFileType(value.fileType)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click '_Cancel_' button in _edit_ mode.<br/>
   * **_Implementation:_** sets _false_ to state [editMode]{@link AttachmentRow~editMode}.
   *
   * @see [editMode]{@link AttachmentRow~editMode}
   */
  const handleCancelUpdate = () => {
    setEditMode(false)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click '_Update_' button in _edit_ mode.<br/>
   * **_Implementation:_** calls back-end [editFile]{@link module:apiGeneral~editFile}
   * to update the attachment data.
   *
   * @see [editMode]{@link AttachmentRow~editMode}
   */
  const handleUpdate = () => {
    editFile(props.user, props.id, fileType).then(() => {
      props.updateParent()
    }).catch(error => {
      console.log(error)
    }).finally(() => {
      setEditMode(false)
    })
  }

  return (
    <TableRow
      className={classes.row}
      hover
    >
      {props.headers.map(header => (
        <TableCell key={header}>
          {header === "type" && editMode ? (
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

AttachmentRow.propTypes = {
  /**
   * ID of the attachment
   */
  id: PropTypes.string.isRequired,
  /**
   * The name of the attachment
   */
  name: PropTypes.string.isRequired,
  /**
   * The type of the attachment
   */
  type: PropTypes.string.isRequired,
  /**
   * The date of the attachment was created in form of string
   */
  created: PropTypes.string,
  /**
   * A list of the actions that could be applied to the attachment.<br/>
   * Possible values: '_preview_', '_edit_', '_delete_'.
   */
  actions: PropTypes.array,
  /**
   * The headers of a table where the current table row should be rendered
   */
  headers: PropTypes.array.isRequired,
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

export default connect(mapStateToProps)(AttachmentRow)
