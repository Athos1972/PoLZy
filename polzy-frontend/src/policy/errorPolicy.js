import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Typography, IconButton, Tooltip } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { useTranslation } from 'react-i18next'
import { CardErrorHide, CardError, CardTop, CardMiddle, hideTime } from './CardStyles'
import { PolicyTitle } from './Components'
import { removePolicy } from '../redux/actions'

function PolicyCard(props) {
  const {hidden, content} = props

  return(
    <React.Fragment>
      {hidden ? (
        <CardErrorHide>
          {content}
        </CardErrorHide>
      ) : (
        <CardError>
          {content}
        </CardError>
      )}
    </React.Fragment>
  )
}

function ErrorPolicy(props) {
  const {index, policy} = props
  const { t } = useTranslation('policy')
  const [hidden, setHidden] = useState(false)

  const handleCloseClick = () => {
    //props.closePolicyCard(index)
    setHidden(true)
    setTimeout(() => {props.closePolicyCard(index)}, hideTime)
  }

  return(
    <PolicyCard
      hidden={hidden}
      content={
        <React.Fragment>
          <CardTop
            action={
              <Tooltip title={t('close')}>
                <IconButton 
                  aria-label="close"
                  onClick={handleCloseClick}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            }
            title={<PolicyTitle number={policy.policy_number} />}
            subheader={policy.effective_date}
          />
          <CardMiddle>
            <Typography
              component="p"
              variant="h5"
            >
              {"error" in policy ? (t(policy.error.toLowerCase())) : (t("invalid"))}
            </Typography>
          </CardMiddle>
        </React.Fragment>
      }
    />
  )
}

// connect to redux store
export default connect(null, {closePolicyCard: removePolicy})(ErrorPolicy)
