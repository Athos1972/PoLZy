import React from 'react'
import { apiHost } from '../utils'

const uriLogo = apiHost + 'api/logo/'

export const getCompanyLogo = (attributes, target) => {
  if (attributes && attributes.logo) {
    return attributes.logo[target]
  }

  return undefined
}

export function EmblemLogo(props) {

  const srcLogo = Boolean(props.logo) ? props.logo : 
    'default/' + (Boolean(props.target) ? props.target : 'default')

  console.log('API HOST:')
  console.log(process.env.REACT_APP_API_HOST)
  console.log(uriLogo)

  return <img src={uriLogo + srcLogo} height={props.size} alt={`${props.target}Logo`} />
}


export function TopBarLogo(props) {

  const srcLogo = Boolean(props.logo) ? props.logo : 'default/top'

  return (
    <img
      src={uriLogo + srcLogo}
      alt="topLogo"
      height={props.size}
      width={2*props.size}
    />
  )
}