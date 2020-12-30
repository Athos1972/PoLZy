
export const getDialogOptions = (user, t) => ({
  user: (({name, email}) => ({name, email}))(user),
  title: t('feedback:title'),
  subtitle: t('feedback:subtitle'),
  subtitle2: t('feedback:subtitle2'),
  labelName: t('common:name'),
  labelEmail: t('common:email'),
  labelComments: t('feedback:comment'),
  labelClose: t('common:close'),
  labelSubmit: t('common:submit'),
  errorGeneric: t('feedback:error'),
  errorFormEntry: t('feedback:form.error'),
  successMessage: t('feedback:success'),
})

export const getManualDialogOptions = (user, t) => ({
  user: (({name, email}) => ({name, email}))(user),
  title: t('feedback:manual.title'),
  subtitle: t('feedback:manual.subtitle'),
  subtitle2: '',
  labelName: t('common:name'),
  labelEmail: t('common:email'),
  labelComments: t('feedback:comment'),
  labelClose: t('common:close'),
  labelSubmit: t('common:submit'),
  errorGeneric: t('feedback:error'),
  errorFormEntry: t('feedback:form.error'),
  successMessage: t('feedback:success'),
})

export const getUser = (user) => (
  (({name, email, stage, isSupervisor}) => ({name, email, stage, isSupervisor}))(user)
)

export const getAntragContext = (user, antrag=null) => ({
  user: getUser(user),
  company: (({id, name, displayedName}) => ({id, name, displayedName}))(user.company),
  product: Boolean(antrag) ? {
    name: antrag.product_line.name,
    ...antrag.product_line.attributes,
    } : "new",
})

export const getPolicyContext = (user, policy=null) => ({
  user: getUser(user),
  company: (({id, name, displayedName}) => ({id, name, displayedName}))(user.company),
  policy: Boolean(policy) ? 
    (({policy_number, effective_date}) => ({policy_number, effective_date}))(policy) : 
    "new",
})

export const getManualReportContext = (user, view) => ({
  user: getUser(user),
  company: (({id, name, displayedName}) => ({id, name, displayedName}))(user.company),
  view: view,
})
