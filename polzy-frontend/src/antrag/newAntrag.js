import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CardHeader,
  CardContent,
  TextField,
  Typography,
  Grid,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { addAntrag } from '../redux/actions'
import { getProducts, loadAntrag } from '../api/antrag'
import { CardNew, CardLogo } from '../styles/cards'
import { ProductIcon } from '../components/icons'
import { getCompanyLogo, EmblemLogo } from '../components/logo'
import { SearchDropDown } from '../datafields/searchField'
import { useSnackbar } from 'notistack'



// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    width: 350,
  },

  options: {
    marginLeft: theme.spacing(1),
  },

  noPadding: {
    padding: 0,
  },
}))

// bordless input field
const noBordersStyle = makeStyles((theme) => ({
  root: {
    padding: 0,
    "& $notchedOutline": {
      border: "none",
    },
    "&:hover $notchedOutline": {
      border: "none",
    },
    "&$focused $notchedOutline": {
      border: "none",
    }
  },
  focused: {},
  notchedOutline: {},
}))


/**
 * A list of strings that representspossible actions to add a product offer.<br/>
 * Possible values:
 * * '_create_' &ndash; creates a new product offer instance
 * * '_search_' &ndash; search for a product offer in database
 *
 * @const {array}
 * @category Product Offer
 */
const actionOptions = [
  'create',
  'search',
]


/**
 * It is a component that renders a title of {@link NewAntrag}.
 * It provides functionality to switch between the available [actions]{@link actionOptions}
 * to add a product offer. It implemented via a _drop-down_ list which is a part of the card tile.
 *
 * @prop {object} props
 * @prop {string} props.value - The currently selected action
 * @prop {array} props.options - The list of the available actions
 * @prop {function} props.onChange - Callback that changes the value of state [action]{@link @NewAntrag~action}
 *
 * @memberOf NewAntrag 
 */
