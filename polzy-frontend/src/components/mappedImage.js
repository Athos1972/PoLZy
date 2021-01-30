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
import { formatNumberWithCommas } from '../utils'
import { apiHost } from '../utils'

const uriImages = apiHost + 'api/images/'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
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
    fill: theme.palette.primary.main,
    fillOpacity: 0,
    "&:hover": {
      fillOpacity: 0.5,
    },
  },
}))

export default function MappedImage(props) {

  const { data } = props
  const classes = useStyles(data)
  const [currentArea, setCurrentArea] = React.useState()
  const [infoOpen, setInfoOpen] = React.useState(false)

  const handleMouseMove = (event) => {
    const target = event.target.id

    if (target) {
      setCurrentArea(data.areas[target])
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

  console.log('Mapped Image:')
  console.log(props)

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
            {props.title}
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
                title={props.tooltip}
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
            src={uriImages + props.image}
          />
          <svg
            className={classes.svg}
            viewBox={data.viewBox}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {Object.keys(data.areas).map(key => (
                <path
                  key={key}
                  id={key}
                  d={data.areas[key].path}
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
              {currentArea.value.map(value => (
                <Grid key={value} item>
                  <Typography
                    variant="body1"
                    component="div"
                  >
                    {value}
                  </Typography>
                </Grid>
              ))}
            </React.Fragment>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}