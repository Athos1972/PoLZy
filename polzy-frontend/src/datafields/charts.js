import React from 'react'
import { 
  Grid,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
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

// styles
const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },

  chart: {
    padding: theme.spacing(2),
  }
}))

export function LinearChart(props) {
  const classes = useStyles()
  const {data} = props

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
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="x"
              label={{
                value: data.axis.x.label,
                position: 'bottom',
                offset: 5,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              label={{
                value: data.axis.y.label,
                angle: -90,
                position: 'left',
                offset: 5,
              }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name={props.title} data={data.data} fill="#8884d8" line shape="cross" />
          </ScatterChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  )
}