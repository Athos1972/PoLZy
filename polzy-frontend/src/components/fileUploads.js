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
  Grid,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { DropzoneArea } from 'material-ui-dropzone'
import DataFieldSelect from '../datafields/selectField'
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
  const {t} = useTranslation('upload', 'attachment', 'common')
  const classes = useStyles()

  const [file, setFile] = React.useState()
  const [fileType, setFileType] = React.useState()

  const handleFileAdd = (files) => {
    setFile(files[0])
  }

  const handleClose = () => {
    props.onClose()
  }

  const handleTypeChange = (value) => {
    //console.log('File Type:')
    //console.log(value)
    setFileType(value.fileType)
  }

  const getAlertMessage = (alertType, fileName=null) => {
    return t(`upload:alert.${alertType}`).replace("${fileName}", fileName ? fileName : file.name)
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

    uploadFiles(props.user, props.parentId, fileType, file).then(data => {
      //console.log('Upload: OK')
      //console.log(data)
      enqueueSnackbar(
        getAlertMessage("success"),
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

  //console.log('File Upload Dialog:')
  //console.log(props)

  return(
    <Dialog
      fullWidth
      open={props.open}
    >
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DropzoneArea
              previewGridClasses={{container: classes.filePreviewArea}}
              filesLimit={1}
              dropzoneText={t('upload:dropzone')}
              onChange={handleFileAdd}
              getFileAddedMessage={(fileName) => getAlertMessage("add", fileName)}
              getFileRemovedMessage={(fileName) => getAlertMessage("remove", fileName)}
            />
          </Grid>

          {props.withFileType &&
            <Grid item xs={12}>
              <DataFieldSelect
                id={props.parentId}
                value={fileType}
                data={{
                  name: 'fileType',
                  brief: t('attachment:type'),
                  inputRange: ['async', 'fileType'],
                  isMandatory: true,
                }}
                onChange={handleTypeChange}
              />
            </Grid>
          }
        </Grid>
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
          {t("upload:caption")}
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