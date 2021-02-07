import React from 'react'
import { connect } from 'react-redux'
import { Grid, Typography } from '@material-ui/core'
import { getBadgeSrc } from '../api/gamification'
//import { apiHost } from '../utils'

//const uriBadge = apiHost + 'api/badge/'

function BadgeToastBase(props) {

  const [badgeSrc, setBadgeSrc] = React.useState('')

  React.useEffect(() => {
    // get bage src
    getBadgeSrc(props.user, props.uri).then(src => {
      setBadgeSrc(src)
    }).catch(error => {
      console.log(error)
    })
  }, [])

  return (
    <Grid container spacing={2}>
      <Grid item>
        <img
          src={badgeSrc}
          height={25}
          alt="New Badge"
        />
      </Grid>

      <Grid item>
        <Typography
          variant="subtitle1"
          component="div"
        >
          {props.text}
        </Typography>
      </Grid>
    </Grid>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export const BadgeToast = connect(mapStateToProps)(BadgeToastBase)
