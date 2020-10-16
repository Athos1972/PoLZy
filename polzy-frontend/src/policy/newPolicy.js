import React from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  Card,
  CardMedia,
  CardHeader,
  CardContent,
  TextField,
  Button,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import enLocale from "date-fns/locale/en-US"
import deLocale from "date-fns/locale/de"
import { format } from 'date-fns'
import SearchIcon from '@material-ui/icons/Search'
import { withTranslation } from 'react-i18next'
import { addPolicy } from '../redux/actions'
import logo from '../logo/LEZYSEM5-01.png'


// Search Button Styles
// Error Card Styles
const CardFindPolicy = withStyles({
  root: {
    display: "flex",
    padding: 5,
  },
})(Card)

const CardLogo = withStyles({
  root: {
    width: 160,
    float: "right",
  }
})(CardMedia)

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

  getLocale = () => {
    const { i18n } = this.props
    switch (i18n.language) {
      case 'en':
        return enLocale
      default:
        return deLocale
    }
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
      //const effectiveDate = dateToString(this.state.effectiveDate)
      const effectiveDate = format(this.state.effectiveDate, "yyyy-MM-dd")
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
    const {t} = this.props

    return(
      <CardFindPolicy>
        <div style={{flex: '1 0 auto'}}>
          <CardHeader
            title={t("find.policy")}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  id="policy"
                  label={t("policy.number")}
                  size="small"
                  value={this.state.policyNumber}
                  onChange={this.handleNumberChange}
                />
              </Grid>
              <Grid item>
                <MuiPickersUtilsProvider 
                  utils={DateFnsUtils}
                  locale={this.getLocale()}
                >
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    margin="normal"
                    label={t("effective.date")}
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
                  {t("find")}
                </SearchButton>
              </Grid>
            </Grid>
          </CardContent>
        </div>
        <CardLogo
          image={logo}
          title="LeZySEM"
        />
      </CardFindPolicy>
    )
  }
}

// translation
const TranslatedNewPolicy = withTranslation('policy')(NewPolicy)

// connect to redux store
export default connect(null, {addPolicy: addPolicy})(TranslatedNewPolicy)