function NewAntragHeader(props) {
  const {t} = useTranslation('common', 'antrag')
  const classes = useStyles()
  const noBorders = noBordersStyle()

  const handleChange = (event) => {
    props.onChange(event.target.value)
  }

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography
          component="p"
          variant="h5"
        >
          {t("antrag:fast.offer") + ":"}
        </Typography>
      </Grid>
      <Grid item>
        <FormControl
          variant="outlined"
          size="small"
        >
          <Select
            classes={{root: classes.noPadding}}
            value={props.value}
            onChange={handleChange}
            renderValue={option => (
              <Typography
                component="p"
                variant="h5"
              >
                {t(`common:${option}`)}
              </Typography>
            )}
            input={
              <OutlinedInput
                classes={noBorders}
              />
            }
          >
            {props.options.map((option, index) => (
              <MenuItem key={index} value={option}>
                {t(option)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}


/**
 * UI component which adds a product offer to the _redux_ store.
 * It provides all the available in {@link actionOptions} options of creating a product offer instance.
 *
 * @component
 * @category Product Offer
 */
function NewAntrag(props) {

  const {t} = useTranslation('antrag')
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * State: A list of available products to create a new offer.
   *
   * @name productList
   * @default []
   * @prop {array} productList - state
   * @prop {function} setProductList - setter
   * @type {state}
   * @memberOf NewAntrag
   * @inner
   */
  const [productList, setProductList] = useState([])
  /**
   * State: A string to filter available products held in state [productList]{@link NewAntrag~productList}.
   *
   * @name newAntragText
   * @default ''
   * @prop {string} newAntragText - state
   * @prop {function} setNewAntragText - setter
   * @type {state}
   * @memberOf NewAntrag
   * @inner
   */
  const [newAntragText, setNewAntragText] = useState('')
  /**
   * State: A search string to query product offers from the database.
   *
   * @name searchAntragText
   * @default ''
   * @prop {string} searchAntragText - state
   * @prop {function} setSearchAntragText - setter
   * @type {state}
   * @memberOf NewAntrag
   * @inner
   */
  const [searchAntragText, setSearchAntragText] = useState('')
  /**
   * State: A string that represents the current action to create a product offer instance.
   * Possible values are the members of {@link actionOtions}
   *
   * @name action
   * @default [actionOptions&lsqb;0&rsqb;]{@link actionOptions}
   * @prop {string} action - state
   * @prop {function} setAction - setter
   * @type {state}
   * @memberOf NewAntrag
   * @inner
   */
  const [action, setAction] = useState(actionOptions[0])


  /**
   * Calls the back-end (_{@link getProducts}_) for the available list of products to offer.
   * If the response is successful then sets the received list to
   * state [productList]{@link NewAntrag~productList}.
   * If the list contain one product then automaticaly creates a new offer of this product
   * pushing the product object to prop [newAntrag]{@link NewAntrag}.
   *
   * @name useEffect
   * @function
   * @memberOf NewAntrag
   * @inner
   */
  useEffect(() => {
    getProducts(props.user).then((data) => {
      setProductList(data)

      if (props.cardsNumber === 0 && data.length === 1) {
        props.newAntrag({
          request_state: "waiting",
          product_line: {
            name: data[0].title,
          },
        })
      }
    })
  }, [])


  /**
   * Event Handler<br/>
   * **_Event:_** select an item from _drop-down list_ of the available products.<br/>
   * **_Implementation:_** pushes the selected product's tile to prop [newAntrag]{@link NewAntrag}
   * with request status _waiting_. Then sets state [newAntragText]{@link NewAntrag~newAntragText}
   * to empty strng to enable a new round of creating an offer.
   */
  const handleProductSelect = (event, value) => {
    if (value === null) {
      return
    }

    props.newAntrag({
      id: uuid(),
      request_state: "waiting",
      product_line: {
        name: value.title,
      },
    })

    setNewAntragText('')
  }

  /**
   * Event Handler<br/>
   * **_Event:_** select an item from _drop-down list_ of the product offer that could be loaded from the database
   * and match the serach string from state [searchAntragText]{@link NewAntrag~searchAntragText}.<br/>
   * **_Implementation:_** calls the back-end (_{@link loadAntrag}_) to load the selected product offer from
   * the database. If the response is successful then pushes the received product offer instance
   * to prop [newAntrag]{@link NewAntrag} with request status _OK_.<br/>
   * In case of the error status `409` of the response, shows a notification
   * that the selected offer is already loaded.
   */
  const handleAntragSearchSelect = (value) => {
    loadAntrag(props.user, value.customer.id).then(data => {
      props.newAntrag({
        request_state: "ok",
        addressList: {},
        ...data,
      })
    }).catch(error => {
      console.log(error)
      if (error.status === 409) {
        enqueueSnackbar(
          t('antrag:load.conflict'),
          {
            variant: 'error',
            preventDuplicate: true,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          },
        )
      }
    })
  }

  //console.log("ANTRAG PRODUCTS:")
  //console.log(productList)

  return(
    <CardNew>
      <div style={{flex: '1 0 auto'}}>
        <CardHeader
          title={
            <NewAntragHeader
              value={action}
              options={actionOptions}
              onChange={setAction}
            />
          }
        />
        <CardContent>
          <Grid container spacing={2}>


            {/* Create New Antrag */}
            {action === "create" &&
              <Grid item xs={11}>
                <Autocomplete
                  id="antrag-products"
                  options={productList}
                  getOptionSelected={(option, value) => option.title === value.title}
                  getOptionLabel={(option) => option.title}
                  size="small"
                  inputValue={newAntragText}
                  value={null}
                  onInputChange={(e,v) => setNewAntragText(v)}
                  onChange={handleProductSelect}
                  renderInput={(params) => 
                    <TextField 
                      {...params}
                      label={t("antrag:select.product")}
                      variant="outlined"
                    />
                  }
                  renderOption={(option) => {
                    return(
                      <React.Fragment>
                        <ProductIcon icon={option.icon} />
                        <Typography
                          classes={{root: classes.options}}
                          variant="body1"
                        >
                          {option.title}
                        </Typography>
                      </React.Fragment>
                    )
                  }}
                />
              </Grid>
            }

            {/* Search for a Saved Antrag */}
            {action === "search" &&
              <Grid item xs={11}>
                <SearchDropDown
                  value={searchAntragText}
                  data={{
                    name: "customer",
                    brief: t("antrag:search"),
                    endpoint: "antrag",
                  }}
                  onChange={handleAntragSearchSelect}
                />
              </Grid>
            }
            
          </Grid>
        </CardContent>
      </div>
      <CardLogo>
        <EmblemLogo
          logo={getCompanyLogo(props.user.company.attributes, "antrag")}
          target="antrag"
          size={170}
        />
      </CardLogo>
    </CardNew>
  )
}


NewAntrag.propTypes = {
  /**
   * Total quantity of the product offer instances in the _redux_ store
   */
  cardsNumber: PropTypes.number,
  /**
   * Object that contains the user credentials
   */
  user: PropTypes.object,
  /**
   * _Redux_ action that adds a new product offer instance to the store
   */
  newAntrag: PropTypes.func,
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  newAntrag: addAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAntrag)