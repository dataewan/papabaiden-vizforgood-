import React from 'react'
import * as _ from 'lodash';
import * as d3 from 'd3';
import DemographicConfig from './DemographicConfig'

window.d3 = d3

const aggregate = (values, aggfunc) => {
  if (aggfunc === 'SUM'){
    return _.sum(values)
  }
  if (aggfunc === 'MEAN'){
    return _.sum(values) / values.length
  }
  if (aggfunc === 'MAX'){
    return _.max(values)
  }
}

const plotrects = (value, nationalvalue, maxvalue) => {
  const scale = d3.scaleLinear()
    .domain([0, maxvalue])
    .range([0, 200])

  const linebreak = value > maxvalue ? <line
    x1={150}
    x2={150}
    y1={40}
    y2={0}
    strokeWidth={15}
    stroke={'white'}
    strokeDasharray={'1,1'}
  /> : null

  return <g>
    <line
      x1={scale(nationalvalue)}
      x2={scale(nationalvalue)}
      y1={40}
      y2={0}
      width={5}
      stroke={'black'}
    />
    <g transform={'translate(0, 10)'}>
      <rect
        width={scale(value)}
        height={20}
      />
    </g>
    {linebreak}
  </g>
}


class Demographic extends React.Component {
  render() {
    const { data, selected, variable, change, selectedVariable} = this.props;
    const conf = DemographicConfig[variable];
    const { pretty, formatter, aggfunc, maxval } = conf;

    const values = _(data)
      .filter(d => selected === null || d.code === selected)
      .map(d => d.data.demographics[variable])
      .value()
    const value = aggregate(values, aggfunc)

    const nationalvalues = _(data)
      .map(d => d.data.demographics[variable])
      .value()

    const nationalvalue = aggregate(nationalvalues, 'MEAN')
    const nationalvalue_max = maxval ? maxval : aggregate(nationalvalues, 'MAX')

    return (
      <div 
        onClick={d => change(variable)}
        className={variable === selectedVariable ? 'selectedDemographic' : 'unselectedDemographic'}
      >
        <div className='demographic_measurename'>{pretty}</div>
        <svg className='demographic_svg'
          height={40}
          width={200}
        >
          {selected ? plotrects(value, nationalvalue, nationalvalue_max) : null}
        </svg>
        <div className='demographic_measurement'>{formatter(value)}</div>
      </div>
    );
  }
}

export default Demographic
