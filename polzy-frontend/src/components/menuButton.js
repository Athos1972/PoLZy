import React from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'

export default function MenuButton(props){
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuClick = (event, index) => {
    setAnchorEl(null)
    props.onClick(index)
  }

  return(
    <React.Fragment>
      <Button
        size="small"
        aria-controls={props.id}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {props.title}
      </Button>
      <Menu
        id={props.id}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {props.items.map((value, index) => (
          <MenuItem 
            key={value}
            onClick={(event) => handleMenuClick(event, index)}
          >
            {value}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}