import React from 'react';

import { geoPath, geoAlbers } from 'd3-geo'

class LondonMap extends React.Component {
  render() {
    const { geofeatures, selected, data, selectedVariable, scale} = this.props

    const codes = data.map(d => d.code)
    const width=400
    const height=200
    const proj = geoAlbers()
      .center([4.3, 51.5])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(30000)
      .translate([width / 2, height / 2])

    const pathGenerator = geoPath().projection(proj);

    const regions = geofeatures.map((d, i) => {
      const code = d.properties.lau118cd
      const indata = codes.includes(code)
      const datapoint = data.filter(x => x.code === code)[0]
      const value = datapoint.data.demographics[selectedVariable]
      const fill = code === selected ? 'red' : scale(value)
      return(
        <path
          className='region'
          key={`path${i}`}
          d={pathGenerator(d)}
          fill={fill}
          strokeWidth='0.5px'
          stroke='white'
          onClick={x => this.props.changeregion(d.properties.lau118cd)}
        />
      )
    }
    )

    return (
      <div>
        <h3>London</h3>
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

export default LondonMap;
