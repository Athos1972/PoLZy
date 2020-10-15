import React from 'react'
import { connect } from 'react-redux'
import { Toolbar, Typography, Button } from '@material-ui/core'
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
  const { t } = useTranslation('auth')
  const classes = useStyles()

  return(
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
      <div className={classes.title}>
        <Brand fontSize={40} marginBottom={10} />
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