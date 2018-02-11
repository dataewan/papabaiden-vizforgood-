import React from 'react';

import { geoPath, geoAlbers } from 'd3-geo'

class RSMap extends React.Component {
  render() {
    const { geofeatures, selected, data, selectedVariable, scale} = this.props

    const codes = data.map(d => d.code)
    const width=400
    const height=450
    const proj = geoAlbers()
      .center([2.5, 53.0])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(4000)
      .translate([width / 2, height / 2])

    const pathGenerator = geoPath().projection(proj);

    const regions = geofeatures.map((d, i) => {
      const code = d.properties.lau118cd
      const indata = codes.includes(code)
      const datapoint = data.filter(x => x.code === code)[0]
      const value = datapoint.data.demographics[selectedVariable]
      const fill = code === selected ? '#f9e039' : scale(value)
      return(
        <path
          className='region'
          key={`path${i}`}
          d={pathGenerator(d)}
          fill={fill}
          strokeWidth='0.1px'
          stroke='black'
          onClick={x => this.props.changeregion(d.properties.lau118cd)}
        />
      )
    }
    )

    return (
      <div>
        <svg
          width={width}
          height={height}
        >
          {regions}
        </svg>
      </div>
    );
  }
}

export default RSMap;
