import React from 'react'
import { 
  Grid,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTheme } from '@material-ui/core/styles'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Label,
  ResponsiveContainer,
} from 'recharts'
import { formatNumberWithCommas } from '../utils'

// styles
const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },

  chart: {
    padding: theme.spacing(2),
  },
}))

const RenderTooltip = (props) => {
  if (props.payload.length === 2) {
    return(
      <div style={{
        padding: 8,
        backgroundColor: "#ccc4"}}
      >
        <Typography
          variant="h6"
          component="div"
        >
          {props.payload[0].name}
        </Typography>
        
      </div>
    )
  }

  return null
}

export function LinearChart(props) {
  const classes = useStyles()
  const theme = useTheme()
  const {data} = props

  //console.log("Chart:")
  //console.log(props)

  const formatTooltip = (value, name, props) => {
    return formatNumberWithCommas(value)
  }

  const getChartData = () => {
    return data.values.map(point => ({
      x: point[0],
      y: point[1],
    }))
  }

  //console.log(getChartData())

  return (
    <Grid
      className={classes.container}
      container
      direction="column"
      spacing={2}
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
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 30,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              name={data.axis.x.label}
              unit={data.axis.x.unit}
            />
            <YAxis
              type="number"
              dataKey="y"
              name={data.axis.y.label}
              unit={data.axis.y.unit}
              domain={['auto', 'auto']}
              tickFormatter={formatTooltip}
            />
            <Tooltip
              formatter={formatTooltip}
            />
            <Scatter 
              name={props.title}
              data={getChartData()}
              fill={theme.palette.primary.main}
              line
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  )
}