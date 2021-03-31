import React from 'react'
import { connect } from 'react-redux'
import { 
  Toolbar,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { getCompanyLogo, TopBarLogo } from '../components/logo'
import UserMenu from '../components/userMenu'
import { signOut } from '../redux/actions'
import { reportProblem } from '../api/feedback'


// styles
const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: "2px solid",
    borderBottomColor: "#aaa",
    marginBottom: theme.spacing(1),
  },

  leftContainer: {
    display: "flex",
    width: "340px",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  rightContainer: {
    display: "flex",
    width: "340px",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  centerContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
  },

  user: {
    color: "grey",
  },

  toolbarItem: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))


function Header(props){
  const classes = useStyles()
  
  return(
    <React.Fragment>
      <Toolbar className={classes.toolbar}>

        {/* Left Part */}
        <div className={classes.leftContainer}>
          <Typography
            classes={{root: classes.company}}
            variant="h5"
            color="primary"
          >
            {props.user.company.displayedName}
          </Typography>
        </div>

        {/* Central Part */}
        <div className={classes.centerContainer}>
          <TopBarLogo
            logo={getCompanyLogo(props.user.company.attributes, "top")}
            size={100}
          />
        </div>

        {/* Right Part */}
        <div className={classes.rightContainer}>
          <div className={classes.toolbarItem}>
            <UserMenu {...props} />
          </div>
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
  //newAntrag: addAntrag,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)