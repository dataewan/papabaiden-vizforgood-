import numeral from 'numeral'

const functions = {
  SUM: 'SUM',
  MEAN: 'MEAN',
}

const DemographicConfig = {
  'RSRate': {
    pretty: 'Rough sleeping rate',
    formatter: (d) => d.toFixed(6) + ' per 1 000 households',
    aggfunc: functions.MEAN,
    maxval: 0.0012
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
