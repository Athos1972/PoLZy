import React from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { 
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Grid,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Collapse,
  LinearProgress,
  TextField,
  Chip,
  Table,
  TableBody,
  Link,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { Section, MakeRow, Title, GenericSection } from './policyDetails'
import { CardActiveHide, CardActive, CardTop, CardBottom, hideTime } from '../styles/cards'
import { addPolicy, removePolicy } from '../redux/actions'

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
      }}
    />
  )
}

function CustomerPoliciesBase(props) {
  // renders clauses
  const {policies} = props
  const {t} = useTranslation('policy')

  const handleClickLink = (event, policy) => {
    event.preventDefault()

    // add policy
    props.addPolicy({
      request_state: "waiting",
      policy_number: policy.policyNumber,
      effective_date: policy.effectiveDate,
    })
  }

  return(
    <Section>
      <Title title={t("policy:partner.policies")} />
      <Table size="small">
        <TableBody>
          {policies.map((policy, index) => (
            <MakeRow
              key={index} 
              title={policy.product}
              value={
                <Link
                  href="#"
                  onClick={(event) => handleClickLink(event, policy)}
                >
                  {[
                    t("policy:policy"),
                    policy.policyNumber,
                    "/",
                    t("policy:effective.date"),
                    policy.effectiveDate,
                  ].join(" ")}
                </Link>
              } 
            />
          ))}
        </TableBody>
      </Table>
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
            <Grid item xs={12} md={4}>
              <CustomerDetails {...customer} />
            </Grid>
            <Grid item xs={12} md={8}>
              <CustomerPolicies policies={customer.policies} />
            </Grid>
          </Grid>
        </CardContent>
      </CardActive>
    </Collapse>
  )
}

// connect to redux store
const mapDispatchToPropsAddPolicy = {
  addPolicy: addPolicy,
}

const mapDispatchToPropsCloseCustomer = {
  closeCard: removePolicy,
}

const CustomerPolicies = connect(null, mapDispatchToPropsAddPolicy)(CustomerPoliciesBase)
export default connect(null, mapDispatchToPropsCloseCustomer)(Customer)