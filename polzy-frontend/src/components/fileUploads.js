import React from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { DropzoneArea } from 'material-ui-dropzone'
import { uploadFiles } from '../api/general'
import { useSnackbar } from 'notistack'


// styles
const useStyles = makeStyles({
  filePreviewArea: {
    display: "flex",
    justifyContent: "center",
  },
})


function FileUploadDialog(props) {
  const {t} = useTranslation('common')
  const classes = useStyles()

  const [file, setFile] = React.useState()

  const handleFileAdd = (files) => {
    setFile(files[0])
  }

  const handleClose = () => {
    props.onClose()
  }

  // success toast: START
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const closeToast = (key) => (
    <IconButton onClick={() => {closeSnackbar(key)}}>
      <CloseIcon />
    </IconButton>
  )
  // -------> END

  const handleSubmit = () => {
    //console.log('File Upload Dialog: submitted')
    //console.log(file)

    uploadFiles(props.user, props.parentId, file).then(data => {
      //console.log('Upload: OK')
      //console.log(data)
      enqueueSnackbar(
        "File successfully uploaded",
        {
          variant: 'success',
          anchorOrigin: {
            horizontal: 'left',
            vertical: 'bottom',
          },
          autoHideDuration: 5000,
          preventDuplicate: true,
          action: closeToast,
        },
      )
      props.onUpload()
      props.onClose()
    }).catch(error => {
      console.log('Upload: Error')
      console.log(error)
    })
  }

  return(
    <Dialog
      fullWidth
      open={props.open}
    >
      <DialogContent>
        <DropzoneArea
          previewGridClasses={{container: classes.filePreviewArea}}
          filesLimit={1}
          dropzoneText={t('common:upload.text')}
          onChange={handleFileAdd}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t("common:cancel")}
        </Button>
        <Button
          color="primary"
          onClick={handleSubmit}
          disabled={!Boolean(file)}
        >
          {t("common:upload")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(FileUploadDialog)