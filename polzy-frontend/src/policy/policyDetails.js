import React from 'react'
import { Paper, Grid, Typography } from '@material-ui/core'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'


// Styles for policy status
const StatusActive = withStyles((theme) => ({
  head: {
    color: theme.palette.success.main,
  },
}))(TableCell)

const StatusSuspended = withStyles((theme) => ({
  head: {
    color: theme.palette.warning.main,
  },
}))(TableCell)

const StatusCanceled = withStyles((theme) => ({
  head: {
    color: theme.palette.secondary.main,
  },
}))(TableCell)

// Styles for policy section container
const Section = withStyles((theme) => ({
  root: {
    //padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
}))(Paper)

// Style for policy section title
const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.black,
    paddingLeft: theme.spacing(2),
  },
}));


function GetValue(props) {
  const {value} = props

  if (typeof value === "boolean"){
    return(
      <React.Fragment>
        {value ? (
          <DoneIcon style={{ color: "green" }} />
        ) : (
          <CloseIcon color="secondary" />
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {value}
    </React.Fragment>
  )
}


function MakeRow(props) {
  // renders a policy property
  const {title, value} = props

  return(
    <React.Fragment>
      <TableRow>
        <TableCell>{title}</TableCell>
        <TableCell>{value}</TableCell>
      </TableRow>
    </React.Fragment>
  )
}

function Title(props) {
  // renders title of policy section
  const classes = useStyles()

  return (
    <Typography 
      className={classes.title}
      component="h2"
      variant="h6"
      color="primary"
      
    >
      {props.title}
    </Typography>
  )
}

function PolicyStatus(props) {
  // renders policy status
  const {status} = props

  switch(status) {
    case 'active':
      return <StatusActive>{status}</StatusActive>
    case 'canceled':
      return <StatusCanceled>{status}</StatusCanceled>
    case 'suspended':
      return <StatusSuspended>{status}</StatusSuspended>
    default:
      return <TableCell>{status}</TableCell>
  }
}

function PolicyMain(props) {
  // renders general data of policy
  const {data} = props
  const {t} = useTranslation('policy')

  return(
    <React.Fragment>
      <Section>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("status")}</TableCell>
              <PolicyStatus status={data.status} />
            </TableRow>
          </TableHead>
          <TableBody>
            <MakeRow title="Remote System" value={data.remote_system} />
            {Object.keys(data.attributes).map((attr) => (
              <MakeRow key={attr} title={attr} value={data.attributes[attr]} />
            ))}
          </TableBody>
        </Table>
      </Section>
    </React.Fragment>
  )
}

function ProductLine(props) {
  // renders product line section of policy
  const {data} = props
  const {t} = useTranslation('policy')

  return(
    <React.Fragment>
      <Section>
        <Title title={t("product.line") + ": " + data.name} />
        <Table size="small">
          <TableBody>
            {Object.keys(data.attributes).map((attr) => (
              <MakeRow key={attr} title={attr} value={<GetValue value={data.attributes[attr]} />} />
            ))}
          </TableBody>
        </Table>
      </Section>
    </React.Fragment>
  )
}

function RenderPartner(props) {
  // renders partner
  const {data} = props
  const {t} = useTranslation('partner')

  return(
    <React.Fragment>
      {data.is_person ? (
        <React.Fragment>
          <MakeRow title={t("first.name")} value={data.first_name} />
          <MakeRow title={t("last.name")} value={data.last_name} />
          <MakeRow title={t("birthday")} value={data.birthdate} />
        </React.Fragment>
      ) : (
        <MakeRow title={t("company.name")} value={data.company_name} />
      )}
      <MakeRow title={t("address")} value={data.address} />
      <MakeRow title={t("city")} value={data.city} />
      <MakeRow title={t("country")} value={data.country} />
      <MakeRow title={t("postal.code")} value={data.postal_code} />
      <MakeRow title={t("email")} value={data.email} />
      <MakeRow title={t("phone.primary")} value={data.primary_phone} />
      <MakeRow title={t("phone.secondary")} value={data.secondary_phone} />
      {data.is_person ? (
        <React.Fragment>
          <MakeRow title={t("current.occupation")} value={data.occupation == null ? (
              ''
            ) : (
              data.occupation + ' (from' + data.occupation_from + ')'
            )}
          />
          <MakeRow title={t("previous.occupation")} value={data.previous_occupation} />
          <MakeRow title={t("sports")} value={data.sports.join(', ')} />
          <MakeRow title={t("health.condition")} value={data.health_condition} />
        </React.Fragment>
      ) : (null
      )}
    </React.Fragment>
  )  
}

function PremiumPayer(props) {
  // renders premium payer
  const {data} = props
  const {t} = useTranslation('policy')

  return(
    <React.Fragment>
      <Section>
        <Title title={t("premium.payer")} />
        <Table size="small">
          <TableBody>
            <RenderPartner data={data} />
          </TableBody>
        </Table>
      </Section>
    </React.Fragment>
  )
}

function InsuredObject(props) {
  // renders insured object or person
  const {data} = props
  const {t} = useTranslation('policy')

  return(
    <React.Fragment>
      <Section>
        <Title title={t("Insured Object")} />
        <Table size="small">
          <TableBody>
            <MakeRow title={t("Type")} value={data.type} />
            {Object.keys(data.attributes).map((attr) => (
              <MakeRow key={attr} title={attr} value={<GetValue value={data.attributes[attr]} />} />
            ))}
            {Object.keys(data.implementation_attributes).map((attr) => (
              <MakeRow key={attr} title={attr} value={data.implementation_attributes[attr]} />
            ))}
          </TableBody>
        </Table>
      </Section>
    </React.Fragment>
  )
}

export default function PolicyDetails(props) {
  const {policy} = props

  return(
    <React.Fragment>
      <Grid container direction="row">
        <Grid container direction="column" item xs={12} md={4}>
          <PolicyMain data={policy} />
          <ProductLine data={policy.product_line} />
        </Grid>
        <Grid container direction="column" item xs={12} md={4}>
          <PremiumPayer data={policy.premium_payer} />
        </Grid>
        <Grid container direction="column" item xs={12} md={4}>
          <InsuredObject data={policy.insured_object} />
        </Grid>
      </Grid>
    </React.Fragment>
  )

}

