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
import { useTranslation } from 'react-i18next'
import { getBadgeTypes, makeBadgeSeen, getBadgeSrc } from '../api/gamification'
import { updateUser } from '../redux/actions'
import { apiHost } from '../utils'
import confetti from 'canvas-confetti'


//const uriBadge = apiHost + 'api/badge/'

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


function BadgeImageBase(props) {

  const [badgeSrc, setBadgeSrc] = React.useState('')

  const altBadge = Boolean(props.type) ? `${props.level} ${props.type}` : "Disabled"
  const width = props.overlay ? "80%" : "50%"

  //console.log('URL:')
  //console.log(window.URL)
  //console.log(window.webkitURL)

  React.useEffect(() => {
    // get route to bage
    const badgeRoute = Boolean(props.type) ? `${props.type.toLowerCase()}/${props.level.toLowerCase()}` : "disabled"
    

    /*if (!props.isSeen && !Boolean(props.overlay)) {
      return "new"
    }*/
/*
    fetch(`/api/badge/${badgeRoute}`, {
      // fetch image resource
      headers: {'authorization': `Bearer ${props.user.accessToken}`},
    }).then(response => {
      console.log(response)
      // get blob
      return response.blob()
    }).then(blob => {
      console.log(blob)
      // convert blob to URL containing the blob
      setBadgeSrc((window.URL ? window.URL : window.webkitURL).createObjectURL(blob))
    }).catch(error => {
      console.log(error)
    })
*/
    getBadgeSrc(props.user, badgeRoute).then(src => {
      // convert blob to URL containing the blob
      console.log('BadgeView src:')
      console.log(src)
      setBadgeSrc(src)
    }).catch(error => {
      console.log(error)
    })

  }, [])

  console.log('Iamge URL:')
  console.log(badgeSrc)

  return (
    <img
      src={badgeSrc}
      width={width}
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

  return(
    <div
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

    </div>
  )
}

function BadgeView(props) {
  const classes = useStyles()
  const {t} = useTranslation('gamification')

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
    for (var i = 0; i < result.length; i++) {
        if (result[i].isSeen === false) {
            return result[i]
        }
    }
    return result[result.length - 1]
  }

  const handleBadgeClick = (target) => {
    setCurrentBadge(target)
    setOpenBadge(true)

    console.log('Badge Clicked:')
    console.log(target)

    // update seen prop
    if (target.badge.isSeen === false) {
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

  //console.log('CURRENT BADGE:')
  //console.log(currentBadge)
  //console.log('Badge Types:')
  //console.log(badgeTypes)

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
                  {currentBadge.badge.type ? (
                    currentBadge.badge.next_level ? (
                      currentBadge.type.description[currentBadge.badge.next_level]
                    ) : ( 
                      t('gamification:completed')
                    )) : (
                      currentBadge.type.description['lowest']
                    )
                  }
                </Typography>
              </React.Fragment>
            }
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

const BadgeImage = connect(mapStateToProps)(BadgeImageBase)
export default connect(mapStateToProps, mapDispatchToProps)(BadgeView)