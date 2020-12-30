import React from 'react'
import { connect } from 'react-redux'
import { 
  Grid,
  CardHeader,
  CardContent,
  Button,
} from '@material-ui/core'
import { format } from 'date-fns'
import SearchIcon from '@material-ui/icons/Search'
import { useTranslation } from 'react-i18next'
import { CardNew, CardLogo } from '../styles/cards'
import { addPolicy } from '../redux/actions'
import { getCompanyLogo, EmblemLogo } from '../components/logo'
import { backendDateFormat } from '../dateFormat'
import { DataFieldText, DataFieldDate } from '../components/dataFields'



function NewPolicy(props) {
  const defaultData = {
    number: '',
    date: format(new Date(), backendDateFormat),
  }

  const [policy, setPolicy] = React.useState(defaultData)

  const {t} = useTranslation('policy')

  const handleInputChange = (newValues) => {
    //console.log('Value Changed:')
    //console.log(newValues)
    setPolicy(preValues => ({
      ...preValues,
      ...newValues,
    }))
  }

  const validateForm = () => {
    if (policy.number === "" || policy.date === "") {
      return false
    }

    return true
  }

  const handleSubmit = () => {
    // add policy card
    props.addPolicy({
      request_state: "waiting",
      policy_number: policy.number,
      effective_date: policy.date,
    })

    // update state to default
    setPolicy(defaultData)
  }

  return(
    <CardNew>
      <div style={{display: 'flex', flexDirection: 'column', flex: "1"}}>
        <CardHeader
          title={t("find.policy")}
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={11} md={3}>
              <DataFieldText
                id="policy-number"
                value={policy.number}
                data={{
                  name: "number",
                  brief: t("policy.number")
                }}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={11} md={3}>
              <DataFieldDate
                id="policy-date"
                value={policy.date}
                data={{
                  name: "date",
                  brief: t("effective.date")
                }}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={11} md={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SearchIcon />}
                onClick={handleSubmit}
                disabled={!validateForm()}
              >
                {t("find")}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </div>
      <div style={{width: 120}}>
      <CardLogo>
        <EmblemLogo
          logo={getCompanyLogo(props.companyAttributes, "policy")}
          target="policy"
          size={170}
        />
      </CardLogo>
      </div>
    </CardNew>
  )
}


// connect to redux store
const mapStateToProps = (state) => ({
  companyAttributes: state.user.company.attributes,
})

const mapDispatchToProps = {
  addPolicy: addPolicy,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPolicy)
