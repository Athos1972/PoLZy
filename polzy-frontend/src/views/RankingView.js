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


const rankingTabList = [
  'weekly',
  'monthly',
  'annual',
]

const debugRankingData = {
  weekly: [
    {
      name: "WeeklyKFZ FastOffer",
      operations: 1,
      rank: 10,
    },
    {
      name: "Weekly Wohnen FastOffer",
      operations: 2,
      rank: 20,
    },
    {
      name: "WeeklyPolicy Cancelation",
      operations: 3,
      rank: 30,
    },
  ],
  monthly: [
    {
      name: "Monthly KFZ FastOffer",
      operations: 4,
      rank: 40,
    },
    {
      name: "MonthlyWohnen FastOffer",
      operations: 5,
      rank: 50,
    },
    {
      name: "MonthlyPolicy Cancelation",
      operations: 6,
      rank: 60,
    },
  ],
  annual: [
    {
      name: "Annual KFZ FastOffer",
      operations: 7,
      rank: 70,
    },
    {
      name: "Annual Wohnen FastOffer",
      operations: 8,
      rank: 80,
    },
    {
      name: "Annual Policy Cancelation",
      operations: 999999,
      rank: 90,
    },
  ],
}

function RankingView(props) {
  //const classes = useStyles()
  const {t} = useTranslation('gamification')

  const [tab, setTab] = React.useState(rankingTabList[0])
  const [rankingData, setRankingData] = React.useState(debugRankingData)

  /*
  // update allowed views
  useEffect(() => {
    const views = Object.keys(props.permissions).filter(item => props.permissions[item])
    setAllowedViews(views)
    setTab(views.length > 0 ? views[0] : null)
  }, [props.permissions])
*/

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
          {rankingData[tab].map((data, index) => (
            <TableRow key={index}>
              <TableCell align='center'>{data.name}</TableCell>
              <TableCell align='center'>{data.operations}</TableCell>
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
