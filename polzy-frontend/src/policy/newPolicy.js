import React from 'react'
import { connect } from 'react-redux'
import { Grid, Card, CardContent, Typography, TextField, Button, Icon } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import SearchIcon from '@material-ui/icons/Search'
import { addPolicy } from '../redux/actions'


// Error Card Styles
const SearchButton = withStyles((theme) => ({
  root: {
    backgroundColor: "#00c853",
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: "#43a047",
    }
  },
}))(Button)

// format date to string YYYY-MM-DD
const dateToString = date => {
  const d = date.getDate()
  const m = date.getMonth() + 1

  return [
    date.getFullYear(),
    (m > 9 ? '' : '0') + m,
    (d > 9 ? '' : '0') + d,
  ].join('-')
}

class NewPolicy extends React.Component {

  state = {
    policyNumber: '',
    effectiveDate: new Date(),
  }

  handleNumberChange = event => {
    this.setState({
      policyNumber: event.target.value,
    })
  }

  handleDateChange = date => {
    this.setState({
      effectiveDate: date,
    })
  }

  handleSubmit = async () => {
    if (this.state.policyNumber) {
      // format date
      //const effectiveDate = this.state.effectiveDate.toISOString().split('T')[0]
      const effectiveDate = dateToString(this.state.effectiveDate)
      // add policy card
      this.props.addPolicy({
        status: "waiting",
        number: this.state.policyNumber,
        date: effectiveDate,
      })
      // update state to default
      this.setState({
        policyNumber: '',
        effectiveDate: new Date(),
      })
    }
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
            <Grid item>
              <SearchButton
                variant="contained"
                color="primary"
                endIcon={<SearchIcon />}
                onClick={this.handleSubmit}
              >
                Find
              </SearchButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }
}

// connect to redux store
export default connect(null, {addPolicy: addPolicy})(NewPolicy)