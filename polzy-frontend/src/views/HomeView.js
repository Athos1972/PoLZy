import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Container, Tabs, Tab, Snackbar, SnackbarContent } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import PolicyView from './PolicyView'
import AntragView from './AntragView'
import Header from'../components/header'
import Copyright from '../components/copyright'

// set styles
const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },

  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },

  toast: {
    backgroundColor: theme.palette.primary.main,
  }
}))

function TabPanel(props) {
  const { children, name, value } = props;

  return (
    <div
      role="tabpanel"
      hidden={name !== value}
      id={`tabpanel-${name}`}
      aria-labelledby={`tab-${name}`}
    >
      { name === value && children }
    </div>
  )
}

function HomeView(props) {
  const classes = useStyles()
  const [tab, setTab] = useState('policy')
  const {t} = useTranslation('policy', 'antrag')

  const [message, setMessage] = useState('')

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/listen")
    eventSource.onmessage = (e) => setMessage(e.data)
  }, [])

  const handleToastClose = () => {
    setMessage('')
  }

  return(
    <React.Fragment>
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={message !== ''}
      onClose={handleToastClose}
      autoHideDuration={2000}
    >
      <SnackbarContent 
        classes={{root: classes.toast}}
        message={message}
      />
    </Snackbar>
    <Container maxWidth="lg">
      <Header />
      <Tabs 
        value={tab}
        onChange={(e, v) => {setTab(v)}}
        indicatorColor="secondary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab
          label={t('policy:policy')}
          value="policy"
          id="tab-policy"
          aria-controls="tabpanel-policy"
        />
        <Tab
          label={t('antrag:fast.offer')}
          value="antrag"
          id="tab-antrag"
          aria-controls="tabpanel-antrag"
        />
      </Tabs>
      <TabPanel name="policy" value={tab}>
        <PolicyView />
      </TabPanel>
      <TabPanel name="antrag" value={tab}>
        <AntragView />
      </TabPanel>
    </Container>
    <footer className={classes.footer}>
      <Copyright />
    </footer>
    </React.Fragment>
  )
}

// connect to redux store
export default connect((state) => ({
  policies: state.policies,
  antrags: state.antrags,
}))(HomeView)