import React from 'react'
import PropTypes from 'prop-types';
import { Container, Grid, Typography, TextField } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'


class PolicyRequest extends React.Component {
  state = {
    policyNumber: '',
    effectiveDate: new Date(),
  }


  handleNumberChange = event => {
    this.setState({
      policyNumber: event.target.value,
    })
  }

  handleDateChange = date =>{
    this.setState({
      effectiveDate: date,
    })
  }

  render() {
    const classes = this.props
    return(
      <Container maxWidth='xs'>
        <Typography
          component="h3"
          variant="h5"
          align="cnter"
        >
          Find Policy:
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs>
            
          </Grid>
          <Grid item xs>
            <TextField
              variant="outlined"
              margin="normal"
              id="policy"
              label="Policy Number"
              size="small"
              value={this.state.policyNumber}
              onChange={this.handleNumberChange}
            />
          </Grid>
          <Grid item xs>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                margin="normal"
                label="Effective Date"
                format="yyyy-MM-dd"
                size="small"
                value={this.state.effectiveDate}
                onChange={this.handleDateChange}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Container>
    )
  }
}

PolicyRequest.propTypes = {
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  container: {
    flex: 1,
  },
})

export default withStyles(styles)(PolicyRequest)

