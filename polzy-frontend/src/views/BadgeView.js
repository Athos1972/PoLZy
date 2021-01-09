import React from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import { getBadgeTypes } from '../api/gamification'

function BadgeView(props) {

  const [allBadges, setAllBadges] = React.useState([])

  React.useEffect(() => {
    getBadgeTypes(props.user).then((data) => {
      console.log('Badge Types')
      console.log(data)
      setAllBadges(data)
    }).catch(error => {
      setAllBadges([])
      console.log(error)
    })
  }, [])

  return (
    <Grid container spacing={2}>
      {allBadges.map(badge => (
        <Grid
          key={badge.name}
          item
          xs={3}
        >
          <Typography
            id="company-name"
            variant="button"
            component="div"
          >
            {badge.name}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(BadgeView)