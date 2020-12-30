import React from 'react'
import clsx from 'clsx'
import { Tooltip, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { useTranslation } from 'react-i18next'

// Styles
const useStyles = makeStyles((theme) => ({
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },

  expandOpen: {
    transform: 'rotate(180deg)',
  },

}))

export default function MoreButton(props) {
  const classes = useStyles()
  const {t} = useTranslation('common')

  return(
    <Tooltip title={props.expanded ? (t("common:collapse")) : (t("common:expand"))}>
      <IconButton
        className={clsx(classes.expand, {
          [classes.expandOpen]: props.expanded,
        })}
        onClick={props.onClick}
        aria-expanded={props.expanded}
        aria-label="view details"
      >
        <ExpandMoreIcon />
      </IconButton>
    </Tooltip>
  )
}