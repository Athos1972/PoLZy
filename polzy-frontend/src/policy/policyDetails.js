import React from 'react'
import { Paper, Grid, Typography } from '@material-ui/core'
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'

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

const Section = withStyles((theme) => ({
  root: {
    //padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
}))(Paper)

function MakeRow(props) {
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

function MakeStatus(props) {
  const {value} = props
  const classes = useStyles()

  return(
    <React.Fragment>
      <TableRow>
        <TableCell>Status</TableCell>
        <TableCell classes={{head: classes.statusValue}}>{value}</TableCell>
      </TableRow>
    </React.Fragment>
  )
}

function MakeHeader(props) {
  const {title, value} = props

  return(
    <React.Fragment>
      <TableHead>
        <TableRow>
          <TableCell>{title}</TableCell>
          <TableCell>{value}</TableCell>
        </TableRow>
      </TableHead>
    </React.Fragment>
  )
}

function Title(props) {
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
  const {data} = props
  const classes = useStyles()

  return(
    <React.Fragment>
      <Section>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
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
  const {data} = props

  return(
    <React.Fragment>
      <Section>
        <Title title={["Product Line", data.name].join(': ')} />
        <Table size="small">
          <TableBody>
            {Object.keys(data.attributes).map((attr) => (
              <MakeRow key={attr} title={attr} value={data.attributes[attr]} />
            ))}
          </TableBody>
        </Table>
      </Section>
    </React.Fragment>
  )
}

function RenderPartner(props) {
  const {data} = props

  return(
    <React.Fragment>
      {data.is_person ? (
        <React.Fragment>
          <MakeRow title="First Name" value={data.first_name} />
          <MakeRow title="Last Name" value={data.last_name} />
          <MakeRow title="Birthday" value={data.birthdate} />
        </React.Fragment>
      ) : (
        <MakeRow title="Company Name" value={data.company_name} />
      )}
      <MakeRow title="Address" value={data.address} />
      <MakeRow title="City" value={data.city} />
      <MakeRow title="Country" value={data.country} />
      <MakeRow title="Postal Code" value={data.postalcode} />
      <MakeRow title="Email" value={data.email} />
      <MakeRow title="Phone primary" value={data.primary_phone} />
      <MakeRow title="Phone secondary" value={data.econdary_phone} />
      {data.is_person ? (
        <React.Fragment>
          <MakeRow title="Current Occupation" value={[data.occupation, '(from', data.occupation_from].join(' ') + ')'} />
          <MakeRow title="Previous Occupation" value={data.previous_occupation} />
          <MakeRow title="Sports" value={data.sports.join(', ')} />
          <MakeRow title="Health Condition" value={data.health_condition} />
        </React.Fragment>
      ) : (null
      )}
    </React.Fragment>
  )  
}

function Partner(props) {
  const {data} = props

  return(
    <React.Fragment>
      <Section>
        <Title title="Premium Payer" />
        <Table size="small">
          <TableBody>
            <RenderPartner data={data} />
          </TableBody>
        </Table>
      </Section>
    </React.Fragment>
  )
}


function InsuredPerson(props) {
  const {data} = props

  return(
    <React.Fragment>
      <Section>
        <Title title="Insured Person" />
        <Table size="small">
          <TableBody>
            <RenderPartner data={data} />
            {Object.keys(data.attributes).map((attr) => (
              <MakeRow key={attr} title={attr} value={data.attributes[attr]} />
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

function InsuredObject(props) {
  const {data} = props

  return(
    <React.Fragment>
      <Section>
        <Title title={data.is_person ? ("Insured Person") : ("Insured Object")} />
        <Table size="small">
          <TableBody>
            {data.is_person ? (
              <RenderPartner data={data.partner} />
            ): (
              <MakeRow title="Type" value={data.type} />
            )}
            {Object.keys(data.attributes).map((attr) => (
              <MakeRow key={attr} title={attr} value={data.attributes[attr]} />
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
          <Partner data={policy.premium_payer} />
        </Grid>
        <Grid container direction="column" item xs={12} md={4}>
          <InsuredObject data={policy.insured_object} />
        </Grid>
      </Grid>
    </React.Fragment>
  )

}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.black,
    paddingLeft: theme.spacing(2),
  },

  paper: {
    //padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
}));

