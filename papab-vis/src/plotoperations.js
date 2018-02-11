import DemographicConfig from './DemographicConfig'
import * as d3 from 'd3'
import * as _ from 'lodash'

const createScale = (data, selectedVariable) => {
  const conf = DemographicConfig[selectedVariable];
  const values = _.map(data, d=>d.data.demographics[selectedVariable])
  const maxvalue = conf.maxval ? conf.maxval : _.max(values)
  const midval = _.sum(values) / values.length

  return d3.scaleSequential(d3.interpolateViridis)
    .domain([0, maxvalue])
}

export {
  createScale
}
