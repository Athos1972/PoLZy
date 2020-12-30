import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { reportProblem } from './api/feedback'


export function ReportDialogBase(props) {

  const {t} = useTranslation('feedback')

  const [open, setOpen] = React.useState(true)
  const [feedback, setFeedback] = React.useState('')

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    console.log('submit report')
    console.log(props)
    const requestBody = {
      user: {
        name: props.user.name,
      },
      company: {
        id: props.user.company.id,
        name: props.user.company.name,
      },
      tab: props.tab,
      item: props.item,
      feedback: feedback,
    }

    reportProblem(props.user, requestBody)
  }

  const handleChangeFeedback = (event) => {
    setFeedback(event.target.value)
  } 

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      aria-labelledby="reporting-dialog"
    >
      <DialogTitle id="reporting-dialog">
        {t("feedback:description")}
      </DialogTitle>
      <DialogContent>
        <TextField
          label={t('feedback:description')}
          multiline
          fullWidth
          rows={4}
          rowsMax={8}
          value={feedback}
          onChange={handleChangeFeedback}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit}>
          {t("common:submit")}
        </Button>
        <Button onClick={handleClose}>
          {t("common:close")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// connect to redux store
export const ReportDialog = connect((state) => ({
  user: state.user,
}))(ReportDialogBase)

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    //this.state = { hasError: false };
    this.state = { error: null, errorInfo: null };
  }
/*
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
*/
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      // You can render any custom fallback UI
      return (
        <React.Fragment>
        <div>
          <h1>Something went wrong.</h1>
          <div>
            {this.state.error && this.state.error.toString()}
          </div>
        </div>
        <ReportDialog {...this.props}/>
        </React.Fragment>
      )
    }

    return this.props.children; 
  }
}
