import React from 'react'
import { connect } from 'react-redux'
import { 
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import Brand from './brandString'
import { signOut, addAntrag } from '../redux/actions'


// styles
const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: "2px solid",
    borderBottomColor: "#aaa",
    marginBottom: theme.spacing(2),
  },

  title: {
    flex: 1,
  },

  user: {
    color: "grey",
  },

  tollbarItem: {
    marginLeft: theme.spacing(1),
    narginRight: theme.spacing(1),
  },
}))


function Header(props){
  const { t, i18n } = useTranslation('auth')
  const classes = useStyles()
  
  return(
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Select
          id="language-select"
          value={i18n.language}
          onChange={(e) => {i18n.changeLanguage(e.target.value)}}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="de">Deutsch</MenuItem>
          <MenuItem value="wi">Wienerisch</MenuItem>
        </Select>
        <div className={classes.title}>
          <Brand size={36} marginBottom={10} />
        </div>
        <div className={classes.tollbarItem}>
          <Typography
            classes={{root: classes.user}}
            variant="button"
          >
            {props.user.username}
          </Typography>
        </div>
        <div className={classes.tollbarItem}>
          <Button 
            variant="outlined"
            size="small"
            onClick={props.signOut}
          >
            {t('auth:signout.button')}
          </Button>
        </div>
      </Toolbar>
    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = {
  signOut: signOut,
  newAntrag: addAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)