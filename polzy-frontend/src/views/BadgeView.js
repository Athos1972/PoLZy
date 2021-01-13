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
import { apiHost } from '../utils'
import confetti from 'canvas-confetti'


const uriBadge = apiHost + 'api/badge/'

const useStyles = makeStyles((theme) => ({
  paper: {
    //height: 140,
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
    width: 300,
  },
}))


/*
** Confetti
*/
const launchConfetti = () => {

  const endTime = Date.now() + 2000
  const colors = ['#bb0000', '#0000bb', '#00bb00', '#ffffff']

  const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { 
          x: 0,
          y: 0.7
        },
        colors: colors,
      })

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: {
          x: 1,
          y: 0.7,
        },
        colors: colors,
      })

      if (Date.now() < endTime) {
        requestAnimationFrame(frame)
      }
    }

    requestAnimationFrame(frame)

}


function BadgeImage(props) {

  const altBadge = Boolean(props.type) ? `${props.level} ${props.type}` : "Disabled"

  const getBadgeSrc = () => {
    // not rewarded badges
    if (!Boolean(props.type)) {
      return "disabled"
    }

    if (!props.isSeen && !Boolean(props.overlay)) {
      return "new"
    }
    
    return `${props.type.toLowerCase()}/${props.level.toLowerCase()}`
  }

  return (
    <img
      src={uriBadge + getBadgeSrc()}
      width="60%"
      alt={altBadge}
    />
  )
}

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

  //console.log(props)

  return(
    <Paper
      className={classes.paper}
      onClick={handleBadgeClick}
    >
      <BadgeImage {...badge} />
      <Typography
        variant="subtitle1"
        component="div"
      >
        {type.title}
      </Typography>

    </Paper>
  )
}

function BadgeView(props) {
  const classes = useStyles()

  const [badgeTypes, setBadgeTypes] = React.useState([])
  const [currentBadge, setCurrentBadge] = React.useState({})
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
    const result = props.user.badges.filter(badge => badge.type === type.name)

    if (result.length === 0) {
      return {}
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

  if (openBadge && currentBadge.badge.isSeen == false) {
    launchConfetti()
  }

  console.log('CURRENT BADGE:')
  console.log(currentBadge)

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
            <BadgeImage {...currentBadge.badge} overlay />
            {currentBadge.type &&
              <React.Fragment>
                <Typography
                  id="badge-title"
                  variant="h6"
                  component="div"
                >
                  {currentBadge.type.title}
                </Typography>
                <Typography
                  id="badge-description"
                  variant="subtitle2"
                  component="div"
                >
                  {Boolean(currentBadge.badge.next_level) ? 
                    currentBadge.type.description[currentBadge.badge.next_level] : 
                    'Completed'
                  }
                </Typography>
              </React.Fragment>
            }
            {/*<p id="badge-description">{currentBadge.type && currentBadge.type.description}</p>*/}
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