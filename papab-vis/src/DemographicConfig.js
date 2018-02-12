import numeral from 'numeral'

const functions = {
  SUM: 'SUM',
  MEAN: 'MEAN',
}

const DemographicConfig = {
  'RSRate': {
    pretty: 'Rough sleepers per 1000 households',
    formatter: (d) => d.toFixed(6),
    aggfunc: functions.MEAN,
    maxval: 1.2
  },
  'Totalroughsleepercountestimate': {
    pretty: 'Total rough sleepers',
    formatter: (d) => numeral(d).format('0,0'),
    aggfunc: functions.SUM
  },
  'Under25yearsold': {
    pretty: 'Rough sleepers under 25',
    formatter: (d) => numeral(d).format('0,0'),
    aggfunc: functions.SUM
  },
  'Female': {
    pretty: 'Female rough sleepers',
    formatter: (d) => numeral(d).format('0,0'),
    aggfunc: functions.SUM
  },
}


export default DemographicConfig;
