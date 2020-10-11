import React from 'react'
import { Container, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Header from'../components/header'
import NewPolicy from '../policy/newPolicy'
import DisabledPolicy from '../policy/disabledPolicy'
import ErrorPolicy from '../policy/errorPolicy'
import ActivePolicy from '../policy/activePolicy'
import Copyright from '../components/copyright'

import { policies } from '../testData/policies'

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
}));

function PolicyCard(props) {
  const { policy } = props
  
  switch (policy.status) {
    case "ok":
      return(
        <ActivePolicy policy={policy.data} />
      )
    case "waiting":
      return(
        <DisabledPolicy policy={policy} />
      )
    default:
      return(
        <ErrorPolicy policy={policy} />
      )
  }
}

export default function HomeView(props) {
  const {auth} = props
  const classes = useStyles()

  return(
    <React.Fragment>
    <Container maxWidth="lg">
      <Header auth={auth} />
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <NewPolicy />
        </Grid>
        {policies.map((policy) => (
          <Grid item>
            <PolicyCard key={policy.number} policy={policy} />
          </Grid>
        ))}
      </Grid>
    </Container>
    <footer className={classes.footer}>
      <Copyright />
    </footer>
    </React.Fragment>
  )

}

