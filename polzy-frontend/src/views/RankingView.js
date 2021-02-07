import React from 'react'
import { connect } from 'react-redux'
import {
  Tab,
  Tabs,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ProgressButton from '../components/progressButton'
import { getRankings } from '../api/gamification'
import { formatNumberWithCommas } from '../utils'
import { formatRankWithSuffix } from '../utils'


const rankingTabList = [
  'weekly',
  'monthly',
  'annual',
]

const useStyles = makeStyles((theme) => ({
  updateButtonContainer: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))


function RankingView(props) {
  const classes = useStyles()
  const {t} = useTranslation('gamification')

  const [tab, setTab] = React.useState(rankingTabList[0])
  const [rankingData, setRankingData] = React.useState()
  const [loading, setLoading] = React.useState(true)
  const [rankingLines, setRankingLines] = React.useState(3)
  const [errorData, setErrorData] = React.useState(false)

  // generate waiting animation
  const getWaitingRows = () => {
    const waitingRows = []
    
    for (let row = 0; row < rankingLines; row++) {
      waitingRows.push(
        <TableRow key={row}>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
          <TableCell>
            <Skeleton />
          </TableCell>
        </TableRow>
      )
    }

    return waitingRows
  }

  //console.log(waitingRows)

  const updateRankings = () => {
    getRankings(props.user).then(data => {
      setRankingData(data)

      console.log('Ranking Data:')
      console.log(data[tab])
      
      if (data[tab]) {
        setRankingLines(data[tab].length)
      }
    }).catch(error => {
      setErrorData(true)
      console.log(error)
    }).finally(() => {
      setLoading(false)
    })
  }
  
  // fetch rankings for the first time
  React.useEffect(() => {
    updateRankings()
  }, [])

  const handleUpdateRankings = () => {
    setLoading(true)
    updateRankings()
  }

  const handleTabChange = (event, value) => {
    setTab(value)
  }

  console.log(props.user)

  return(
    <React.Fragment>
      {errorData ? (
         <Typography
            className={classes.formItem}
            variant="h3"
            component="div"
            align="center"
          >
            {t('common:na')}
          </Typography>
      ) : (
        <React.Fragment>

          {/* Ranking Tabs */}
          <Tabs 
            value={tab}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="primary"
            variant="fullWidth"
          >
            {rankingTabList.map((rankingTab) => (
              <Tab
                key={rankingTab}
                label={t(`gamification:${rankingTab}`)}
                value={rankingTab}
                id={`tab-${rankingTab}`}
              />
            ))}
          </Tabs>

          {/* Ranking Table */}
          <Table>
            <colgroup>
              <col style={{width:'40%'}}/>
              <col style={{width:'30%'}}/>
              <col style={{width:'35%'}}/>
            </colgroup>
            <TableHead>
              <TableRow>
                <TableCell align='left'>
                  {t("gamification:topic")}
                </TableCell>
                <TableCell align="center">
                  {t("gamification:points")}
                </TableCell>
                <TableCell align="center">
                  {t("gamification:rank")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                getWaitingRows()
              ) : (
                <React.Fragment>
                  {rankingData[tab].map((data, index) => (
                    <TableRow key={index}>
                      <TableCell align='left'>{data.name}</TableCell>
                      <TableCell align='center'>{formatNumberWithCommas(data.operations)}</TableCell>
                      <TableCell align='center'>{data.rank}<sup>{formatRankWithSuffix(data.rank)}</sup></TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              )}
            </TableBody>
          </Table>

          {/* Update Button */}
          <div className={classes.updateButtonContainer} >
            <ProgressButton
              title={t('gamification:update')}
              loading={loading}
              onClick={handleUpdateRankings}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(RankingView)
