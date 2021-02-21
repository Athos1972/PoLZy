import React, { useState, useEffect } from 'react'
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
import { getProducts } from '../api/antrag'
import { CardNew, CardLogo } from '../styles/cards'
import { ProductIcon } from '../components/icons'
import { getCompanyLogo, EmblemLogo } from '../components/logo'
import { SearchDropDown } from '../datafields/searchField'


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


// new antrag actions
const actionOptions = [
  'create',
  'search',
]

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

function NewAntrag(props) {

  const {t} = useTranslation('antrag')
  const classes = useStyles()

  const [productList, setProductList] = useState([])
  const [newAntragText, setNewAntragText] = useState('')
  const [searchAntragText, setSearchAntragText] = useState('')
  const [action, setAction] = useState(actionOptions[0])

  useEffect(() => {
    getProducts(props.user).then((data) => {
      //console.log(data)
      setProductList(data)

      if (props.cardsNumber === 0 && data.length === 1) {
        props.newAntrag({
          request_state: "waiting",
          product_line: {
            name: data[0].description,
          },
        })
      }
    })
  }, [])

  const handleProductSelect = (event, value) => {
    //console.log('SELECTED:')
    //console.log(value)

    if (value === null) {
      return
    }

    props.newAntrag({
      id: uuid(),
      request_state: "waiting",
      product_line: {
        name: value.description,
      },
    })

    setNewAntragText('')
  }

  const handleAntragSearchSelect = (value) => {
    console.log('Antrag Serach:')
    console.log(value)
  }

  //console.log("ANTRAG PRODUCTS:")
  //console.log(text)

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
                  getOptionSelected={(option, value) => option.description === value.description}
                  getOptionLabel={(option) => option.description}
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
                        <ProductIcon icon={option.name.slice(0,8)} />
                        <Typography
                          classes={{root: classes.options}}
                          variant="body1"
                        >
                          {option.description}
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


// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  newAntrag: addAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewAntrag)