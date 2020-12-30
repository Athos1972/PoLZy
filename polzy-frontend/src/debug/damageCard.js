import React from 'react'
import {
  IconButton,
  Tooltip,
} from '@material-ui/core'
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt'


/*
** Emulates Card Crash
*/
export function BrokeCard(props) {
  const [broke, setBroke] = React.useState(false)

  const makeDamage = () => {
    setBroke(true)
  }

  if (broke) {
    throw new Error(`${props.card} Crashed`)
  }

  return (
    <Tooltip title="Damage">
      <IconButton 
        onClick={makeDamage}
        aria-label="broke"
      >
        <OfflineBoltIcon color="secondary" />
      </IconButton>
    </Tooltip>
  )
}