import React from 'react'
//import { makeStyles } from '@material-ui/core/styles'
import { Button, Menu, MenuItem, ListItemIcon } from '@material-ui/core'
import { ProductIcon } from './icons'

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
        {items.map((item, index) => (
          <MenuItem 
            key={`${item.name}-${index}`}
            onClick={(event) => handleMenuClick(event, item.description)}
          >
            <ListItemIcon>
              <ProductIcon icon={item.name.slice(0,8)} />
            </ListItemIcon>
            {item.description}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}