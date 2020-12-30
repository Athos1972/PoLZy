import React from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Checkbox,
  TextField,
  Link,
} from '@material-ui/core'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import MoreButton from '../components/expandButton'
import { fetchAdminData, manageUserInCompany, manageChildCompany } from '../api/admin'
import { validateEmail, validateJSONString } from '../utils'

// styles
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },

  companyBar: {
    backgroundColor: theme.palette.primary.light,
  },

  formItem: {
    //marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  actionLink: {
    marginRight: theme.spacing(1)
  }, 

  actionCol: {
    maxWidth: 200,
  }
}))

function UserDialog(props) {
  const classes = useStyles()
  const {t} = useTranslation("common", "admin")
  const editUser = Boolean(props.user)
  
  const defaultValues = {
    email: {
      value: '',
      error: null,
    },
    roles: {
      value: props.possibleRoles.reduce((result, role) => ({
        ...result,
        [role]: false,
      }), {}),
      error: t("admin:roles.error"),
    },
    attributes: {
      value: '',
      error: null,
    }
  }
  const [email, setEmail] = React.useState(defaultValues.email)
  const [roles, setRoles] = React.useState(defaultValues.roles)
  const [attributes, setAttributes] = React.useState(defaultValues.attributes)

  React.useEffect(() => {
    if (!editUser) {
      return
    }

    //console.log('Use Effect:')
    //console.log(props.user)

    // set user data
    setEmail({
      value: props.user.email,
      error: null,
    })
    setRoles({
      value: props.user.roles.reduce((result, role) => ({
        ...result,
        [role]: true,
      }), defaultValues.roles.value),
      error: null,
    })
    setAttributes({
      value: props.user.attributes,
      error: null,
    })
  }, [props.user])

  const handleUserChange = (event) => {
    const value = event.target.value
    const errorMsg = validateEmail(value) ? null : "Invalid email"
    setEmail({
      value: value,
      error: errorMsg,
    })
  }

  const handleRoleChange = (event) => {
    const newRoles = {
      ...roles.value,
      [event.target.name]: event.target.checked,
    }

    // check if at least one role checked
    const errorMsg = props.possibleRoles.filter((role) => newRoles[role]).length > 0 ? null : t("admin:roles.error")

    //console.log('ROLE CHANGE:')
    //console.log(newRoles)
    //console.log(errorMsg)
    setRoles({
      value: {...newRoles},
      error: errorMsg,
    })
  }

  const handleAttributeChange = (event) => {
    const newValue = event.target.value
    const errorMsg = validateJSONString(newValue) ? null : t("admin:attributes.error")

    setAttributes({
      value: newValue,
      error: errorMsg,
    })
  }

  const handleConfirmClick = () => {
    // get action
    const action = editUser ? 'edit' : 'add'
    // build request body
    const payload = {
      email: email.value,
      roles: roles.value,
      attributes: attributes.value,
    }

    // clear fields
    setEmail(defaultValues.email)
    setRoles(defaultValues.roles)
    setAttributes(defaultValues.attributes)

    props.action(action, payload)
  }

  const validateForm = () => {
    return Boolean(email.value) && !Boolean(email.error) && !Boolean(roles.error) && !Boolean(attributes.error)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="user-dialog"
    >
      <DialogTitle
        id="user-dialog"
      >
        {editUser ? t("admin:user.edit") : t("admin:user.add")}
      </DialogTitle>
      <DialogContent>

        {/* User Email */}
        <FormControl
          className={classes.formItem}
          variant="outlined"
          size="small"
          fullWidth
          required
          disabled={editUser}
          error={Boolean(email.error)}
        >
          <InputLabel htmlFor="user-email">
            {t("admin:user.email")}
          </InputLabel>
          <OutlinedInput
            id="user-email"
            value={email.value}
            onChange={handleUserChange}
            label={t("admin:user.email")}
          />
          <FormHelperText>
            {email.error}
          </FormHelperText>
        </FormControl>
        
        {/* User Roles */}
        <FormControl
          className={classes.formItem}
          component="fieldset"
          error={Boolean(roles.error)}
        >
          <FormLabel
            component="legend"
          >
            {t("admin:roles")}
          </FormLabel>
          <FormGroup>
            {props.possibleRoles.map(role => (
              <FormControlLabel
                key={role}
                control={
                  <Checkbox
                    name={role}
                    checked={roles.value[role]}
                    onChange={handleRoleChange}
                  />}
                label={role}
              />
            ))}
          </FormGroup>
          <FormHelperText>
            {roles.error}
          </FormHelperText>
        </FormControl>

        {/* User Attributes */}
        <TextField
          id="user-attributes"
          label={t("admin:attributes")}
          multiline
          fullWidth
          variant="outlined"
          value={attributes.value}
          onChange={handleAttributeChange}
          size="small"
          error={Boolean(attributes.error)}
          helperText={Boolean(attributes.error) ? t("admin:attributes.error"): ""}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t("common:cancel")}
        </Button>
        <Button
          color="primary"
          onClick={handleConfirmClick}
          disabled={!validateForm()}
        >
          {t("common:confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function CompanyDialog(props) {
  const classes = useStyles()
  const {t} = useTranslation("common", "admin")
  
  const [attributes, setAttributes] = React.useState('')
  const [errorMsg, setErrorMasg] = React.useState('')

  React.useEffect(() => {
    setAttributes(props.company.attributes)
    setErrorMasg(validateJSONString(props.company.attributes) ? null : t("admin:attributes.error"))
  }, [props])

  const handleAttributeChange = (event) => {
    const newValue = event.target.value

    // update state
    setAttributes(newValue)
    setErrorMasg(validateJSONString(newValue) ? null : t("admin:attributes.error"))
  }

  const handleConfirmClick = () => {
    // build request body
    const payload = {
      childCompanyId: props.company.id,
      attributes: attributes,
    }

    // reset fields
    setAttributes('')
    setErrorMasg('')

    props.action('edit', payload)
  }

  const validateForm = () => {
    return Boolean(attributes) && !Boolean(errorMsg)
  }

  console.log('COMPANY DIALOG:')
  console.log(props)

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="company-dialog"
    >
      <DialogTitle
        id="company-dialog"
      >
        {t("admin:company.edit")}
      </DialogTitle>
      <DialogContent>

        {/* Company Name */}
        <Typography
          className={classes.formItem}
          id="company-name"
          variant="button"
          component="div"
        >
          {props.company.name}
        </Typography>

        {/* Company Attributes */}
        <TextField
          id="company-attributes"
          label={t("admin:attributes")}
          multiline
          fullWidth
          variant="outlined"
          value={attributes}
          onChange={handleAttributeChange}
          size="small"
          error={Boolean(errorMsg)}
          helperText={Boolean(errorMsg) ? t("admin:attributes.error"): ""}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t("common:cancel")}
        </Button>
        <Button
          color="primary"
          onClick={handleConfirmClick}
          disabled={!validateForm()}
        >
          {t("common:confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


function CompanyCard(props) {

  const classes = useStyles()
  const {t} = useTranslation("admin", "common")
  const [expanded, setExpanded] = React.useState(false)

  const truncateString = (string, length=30) => {
    if (string.length <= length) {
      return string
    }

    return string.substring(0, length) + '...'
  }

  const handleAddUser = () => {
    props.openDialog('user', props.id)
  }

  const handleEditUser = (user) => {
    //console.log('Edit Roles')
    //console.log(user)

    props.openDialog('user', props.id, user)
  }

  const handleRemoveUser = (user) => {
    const payload = {
      email: user.email,
      companyId: props.id,
    }

    //console.log('Remove User')
    //console.log(payload)

    props.actions.user('remove', payload)
  }
/*
  const handleAddCompany = () => {
    props.openDialog('company', props.id)
  }
*/
  const handleEditCompany = (company) => {
    //console.log("Edit Company:")
    //console.log(company.id)

    props.openDialog('company', props.id, company)
  }
/*
  const handleRemoveCompany = (company) => {
    const payload = {
      parentCompanyId: props.id,
      childCompanyId: company.id,
    }

    console.log("Remove Company:")
    console.log(payload)

    props.actions.company('remove', payload)
  }
*/
  return (
    <Card>
      <CardHeader
        action={
          <MoreButton
            expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          />
        }
        title={props.name}
        subheader={props.displayedName}
      />
      <Collapse
        in={expanded}
        timeout="auto"
        unmountOnExit
      >
        <CardContent>

          {/* Child Companies */}
          {props.childCompanies.length > 0 &&
            <React.Fragment>
              <Toolbar
                className={classes.companyBar}
                variant="dense"
              >
                <Typography
                  id="tableTitle"
                  variant="h6"
                  component="div"
                  className={classes.title}
                >
                  {t("admin:company.children")}
                </Typography>
                {/*
                <Tooltip title={t("admin:company.add")}>
                  <IconButton
                    aria-label="add-user"
                    onClick={handleAddCompany}
                    disabled
                  >
                    <BusinessIcon />
                  </IconButton>
                </Tooltip>
              */}
              </Toolbar>
              <Table>
                <colgroup>
                  <col style={{width:'25%'}}/>
                  <col style={{width:'55%'}}/>
                  <col style={{width:'20%'}}/>
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("admin:company")}</TableCell>
                    <TableCell>{t("admin:attributes")}</TableCell>
                    <TableCell className={classes.actionCol}>{t("admin:actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.childCompanies.map((company) => (
                    <TableRow key={`${props.id}-${company.id}`}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>
                        {truncateString(company.attributes)}
                      </TableCell>
                      <TableCell>
                        <Link
                          classes={{root: classes.actionLink}}
                          component="button"
                          variant="body2"
                          onClick={() => handleEditCompany(company)}
                        >
                          {t("common:edit")}
                        </Link>
                        {/*}
                        <Link
                          classes={{root: classes.actionLink}}
                          component="button"
                          variant="body2"
                          onClick={() => handleRemoveCompany(company)}
                        >
                          {t("common:remove")}
                        </Link>
                      */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </React.Fragment>
          }

          {/* Users */}
          <Toolbar
            className={classes.companyBar}
            variant="dense"
          >
            <Typography
              id="tableTitle"
              variant="h6"
              component="div"
              className={classes.title}
            >
              {t("admin:user.plural")}
            </Typography>
            <Tooltip title={t("admin:user.add")}>
              <IconButton
                aria-label="add-user"
                onClick={handleAddUser}
              >
                <PersonAddIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Table>
            <colgroup>
              <col style={{width:'25%'}}/>
              <col style={{width:'20%'}}/>
              <col style={{width:'35%'}}/>
              <col style={{width:'20%'}}/>
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell>{t("admin:user")}</TableCell>
                <TableCell>{t("admin:roles")}</TableCell>
                <TableCell>{t("admin:attributes")}</TableCell>
                <TableCell>{t("admin:actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.users.map((user, index) => (
                <TableRow key={`${props.id}-${index}`}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles.join(', ')}
                  </TableCell>
                  <TableCell>
                    {truncateString(user.attributes)}
                  </TableCell>
                  <TableCell>
                    <Link
                      classes={{root: classes.actionLink}}
                      component="button"
                      variant="body2"
                      onClick={() => handleEditUser(user)}
                    >
                      {t("common:edit")},
                    </Link>
                    <Link
                      classes={{root: classes.actionLink}}
                      component="button"
                      variant="body2"
                      onClick={() => handleRemoveUser(user)}
                    >
                      {t("common:remove")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </CardContent>
      </Collapse>
    </Card>
  )
}



function AdminView(props) {

  const [adminData, setAdminData] = React.useState(null)
  const [userOpen, setUserOpen] = React.useState(false)
  const [companyOpen, setCompanyOpen] = React.useState(false)
  //const [currentInstance, setCurrentInstance] = React.useState(null)
  const [parentCompanyId, setParentCompanyId] = React.useState(null)
  const [childCompany, setChildCompany] = React.useState({})
  const [userInCompany, setUserInCompany] = React.useState(null)
  

  React.useEffect(() => {
    fetchAdminData(props.user).then(data => {

      //update state
      setAdminData(data)

    }).catch(error => {
      console.log(error)
    })
  }, [])

  const handleOpenDialog = (target, parentCompanyId, instance=null) => {

    setParentCompanyId(parentCompanyId)

    switch (target) {
      case 'user':
        setUserInCompany(instance)
        setUserOpen(true)
        break
      case 'company':
        setChildCompany(instance)
        setCompanyOpen(true)
        break
      default:
        return
    }
  }

  const handleManageUser = (action, payload) => {
    // build request body
    const requestData = {
      companyId: parentCompanyId,
      ...payload,
    }

    // run action
    manageUserInCompany(props.user, action, requestData).then(data => {
      // update state
      setAdminData(data)
    }).catch(error => {
      console.log(error)
    })

    setUserOpen(false)
  }

  const handleManageCompany = (action, payload) => {
    // build request body
    const requestData = {
      parentCompanyId: parentCompanyId,
      ...payload,
    }

    // run action
    manageChildCompany(props.user, action, requestData).then(data => {
      console.log('RESPONSE - child company:')
      console.log(data)
      // update state
      setAdminData(data)
    }).catch(error => {
      console.log(error)
    })

    // close dialog
    setCompanyOpen(false)
  }
  
  console.log('Admin Data:')
  console.log(adminData)

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {Boolean(adminData) && adminData.companies.map(company => (
          <Grid item xs={12} key={company.id}>
            <CompanyCard
              {...company}
              actions={{
                user: handleManageUser,
                company: handleManageCompany,
              }}
              openDialog={handleOpenDialog}
            />
          </Grid>
        ))}
      </Grid>
      {Boolean(adminData) &&
        <React.Fragment>
          <UserDialog
            user={userInCompany}
            possibleRoles={adminData.possibleRoles}
            open={userOpen}
            action={handleManageUser}
            onClose={() => setUserOpen(false)}
          />
          <CompanyDialog
            company={childCompany}
            open={companyOpen}
            action={handleManageCompany}
            onClose={() => setCompanyOpen(false)}
          />
        </React.Fragment>
      }
    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(AdminView)