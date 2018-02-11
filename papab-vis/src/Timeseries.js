import React from 'react'
import * as _ from 'lodash'
import * as d3 from 'd3'

const gettitle = () => {
    return (
      <g transform={"translate(0, 20)"}>
        <text>Rough sleepers</text>
      </g>
    )
  }

const getpoints = (data, xscale, yscale) => {
  return (
    _.map(data, (d, i) => {
      return(
        <circle
          key={`point${i}`}
          cx={xscale(d[0])}
          cy={yscale(d[1])}
          r={2}
        />
      )
    }
    )
  )
}

const getline = (data, xscale, yscale) => {
  const linegenerator = d3.line()
    .x(d => xscale(d[0]))
    .y(d => yscale(d[1]))
  return <path
    d={linegenerator(data)}
    stroke={'black'}
    strokeWidth={0.1}
    fill={'none'}
  />
}

const getannotations = (data, xscale, yscale) => {
  return (
    _.map(data, (d, i) => {
      return(
        <text
          key={`annotation${i}`}
          x={xscale(d[0]) - 2}
          y={yscale(d[1]) - 6}
          fontSize={6}
          textAnchor='end'
        >
          {d[1].toString()}
        </text>
      )
    })
  )
}

const get_xlabels = (data, xscale) => {
  const labels = _.map(data, d => d[0])
  const lines = _.map(labels, (d, i) => {
    const x = xscale(d)
    return(<line
      key={`xlabel${i}`}
      x2={x}
      x1={x}
      y2={0}
      y1={5}
      stroke={'black'}
    />)
  })

  const texts = _.map(labels, (d, i) => {
    const x = xscale(d)
    return(<text
      key={`xtext${i}`}
      x={x}
      y={0}
      fontSize={6}
      textAnchor='middle'
    >
      {d}
    </text>)
  })
  return (
    <g>
      {lines}
      {texts}
    </g>
  )
}

class Timeseries extends React.Component {


  render() {
    const { data, selected } = this.props;
    const width = 200;
    const height = 200;
    const padding = {
      left: 20,
      right: 10,
      top: 50,
      bottom: 20
    }
    const values = _(data)
      .filter(d => selected === null || d.code === selected)
      .value()

    let aggregated = {}
    _.map(values, d => {
      _.map(d.data.timeseries, (v, k) => {
        if(aggregated[k]){
          aggregated[k] = aggregated[k] + v['RoughSleepers']
        } else {
          aggregated[k] = v['RoughSleepers']
        }
      }
      )
    })

    const agg_list = _.map(aggregated, (v, k) => [k, v])

    const xscale = d3.scaleLinear()
      .domain(d3.extent(_.map(agg_list, d=>d[0])))
      .range([0, width - padding.left - padding.right])

    window.selected = selected
    window.agg_list = agg_list
    window.height = height
    window.padding = padding

    const yscale = d3.scaleLinear()
      .domain([0, _.max(_.map(agg_list, d=>d[1]))])
      .range([height - padding.bottom - padding.top, 0])

    return (
      <div>
        <svg
          width={200}
          height={200}
        >
          {gettitle()}
          <g transform={`translate(${padding.left} ${padding.top})`}>
            {getpoints(agg_list, xscale, yscale)}
            {getline(agg_list, xscale, yscale)}
            {getannotations(agg_list, xscale, yscale)}
          </g>
          <g transform={`translate(${padding.left} ${height - padding.bottom})`}>
            {get_xlabels(agg_list, xscale)}
          </g>
        </svg>
      </div>
    );
  }
}

export default Timeseries
