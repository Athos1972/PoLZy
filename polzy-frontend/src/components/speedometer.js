import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ReactSpeedometer from 'react-d3-speedometer'

// set styles
const width = 250
const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    width: 250,
    height: 125,
    bottom: theme.spacing(4),
    right: theme.spacing(2),
  },
}))

export default function Speedometer(props) {
  const classes = useStyles()
  const {t} = useTranslation('speedometer')

  return(
    <div className={classes.container}>
      <ReactSpeedometer
        fluidWidth
        needleHeightRatio={0.7}
        value={props.value}
        customSegmentStops={[0, 333, 667, 1000]}
        segmentColors={['#ffee58', '#d4e157', '#9ccc65']}
        currentValueText=""
        customSegmentLabels={[
          {
            text: t('fair'),
            position: 'INSIDE',
            color: '#555',
          },
          {
            text: t('good'),
            position: 'INSIDE',
            color: '#555',
          },
          {
            text: t('great'),
            position: 'INSIDE',
            color: '#555',
          },
        ]}
        needleTransitionDuration={3333}
        needleTransition="easeElastic"
        needleColor={'#42a5f5'}
      />
    </div>
  )
}