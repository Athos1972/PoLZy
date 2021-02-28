import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ReactSpeedometer from 'react-d3-speedometer'

/*
** speedometer size
*/
export const speedometerSize = 250

// set styles
const useStyles = makeStyles((theme) => ({
  container: {
    width: speedometerSize,
    height: Math.floor(speedometerSize/2),
    marginRight: theme.spacing(2),
  },
}))

export default function Speedometer(props) {
  const classes = useStyles()
  const {t} = useTranslation('speedometer')

  //console.log(props.bottom)

  return(
    <div className={classes.container}>
      {
        /* Speedometer Options:
        ** 
        ** customSegmentStops -- size of the color segments
        **                       example: [0, 333, 667, 1000]
        **                                 0-333     --> segment 1
        **                                 333-667   --> segment 2
        **                                 667- 1000 --> segment 3
        ** segmentColors -- colors of the segments
        ** customSegmentLabels -- array of objects that define segment labels
        **                        each object has the following keys:
        **                        text      --> the text of the label,
        **                        fontSize  --> the font size of the label,
        **                        color     --> the color of the text,
        **                        position: --> either "INSIDE" or "OUTSIDE"
        ** needleHeightRatio -- the length of the needle: float between 0.0 and 1.0
        */
      }
      <ReactSpeedometer
        fluidWidth
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
        needleHeightRatio={0.7}
        needleTransitionDuration={3333}
        needleTransition="easeElastic"
        needleColor={'#42a5f5'}
      />
    </div>
  )
}