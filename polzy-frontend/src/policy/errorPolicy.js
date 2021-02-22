import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Typography, Collapse } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { CardError, CardTop, CardMiddle, hideTime } from '../styles/cards'
import { PolicyTitle } from './Components'
import { removePolicy } from '../redux/actions'
import CardCloseButton from '../components/closeButton'


function ErrorPolicy(props) {
  const {index, policy} = props
  const { t } = useTranslation('common', 'policy')
  const [isVisible, setIsVisible] = useState(false)

  // card appear animation
  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  //console.log('ERROR POLICY:')
  //console.log(policy)

  return(
    <Collapse
      in={isVisible}
      timeout={hideTime}
      unmountOnExit
    >
      <CardError>
        <CardTop
          action={
            <CardCloseButton
              onClose={() => setIsVisible(false)}
              onDelete={() => props.closePolicyCard(index)}
            />
          }
          title={<PolicyTitle number={policy.policy_number} />}
          subheader={policy.effective_date}
        />
        <CardMiddle>
          <Typography
            component="p"
            variant="h5"
          >
            {"error" in policy ? (policy.error) : (t("policy:invalid"))}
          </Typography>
        </CardMiddle>
      </CardError>
    </Collapse>
  )
}

// connect to redux store
export default connect(null, {closePolicyCard: removePolicy})(ErrorPolicy)
