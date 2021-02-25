import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { LinearProgress } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { CardDisabled, CardTop, CardMiddle } from '../styles/cards'
import { AntragTitle } from './components'
import { updateAntrag } from '../redux/actions'
import { fetchAntrag } from '../api/antrag'

// Waiting Element
const WaitingProgress = withStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  }
}))(LinearProgress)

function DisabledAntrag(props) {
  const {index, antrag} = props

  useEffect(() => {
    // fetch antrag data
    fetchAntrag(props.user, antrag).then(data => {
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
            addressList: {},
            ...data,
          }
        )
      }
    })
  })

  //console.log('Disabled Antrag:')
  //console.log(props)

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
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  updateAntrag: updateAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(DisabledAntrag)