import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Typography } from '@material-ui/core'
import { getBadgeSrc } from '../api/gamification'


/**
 * Renders an alert _toast_ when a **new** badge achieved
 * 
 * @component
 * @category Custom Components
 *
 */
function BadgeToastBase(props) {
  
  const [
    /**
     * @type {boolean} Badge Source
     * @memberOf BadgeToastBase
     */
    badgeSrc, setBadgeSrc] = React.useState('')


  React.useEffect(() => {
    /**
     * fetching image resource
     *
     * @memberOf BadgeToastBase
     */
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

BadgeToastBase.propTypes = {
  /**
   * Badge image URI
   */
  uri: PropTypes.string.isRequired,
  /**
   * Alert message
   */
  text: PropTypes.string.isRequired,
  /**
   * User's credentials
   */
  user: PropTypes.object.isRequired,
}


// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export const BadgeToast = connect(mapStateToProps)(BadgeToastBase)
