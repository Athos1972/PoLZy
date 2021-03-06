import React from 'react'
import { Paper, Grid, Typography } from '@material-ui/core'
import { 
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Link,
  Collapse,
} from '@material-ui/core'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import DoneIcon from '@material-ui/icons/Done'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import ExpandButton from '../components/expandButton'


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
export const Section = withStyles((theme) => ({
  root: {
    //padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
}))(Paper)

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

// Style for policy section title
const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.common.black,
    paddingLeft: theme.spacing(2),
  },

  divFlex: {
    display: "flex",
  }
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


export function MakeRow(props) {
  // renders a policy property
  const {title, value} = props

  return(
    <React.Fragment>
      <TableRow hover>
        <TableCell>{title}</TableCell>
        <TableCell>{value}</TableCell>
      </TableRow>
    </React.Fragment>
  )
}

function MakeClauseRow(props) {
  // renders a policy property with tip
  const {clause} = props

  return(
    <React.Fragment>
      <HtmlTooltip 
        placement="left"
        arrow
        interactive
        title={
          <React.Fragment>
            <h4>{clause.description}</h4>
          </React.Fragment>
        } 
      >
      <TableRow hover>
        <TableCell>{clause.name}</TableCell>
        <TableCell>
          <Link
            href={clause.link}
            target="_blank"
          >
            {clause.number}
          </Link>
        </TableCell>
      </TableRow>
      </HtmlTooltip>
    </React.Fragment>
  )
}

export function Title(props) {
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
            <TableRow hover>
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

export function GenericSection(props) {
  // renders premium payer, insured object sections
  const {title, data} = props

  return(
    <React.Fragment>
      <Section>
        <Title title={title} />
        <Table size="small">
          <TableBody>
            {Object.keys(data).map((attr) => (
              <MakeRow key={attr} title={attr} value={data[attr]} />
            ))}
          </TableBody>
        </Table>
      </Section>
    </React.Fragment>
  )
}

function Clauses(props) {
  // renders clauses
  const {data} = props
  const {t} = useTranslation('policy')
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  //console.log("Clauses")
  //console.log(data)

  return(
    <React.Fragment>
      <Section>
        <div className={classes.divFlex}>
          <Title title={t("clauses")} />
          <ExpandButton
            expanded={open}
            onClick={() => setOpen(!open)}
          />
        </div>
        <Collapse in={open} timeout="auto">
          <Table size="small">
            <TableBody>
              {data.map((clause, index) => (
                <MakeClauseRow
                  key={`${clause.name}-${index}`} 
                  clause={clause} 
                />
              ))}
            </TableBody>
          </Table>
        </Collapse>
      </Section>
    </React.Fragment>
  )
}

export default function PolicyDetails(props) {
  const {policy} = props
  const {t} = useTranslation('policy')

  //console.log(policy)

  return(
    <React.Fragment>
      <Grid container direction="row">
        <Grid container direction="column" item xs={12} md={4}>
          <PolicyMain data={policy} />
          <ProductLine data={policy.product_line} />
          <GenericSection title={t('premium.payer')} data={policy.premium_payer} />
        </Grid>
        <Grid container direction="column" item xs={12} md={4}>
          <GenericSection title={t('insured.object')} data={policy.insured_object} />
        </Grid>
        <Grid container direction="column" item xs={12} md={4}>
          <Clauses data={policy.clauses} />
        </Grid>
      </Grid>
    </React.Fragment>
  )

}

