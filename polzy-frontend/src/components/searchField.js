import React from 'react'
import {
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import SearchIcon from '@material-ui/icons/Search'
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'


// Styles
const useStyles = makeStyles((theme) => ({
  inputField: {
    paddingBottom: theme.spacing(2),
  },

}))

export default function SearchField(props) {
  const {id, data, value, onChange } = props
  const {t} = useTranslation('common')
  const classes = useStyles()

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={10}>
          <FormControl
            classes={{root: classes.inputField}}
            variant="outlined"
            size="small"
            fullWidth
            required={data.isMandatory}
          >
            <InputLabel htmlFor={`${data.name}-${id}`}>
              {data.brief}
            </InputLabel>
            <OutlinedInput
              id={`${data.name}-${id}`}
              value={value}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              }
              label={data.brief}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6} lg={1}>
          <Button
            variant="contained"
            color="default"
            fullWidth
            startIcon={<SearchIcon fontSize="small" />}
          >
            {t('common:find')}
          </Button>
        </Grid>
        <Grid item xs={6} lg={1}>
          <Button
            variant="contained"
            color="default"
            fullWidth
            startIcon={<AccessibilityNewIcon />}
          >
            {t('common:new')}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}