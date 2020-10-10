import React from 'react'
import { Grid, Card, CardContent, Typography, TextField } from '@material-ui/core'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'


export default class NewPolicy extends React.Component {

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
    return(
      <Card>
        <CardContent>
          <Typography
            component="h2"
            variant="h5"
          >
            Find Policy
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
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
            <Grid item>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
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
        </CardContent>
      </Card>
    )
  }
}