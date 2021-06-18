import { withStyles } from '@material-ui/core/styles'
import { 
  FormControl,
  Slider,
  Typography,
} from '@material-ui/core'
import ValueLabel from "@material-ui/core/Slider/ValueLabel"


export const DataFieldFormControl = withStyles({
  root: {
    paddingBottom: 0,
  }
})(FormControl)

// thicker slider
const sliderThickness = 3

export const DataFieldSlider = withStyles({
  root: {
    padding: 0,
  },

  rail: {
    height: sliderThickness,
    borderRadius: sliderThickness/2,
  },

  track: {
    height: sliderThickness,
    borderRadius: sliderThickness/2,
  },

  thumb: {
    marginTop: sliderThickness/2 - 6,
  },
})(Slider)

// reactangular label for text slider
export const SliderTextLabel = withStyles(theme => ({
  offset: {
    top: theme.spacing(-2),
    left: "auto",
  },
  circle: {
    transform: "none",
    width: "auto",
    height: "auto",
    padding: theme.spacing(0.5, 1),
    borderRadius: 3,
  },
  label: {
    transform: "none",
    whiteSpace: "nowrap",
  },
}))(ValueLabel)

export const SliderTitle = withStyles(theme => ({
  root: {
    marginTop: -theme.spacing(1),
  }
}))(Typography)