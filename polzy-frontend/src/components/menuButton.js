import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Menu, MenuItem, SvgIcon, ListItemIcon } from '@material-ui/core'
import { ProductIcon } from '../components/icons'

const useStyles = makeStyles(theme => ({
  imageIcon: {
    height: '100%',
  },
  iconRoot: {
    fillColor: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
  menuItem: {
    backgroundColor: theme.palette.secondary.main,
  }
}))

export default function MenuButton(props){
  const {id, title, items} = props
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = (event, value) => {
    setAnchorEl(null)
    props.onClick(value)
  }

  const classes = useStyles()

  return(
    <React.Fragment>
      <Button
        color="primary"
        variant="contained"
        aria-controls={id}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {title}
      </Button>
      <Menu
        id={id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {items.map((item) => (
          <MenuItem 
            key={item.name}
            onClick={(event) => handleMenuClick(event, item.description)}
          >
            <ListItemIcon>
              <ProductIcon icon={item.name} />
            </ListItemIcon>
            {item.description}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}