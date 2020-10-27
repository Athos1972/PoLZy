import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { 
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { addAntrag } from '../redux/actions'
import { getProducts } from '../api'
import MenuButton from '../components/menuButton'
import logo from '../logo/LEZYSEM5-01.png'



// Search Button Styles
// Error Card Styles
const CardNewAntrag = withStyles({
  root: {
    display: "flex",
    padding: 5,
  },
})(Card)

const CardLogo = withStyles({
  root: {
    width: 160,
    height: 170,
    float: "right",
  }
})(CardMedia)

const ProductControl = withStyles((theme) => ({
  root: {
    width: "240px",
  }
}))(FormControl)


function NewAntrag(props) {

  const [productList, setProductList] = useState([])
  const {t} = useTranslation('antrag')

  useEffect(() => {
    getProducts(props.user.stage).then((data) => {
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

  return(
    <CardNewAntrag>
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
    </CardNewAntrag>
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