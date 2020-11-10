import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { CardHeader, CardContent, } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { addAntrag } from '../redux/actions'
import { getProducts } from '../api'
import { CardNew, CardLogo } from '../styles/cards'
import MenuButton from '../components/menuButton'
import logo from '../logo/LEZYSEM5-02.png'


function NewAntrag(props) {

  const [productList, setProductList] = useState([])
  const {t, i18n} = useTranslation('antrag')

  useEffect(() => {
    getProducts(i18n.language, props.user.stage).then((data) => {
      console.log(data)
      setProductList(data)
    })
  }, [props.user.stage])

  const handleProductSelect = (value) => {    
    props.newAntrag({
      request_state: "waiting",
      product_line: {
        name: value,
      },
      stage: props.user.stage,
    })
  }

  console.log("ANTRAG PRODUCTS:")
  console.log(productList)

  return(
    <CardNew>
      <div style={{flex: '1 0 auto'}}>
        <CardHeader
          title={t("antrag:fast.offer")}
        />
        <CardContent>
          <MenuButton
            id="product-select"
            title={t("antrag:select.product")}
            items={productList}
            onClick={handleProductSelect}
          />
        </CardContent>
      </div>
      <CardLogo
        image={logo}
        title="LeZySEM"
      />
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