import React from 'react'
import {
  Grid,
  Typography,
  Tooltip,
  ClickAwayListener,
  IconButton,
} from '@material-ui/core'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import { makeStyles } from '@material-ui/core/styles'
import humanBody from '../img/human_body.jpg'
import { formatNumberWithCommas } from '../utils'


const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    //margin: (theme.spacing(2), 0),
  },

  textContainer: {
    flex: 1,
  },

  imageContainer: {
    position: "relative",
    display: "inline-block",
    marginRight: theme.spacing(5),
  },

  png: {
    display: "block",
    width: props => props.width,
    height: props => props.height,
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

export default function MappedImage(props) {

  const { data } = props
  const classes = useStyles(data.valueChosenOrEntered)
  const [currentArea, setCurrentArea] = React.useState()
  const [infoOpen, setInfoOpen] = React.useState(false)

  const handleMouseMove = (event) => {
    const target = event.target.id

    console.log('Mouse Over:')
    console.log(target)

    if (target) {
      setCurrentArea(data.valueChosenOrEntered.areas[target])
    }
  }

  const handleMouseLeave = () => {
    setCurrentArea()
  }

  const handleInfoOpen = () => {
    setInfoOpen(true)
  }

  const handleInfoClose = () => {
    setInfoOpen(false)
  }


  return(
    <Grid
      className={classes.container}
      container
      direction="column"
      spacing={2}
    >
      <Grid
        item
        container
        spacing={1}
      >
        <Grid item>
          <Typography
            variant="h6"
            component="div"
          >
            {data.brief}
          </Typography>
        </Grid>
        <Grid item>
          <ClickAwayListener onClickAway={handleInfoClose}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={handleInfoClose}
                open={infoOpen}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={data.tooltip}
                placement="top"
              >
                <IconButton
                  aria-label="info"
                  color="primary"
                  size="small"
                  onClick={handleInfoOpen}
                >
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Grid>
      </Grid>
      <Grid
        item
        container
      >
        <Grid
          className={classes.imageContainer}
          item
        >
          <img
            className={classes.png}
            src={data.icon}
          />
          <svg
            className={classes.svg}
            viewBox={data.valueChosenOrEntered.viewBox}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {Object.keys(data.valueChosenOrEntered.areas).map(key => (
                <path
                  key={key}
                  id={key}
                  d={data.valueChosenOrEntered.areas[key].path}
                  className={classes.bodyPart}
                />
              ))}
            </g>
          </svg>
        </Grid>
        <Grid item> 
          {Boolean(currentArea) &&
            <React.Fragment>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  component="div"
                >
                  {currentArea.title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="body1"
                  component="div"
                >
                  Value: €{formatNumberWithCommas(currentArea.value)}
                </Typography>
              </Grid>
            </React.Fragment>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}