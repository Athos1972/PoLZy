import React from 'react'
import PropTypes from 'prop-types'
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

/*
// the variant of rendering tooltips of nodes
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
*/

/**
 * This component renders an output data field of type _Chart_.
 * The component uses library [Recharts]{@link https://recharts.org/} to display data as a linear chart.
 *
 * @component
 * @category Data Fields
 *
 * @example
 * const title = 'test'
 * const data = {
 *   axis: {
 *     x: {
 *       label: 'x_label',
 *       units: 'test',
 *     },
 *     y: {
 *       label: 'y_label',
 *       units: 'test',
 *     },
 *   },
 *   values: [10, 20]
 * }
 * return <LinearChart title={title} data={data} />
 */
export function LinearChart(props) {
  const classes = useStyles()
  const theme = useTheme()
  /**
   * Options and data of the chart extracted from prop [data]{@link LinearChart}
   *
   * @name data
   * @type {object}
   * @memberOf LinearChart
   * @prop axis {object} - options of the chart axis
   * @prop axis.x.label {string} - label of the axis _x_
   * @prop axis.x.units {string} - units of the axis _x_
   * @prop axis.y.label {string} - label of the axis _y_
   * @prop axis.y.units {string} - units of the axis _y_
   * @prop values {array}
   * list of data points presented in form of arrays of two values [xValue, yValue]
  */
  const {data} = props

  /**
   * Callback<br/>
   * Converts a numeric _value_ into a string with commas as thousands separator.
   * Used as a formatter function of ticks of the _y_-axis and node values.
   */
  const formatTooltip = (value, name, props) => {
    return formatNumberWithCommas(value)
  }

  /**
   * Method<br/>
   * Converts prop [data.values]{@link LinearChart.data}
   * to array of data that could be parsed by _Rechart_.
   *
   * @returns {object}
   */
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

LinearChart.propTypes = {
  /**
   * the name of the chart
   */
  title: PropTypes.string,
  /**
   * chart data and options (see [data]{@link LinearChart.data} for detailed structure)
   */
  data: PropTypes.object.isRequired,
}
