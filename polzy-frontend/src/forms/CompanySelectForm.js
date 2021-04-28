import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Grid,
  TextField,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useTranslation } from 'react-i18next'
import { getPermissions } from '../api/auth'


/**
 * A user could be assigned to multiple companies and organizations.
 * _CompanySelectView_ provides a form to submit a company to work in.
 *
 * @component
 * @category Auth Forms
 */
function CompanySelectForm(props) {
  const {t} = useTranslation('auth')

  /**
   * @typedef {object} state
   * @ignore
   */
  /**
   * @name company
   * @desc State: Object that contains data of the currently selected company from the user company list.
   * @prop {object} company - state
   * @prop {function} setCompany - setter
   * @type {state}
   * @memberOf CompanySelectForm
   * @inner
   */
  const [company, setCompany] = React.useState(null)

  /**
   * Event Handler<br/>
   * **_Event:_** select a company from the list of available companies.<br/>
   * **_Implementation:_** sets the selected company object to state [_company_]{@link CompanySelectForm~company}.
   */
  const handleCompanyChange = (event, value) => {
    setCompany(value)
  }

  /**
   * Event Handler<br/>
   * **_Event:_** click _submit_ button.<br/>
   * **_Implementation:_** calls back-end (_{@link getPermissions}_) for user permissions in the selected company.
   * If response is successful then fires [_props.onSubmit_]{@link CompanySelectForm} callback.
   */
  const handleCompanySelect = () => {
    getPermissions(props.user, company).then(permissions => {
      props.onSubmit(permissions)
    }).catch((error) => {
      console.log(error)
    })
  }

  /**
   * Checks if a company selected.
   * Enables the submition button if the form is valid.
   *
   * @function
   */
  const validateForm = () => {
    return Boolean(company)
  }

  return(
    <React.Fragment>
      <Grid item xs={12}>
        <Autocomplete
          id="company-select"
          fullWidth
          value={company}
          onChange={handleCompanyChange}
          options={props.user.companies}
          getOptionSelected={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name}
          size="small"
          renderInput={(params) => 
            <TextField {...params}
              label={t("auth:company")}
              variant="outlined"
              required
            />
          }
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCompanySelect}
          disabled={!validateForm()}
        >
          {t('auth:submit.company')}
        </Button>
      </Grid>
    </React.Fragment>
  )
}

CompanySelectForm.propTypes = {
  /**
   * Object that contains user credentials and the list of associated companies.
   */
  user: PropTypes.object,
  /**
   * Callback fired when the submit button is clicked.
   */
  onSubmit: PropTypes.func.isRequired,
}

export default CompanySelectForm