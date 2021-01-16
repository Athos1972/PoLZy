import React from 'react'
import { connect } from 'react-redux'
import {
  Tab,
  Tabs,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import { useTranslation } from 'react-i18next'
import ProgressButton from '../components/progressButton'
import { getRankings } from '../api/gamification'
import { formatNumberWithCommas } from '../utils'


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

  // create waiting animation
  const waitingRows = []
  for (let row = 0; row < 3; row++) {
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

  //console.log(waitingRows)

  const updateRankings = () => {
    getRankings(props.user).then(data => {
      setRankingData(data)
    }).catch(error => {
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

  return(
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
          <col style={{width:'45%'}}/>
          <col style={{width:'10%'}}/>
          <col style={{width:'45%'}}/>
        </colgroup>
        <TableBody>
          {loading ? (
            waitingRows
          ) : (
            <React.Fragment>
              {rankingData[tab].map((data, index) => (
                <TableRow key={index}>
                  <TableCell align='center'>{data.name}</TableCell>
                  <TableCell align='center'>{formatNumberWithCommas(data.operations)}</TableCell>
                  <TableCell align='center'>{data.rank}%</TableCell>
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
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(RankingView)
