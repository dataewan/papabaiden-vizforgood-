import React from 'react'
import * as _ from 'lodash';
import DemographicConfig from './DemographicConfig'

const aggregate = (values, aggfunc) => {
  if (aggfunc === 'SUM'){
    return _.sum(values)
  }
  if (aggfunc === 'MEAN'){
    return _.sum(values) / values.length
  }
}


class Demographic extends React.Component {
  render() {
    const { data, selected, variable } = this.props;
    const conf = DemographicConfig[variable];
    const { pretty, formatter, aggfunc } = conf;

    const values = _(data)
      .filter(d => selected === null || d.code === selected)
      .map(d => d.data.demographics[variable])
      .value()
    const value = aggregate(values, aggfunc)

    const nationalvalues = _(data)
      .map(d => d.data.demographics[variable])
      .value()
    const nationalvalue = aggregate(nationalvalues, 'MEAN')

    return (
      <div>
        <h5>{pretty}</h5>
        <h6>{formatter(value)}</h6>
      </div>
    );
  }
}

export default Demographic
