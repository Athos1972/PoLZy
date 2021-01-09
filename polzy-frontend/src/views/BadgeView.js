import React from 'react'
import { connect } from 'react-redux'
import {
  Grid,
  Typography,
  Paper,
  Modal,
  Backdrop,
  Fade,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getBadgeTypes, makeBadgeSeen } from '../api/gamification'
import { updateUser } from '../redux/actions'


const useStyles = makeStyles((theme) => ({
  paper: {
    height: 140,
    textAlign: 'center',
  },

  badgeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgePaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    textAlign: 'center',
  },
}))

function RenderBadge(props) {
  
  const classes = useStyles()
  const {type, badge} = props

  const handleBadgeClick = () => {
    // process only opened badges
    if (Boolean(badge)) {
      props.onClick({
        badge: badge,
        type: type,
      })
    }
  }

  return(
    <Paper
      className={classes.paper}
      onClick={handleBadgeClick}
    >
      {Boolean(badge) ? (
        badge.level
      ) : (
        "Disabled"
      )}
      {badge && !badge.isSeen &&
        <Typography
          variant="button"
          component="div"
          color="error"
        >
          NOT SEEN
        </Typography>
      }
      <Typography
        variant="subtitle1"
        component="div"
      >
        {type.name}
      </Typography>

    </Paper>
  )
}

function BadgeView(props) {
  const classes = useStyles()

  const [badgeTypes, setBadgeTypes] = React.useState([])
  const [currentBadge, setCurrentBadge] = React.useState(null)
  const [openBadge, setOpenBadge] = React.useState(false)

  React.useEffect(() => {
    getBadgeTypes(props.user).then((data) => {
      setBadgeTypes(data)
    }).catch(error => {
      setBadgeTypes([])
      console.log(error)
    })
  }, [])

  const getBadgeByType = (type) => {
    const result = props.user.badges.filter(badge => badge.type === type.id)

    if (result.length === 0) {
      return null
    }

    return result[0]
  }

  const handleBadgeClick = (target) => {
    setCurrentBadge(target)
    setOpenBadge(true)

    // update seen prop
    if (!target.badge.isSeen) {
      makeBadgeSeen(props.user, target).then(data => {
        props.updateBadges(data)
      }).catch(error => {
        console.log(error)
      })
    }
  }

  const handleCloseBadge = () => {
    setOpenBadge(false)
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {badgeTypes.map(type => (
          <Grid
            key={type.name}
            item
            xs={3}
          >
            <RenderBadge
              type={type}
              badge={getBadgeByType(type)}
              onClick={handleBadgeClick}
            />
          </Grid>
        ))}
      </Grid>

      {/* Badge Overlay */}
      <Modal
        aria-labelledby="badge-title"
        aria-describedby="badge-description"
        className={classes.badgeContainer}
        open={openBadge}
        onClose={handleCloseBadge}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openBadge}>
          <div className={classes.badgePaper}>
            <h2 id="badge-title">{currentBadge && currentBadge.type.name}</h2>
            <p id="badge-description">{currentBadge && currentBadge.badge.level}</p>
          </div>
        </Fade>
      </Modal>

    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  updateBadges: updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(BadgeView)