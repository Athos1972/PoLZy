import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { CardHeader, CardContent, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { addAntrag } from '../redux/actions'
import { getProducts } from '../api/antrag'
import { CardNew, CardLogo } from '../styles/cards'
import { ProductIcon } from '../components/icons'
import { getCompanyLogo, EmblemLogo } from '../components/logo'

// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    width: 350,
  },

  options: {
    marginLeft: theme.spacing(1),
  }
}))


function NewAntrag(props) {

  const {t} = useTranslation('antrag')
  const classes = useStyles()

  const [productList, setProductList] = useState([])
  const [text, setText] = useState('')

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

    setText('')
  }

  //console.log("ANTRAG PRODUCTS:")
  //console.log(text)

  return(
    <CardNew>
      <div style={{flex: '1 0 auto'}}>
        <CardHeader
          title={t("antrag:fast.offer")}
        />
        <CardContent>
          <Autocomplete
            classes={{root: classes.inputField}}
            id="antrag-products"
            options={productList}
            getOptionSelected={(option, value) => option.description === value.description}
            getOptionLabel={(option) => option.description}
            size="small"
            inputValue={text}
            value={null}
            onInputChange={(e,v) => setText(v)}
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