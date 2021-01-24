import React from 'react'
import {
  Grid,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import humanBody from '../img/human_body.jpg'
import { formatNumberWithCommas } from '../utils'

const bodyPartData = {
  head: {
    description: "Das ist ein Kopf",
    value: 255000,
    path: "m310.66499,53.99146c-51.32522,0 -57.32427,49.32553 -55.99114,79.32079c1.33312,29.99526 30.66182,65.323 55.99114,63.32332c25.32933,-1.99968 41.99336,-25.99589 50.65865,-41.3268c8.6653,-15.33091 11.9981,-24.66277 11.9981,-31.99494c0,-7.33217 -8.6653,-5.99905 -9.99842,-5.33249c-1.33312,0.66656 -1.33312,-63.98988 -52.65834,-63.98988z",
  },

  lHand: {
    description: "This is a left hand",
    value: 135000,
    path: "m148.02405,411.26829c-0.66656,1.33312 -9.33186,23.32964 -11.33154,37.99399c-1.99968,14.66435 -0.66656,57.32427 -3.33281,69.32237c-2.66624,11.9981 -7.33217,48.65897 -7.37963,48.65895c0.04745,0.00002 37.37488,7.33219 37.32743,7.33217c0.04745,0.00002 2.7137,-17.99714 4.04682,-25.99587c1.33312,-7.99873 -2.66624,-4.66593 1.99968,-9.99842c4.66593,-5.33249 4.66593,-3.33281 4.66593,-5.33249c0,-1.99968 9.33186,-19.33028 16.66403,-43.99304c7.33217,-24.66277 7.33217,-65.98956 7.28472,-65.98958c0.04746,0.00001 -49.27808,-13.33121 -49.94464,-11.99809z",
  },

  rHand: {
    description: "This is a right hand",
    value: 155000,
    path: "m477.97186,409.93517c3.33281,3.99937 11.9981,29.32869 15.33091,42.65992c3.33281,13.33122 6.66561,72.65518 5.33249,75.32142c-1.33312,2.66624 8.6653,31.32838 9.33186,31.32838c0.66656,0 -35.99431,9.99842 -36.04177,9.9984c0.04746,0.00002 -2.61878,-13.33121 -5.28503,-22.66307c-2.66624,-9.33186 -21.32996,-35.99431 -27.32901,-51.32522c-5.99905,-15.33091 -16.66403,-59.32395 -13.99779,-62.65676z",
  },
}


const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
  },

  detailsContainer: {
    flex: 1,
  },

  imgContainer: {
    position: "relative",
    display: "inline-block",
    transition: "transform 150ms ease-in-out",
    /*
    "&:hover": {
      transform: "rotate( 15deg )",
    },
    */
  },

  png: {
    display: "block",
    height: "600px",
    width: "auto",
  },

  svg: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  bodyPart: {
    fill: "#0000",
    "&:hover": {
      fill: "#8008",
    },
  },
}))

export default function SVGView(props) {

  const classes = useStyles()
  const [bodyPart, setBodyPart] = React.useState()

  const handleClick = (event) => {
    const target = event.target.id
    if (target) {
      setBodyPart(bodyPartData[target])
    }
  }

  return(
    <Grid container spacing={2}>
      <Grid item className={classes.imgContainer}>
        <img
          className={classes.png}
          src={humanBody}
        />
        <svg
          className={classes.svg}
          viewBox="0 0 600 1200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g onClick={handleClick}>
            {Object.keys(bodyPartData).map(key => (
              <path
                key={key}
                id={key}
                d={bodyPartData[key].path}
                className={classes.bodyPart}
              />
            ))}
          </g>
        </svg>
      </Grid> 
      <Grid
        className={classes.detailsContainer}
        item
        container
        direction="column"
        stacing={2}
      >
        {Boolean(bodyPart) &&
          <React.Fragment>
            <Grid item>
              <Typography
                variant="h3"
                component="div"
              >
                {bodyPart.description}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                component="div"
              >
                Value: €{formatNumberWithCommas(bodyPart.value)}
              </Typography>
            </Grid>
          </React.Fragment>
        }
      </Grid>
    </Grid>
  )
}