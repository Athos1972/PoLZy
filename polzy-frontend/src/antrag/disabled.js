import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LinearProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import { CardDisabled, CardTop, CardMiddle } from '../styles/cards'
import { AntragTitle } from './components'
import { updateAntrag } from '../redux/actions'
import { fetchAntrag } from '../api'

// Waiting Element
const WaitingProgress = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  }
}))(LinearProgress)

function DisabledAntrag(props) {
  const {index, antrag} = props
  const {i18n} = useTranslation()

  useEffect(() => {
    // fetch antrag data
    fetchAntrag(i18n.language, antrag).then(data => {
      if ('error' in data) {
        props.updateAntrag(
          index,
          {
            ...antrag,
            request_state: "failed",
            ...data,
          }
        )
      } else {
        props.updateAntrag(
          index,
          {
            request_state: "ok",
            ...data,
          }
        )
      }
    })
  })

  return(
    <CardDisabled>
      <CardTop
        title={<AntragTitle product={antrag.product_line.name} />}
      />
      <CardMiddle>
        <WaitingProgress />
      </CardMiddle>
    </CardDisabled>
  )
}

// connect to redux store
export default connect(null, {updateAntrag: updateAntrag})(DisabledAntrag)