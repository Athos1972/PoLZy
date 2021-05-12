import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { 
  IconButton,
  Tooltip,
  TextField,
  Chip,
} from '@material-ui/core'
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import LocalOfferOutlinedIcon from '@material-ui/icons/LocalOfferOutlined'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { updateAntrag } from '../redux/actions'
import { setCustomTag } from '../api/antrag'

// set styles
const useStyles = makeStyles((theme) => ({
  customTagInput: {
    width: 240,
    verticalAlign: "middle",
    marginRight: theme.spacing(1),
  },

  horizontalMargin: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))


/**
 * The component renders a _custom tag_ of a product offer
 * and provides functionality to keep the custom tag synchronized with the back-end.
 * The component could either in _view_ or _edit_ mode. The current mode depends on prop _text_.
 * * The _view_ mode is applied if prop _text_ is not an empty string.
 * In _view_ mode it renders a chip that contains the text of the tag.
 * * The _edit_ mode corresponds to an empty prop _text_.
 * In the _edit_ the component renders an input text field and a _save_ button.
 *
 * @component
 * @category Product Offer
 */
function CustomTag(props) {
  const classes = useStyles()
  const {t} = useTranslation('antrag')

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State: The current _text value_ of the custom tag in the edit mode.
   *
   * @name textValue
   * @default ''
   * @prop {boolean} textValue - state
   * @prop {function} setTextValue - setter
   * @type {state}
   * @memberOf CustomTag
   * @inner
   */
  const [textValue, setTextValue] = React.useState('')


  /**
   * Method<br/>
   * Calls prop [updateAntrag]{@link CustomTag} to save the new tag
   * in the product offer instance held the _redux_ store.
   *
   * @function
   * @arg {string} newValue
   * A new text of the custom tag of the product offer
   */
  const updateTag = (newValue) => {
    props.updateAntrag(
      props.index,
      {
        tag: newValue,
      }
    )
    
    // clear current text value
    setTextValue('')
  }

  /**
   * Event Handler<br/>
   * **_Event:_** change value of the input field of the custom tag in the _edit_ mode.<br/>
   * **_Implementation:_** updates state [textValue]{@link CustomTag~textValue} with changed value.
   */
  const handleValueChange = (event) => {
    setTextValue(event.target.value)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _save_ button in the _edit_ mode.<br/>
   * **_Implementation:_** calls the back-end (_{@link setCustomTag}_) to update the custom tag.
   * If the response is successful then calls method [updateTag]{@link CustomTag~updateTag}
   * to synchronize the custom tag with the back-end.
   */
  const handleTagChange = () => {
    // update tag in back-end 
    setCustomTag(
      props.user,
      props.id,
      {
        action: 'set',
        tag: textValue,
      }
    ).then(() => {
      // update tag in front-end
      updateTag(textValue)
    }).catch(error => {
      console.log(error)
    })
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _delete_ button of the tag chip in the _view_ mode.<br/>
   * **_Implementation:_** calls the back-end (_{@link setCustomTag}_) to set an empty string to the custom tag.
   * If the response is successful then calls method [updateTag]{@link CustomTag~updateTag}
   * to synchronize the custom tag with the back-end.
   */
  const handleTagDelete = () => {
    // update tag in back-end 
    setCustomTag(
      props.user,
      props.id,
      {
        action: 'delete',
      }
    ).then(() => {
      // update tag in front-end
      updateTag()
    }).catch(error => {
      console.log(error)
    })
  }

  if (props.text) {
    return (
      <Chip
        classes={{root: classes.horizontalMargin}}
        label={props.text}
        onDelete={handleTagDelete}
        color="primary"
        variant="outlined"
        icon={<LocalOfferOutlinedIcon />}
      />
    )
  } else {
    return (
      <React.Fragment>
        {textValue !== '' &&
          <Tooltip title={t("common:Save")}>
            <IconButton onClick={() => handleTagChange()} aria-label="custom-tag">
              <SaveOutlinedIcon />
            </IconButton>
          </ Tooltip>
        }
        <TextField
          classes={{root: classes.customTagInput}}
          placeholder={t("antrag:tag")}
          size="small"
          value={textValue}
          onChange={handleValueChange}
        />
      </React.Fragment>
    )
  }
}

CustomTag.propTypes = {
  /**
   * The index of the product offer in the _redux_ store
   */
  index: PropTypes.number,
  /**
   * The ID of the current product offer
   */
  id: PropTypes.string,
  /**
   * The current _text value_ of the custom tag received from the back-end
   */
  text: PropTypes.string,
  /**
   * Object that contains the user credentials
   */
  user: PropTypes.object,
  /**
   * _Redux_ action that updates product offer instance in the store
   */
  updateAntrag: PropTypes.func,
}

// connect to redux store
const mapStateToPropsCustomTag = (state) => ({
  user: state.user,
})

const mapDispatchToPropsCustomTag = {
  updateAntrag: updateAntrag,
}

export default connect(mapStateToPropsCustomTag, mapDispatchToPropsCustomTag)(CustomTag)