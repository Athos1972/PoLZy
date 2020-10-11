import React from 'react'
import { connect } from 'react-redux'
import { Grid, Card, CardContent, Typography, TextField, Button, Icon } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { addPolicy } from '../redux/actions'
import SearchIcon from '@material-ui/icons/Search'

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

  handleSubmit = () => {
    if (this.state.policyNumber) {
      this.props.addPolicy({
        status: "waiting",
        number: this.state.policyNumber,
        date: this.state.effectiveDate.toISOString().split('T')[0],
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