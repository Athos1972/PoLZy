import React from 'react'
import { connect } from 'react-redux'
import { Toolbar, Typography, Button, Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import Brand from './brand'
import { signOut } from '../redux/actions'


// styles
const useStyles = makeStyles({
  toolbar: {
    borderBottom: "2px solid",
    borderBottomColor: "#aaa",
    marginBottom: 10,
  },

  title: {
    flex: 1,
  },

  user: {
    marginRight: 10,
    color: "grey",
  }
})


function Header(props){
  const { t, i18n } = useTranslation('auth')
  const classes = useStyles()

  console.log(i18n)

  return(
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Select
          id="language-select"
          value={i18n.language}
          onChange={(e) => {i18n.changeLanguage(e.target.value)}}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="de">Deutcshe</MenuItem>
        </Select>
        <div className={classes.title}>
          <Brand size={60} marginBottom={10} />
        </div>
        <Typography
          classes={{root: classes.user}}
          variant="button"
        >
          {props.user.username}
        </Typography>
        <Button 
          variant="outlined"
          size="small"
          onClick={props.signOut}
        >
          {t('auth:signout.button')}
        </Button>
      </Toolbar>
    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps, {signOut: signOut})(Header)