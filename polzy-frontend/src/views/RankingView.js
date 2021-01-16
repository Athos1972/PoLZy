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
import { useTranslation } from 'react-i18next'
import { getRankings } from '../api/gamification'
import { formatNumberWithCommas } from '../utils'


const rankingTabList = [
  'weekly',
  'monthly',
  'annual',
]

function RankingView(props) {
  //const classes = useStyles()
  const {t} = useTranslation('gamification')

  const [tab, setTab] = React.useState(rankingTabList[0])
  const [rankingData, setRankingData] = React.useState()
  const [loading, setLoading] = React.useState(true)

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
          {rankingData &&rankingData[tab].map((data, index) => (
            <TableRow key={index}>
              <TableCell align='center'>{data.name}</TableCell>
              <TableCell align='center'>{formatNumberWithCommas(data.operations)}</TableCell>
              <TableCell align='center'>{data.rank}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}

// connect to redux store
const mapStateToProps = (state) => ({
  user: state.user,
})

export default connect(mapStateToProps)(RankingView)
