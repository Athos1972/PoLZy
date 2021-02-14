import React from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { makeStyles } from '@material-ui/core/styles'
import { 
  CardContent,
  IconButton,
  Tooltip,
  Grid,
  Typography,
  Collapse,
  LinearProgress,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { Section, GenericSection } from './policyDetails'
import { CardActive, CardTop, hideTime } from '../styles/cards'
import { addPolicy, removePolicy } from '../redux/actions'
import { getCustomerPolicies } from '../api/policy'
import EnhancedTable from '../datafields/enhancedTable'
import { backendDateFormat } from '../dateFormat'

import {BrokeCard} from '../debug/damageCard'


// Styles
const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },

  heading: {
    marginLeft: theme.spacing(1),
  }

}))

const errorStyles = makeStyles((theme) => ({
  policies: {
    marginLeft: theme.spacing(2),
    color: theme.palette.error.light,
  },
}))


function CustomerDetails(props) {
  // renders general data of customer

  const {t} = useTranslation('partner')

  return(
    <GenericSection
      title={t("partner:details")}
      data={{
        [t("partner:birthDate")]: props.birthDate,
        [t("partner:address")]: props.houseNumber + " " + props.street,
        [t("partner:city")]: props.city,
        [t("partner:postcode")]: props.postCode,
        [t("partner:email")]: props.email,
        [t("partner:telefon")]: props.phone,
      }}
    />
  )
}

function CustomerPoliciesBase(props) {
  // renders partner policies
  const {t} = useTranslation('policy')
  const classes = errorStyles()

  const [policies, setPolicies] = React.useState(null)
  const [loadPoliciesError, setLoadPoliciesError] = React.useState(false)

  React.useEffect(() => {
    getCustomerPolicies(props.user, props.customer).then(data => {
      setPolicies(data.policies)
      setLoadPoliciesError(false)
    }).catch(error => {
      console.log(error)
      setLoadPoliciesError(true)
    })
  }, [])

  const hadnlePolicyClick = (value) => {

    // add policy
    props.addPolicy({
      request_state: "waiting",
      policy_number: Object.values(value)[0],
      effective_date: format(new Date(), backendDateFormat),
    })
  }

  //console.log(props)
  //console.log(policies)

  return(
    <Section>
      {policies ? (
        <EnhancedTable
          name="policies"
          title={t("policy:partner.policies")}
          data={policies}
          value={null}
          onChange={hadnlePolicyClick}
        />
      ) : (
        <React.Fragment>
          {loadPoliciesError ? (
            <Typography
              className={classes.policies}
              component="p"
              variant="body1"
            >
              {t("policy:policy.fail")}
            </Typography>
          ) : (
            <LinearProgress />
          )}
        </React.Fragment>
      )}
    </Section>
  )
}


function Customer(props) {
  const {t} = useTranslation('common')
  const classes = useStyles()
  const {index, customer} = props

  const [isVisible, setIsVisible] = React.useState(false)

  // appear animation
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {props.closeCard(index)}, hideTime)
  } 

  return (
    <Collapse
      in={isVisible}
      timeout={hideTime}
      unmountOnExit
    >
      <CardActive>
        <CardTop
          className={classes.card}
          action={
            <React.Fragment>

              {/* DEBUG: broke antrag */}
              <BrokeCard card="Customer" />

              {/* Close Button */}
              <Tooltip title={t("common:close")}>
                <IconButton 
                  onClick={handleClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>

            </React.Fragment>
          }
          title={
            <Typography
              className={classes.heading}
              component="p"
              variant="h5"
            >
              {customer.firstName + " " + customer.lastName}
            </Typography>
          }
        />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <CustomerDetails {...customer} />
            </Grid>
            <Grid item xs={12}>
              <CustomerPolicies customer={customer.partnerNumber} />
            </Grid>
          </Grid>
        </CardContent>
      </CardActive>
    </Collapse>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToPropsAddPolicy = {
  addPolicy: addPolicy,
}

const mapDispatchToPropsCloseCustomer = {
  closeCard: removePolicy,
}

const CustomerPolicies = connect(mapStateToProps, mapDispatchToPropsAddPolicy)(CustomerPoliciesBase)
export default connect(null, mapDispatchToPropsCloseCustomer)(Customer)