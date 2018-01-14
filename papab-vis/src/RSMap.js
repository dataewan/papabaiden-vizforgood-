import React from 'react';

import { geoPath, geoAlbers } from 'd3-geo'

class RSMap extends React.Component {
  render() {
    const { geofeatures, data } = this.props

    const codes = data.map(d => d.code)
    const width=500
    const height=500
    const proj = geoAlbers()
      .center([0, 52.0])
      .rotate([4.4, 0])
      .parallels([50, 60])
      .scale(2000)
      .translate([width / 2, height / 2])

    const pathGenerator = geoPath().projection(proj);

    window.geofeatures = geofeatures
    window.data = data

    const regions = geofeatures.map((d, i) => {
      const indata = codes.includes(d.properties.lau118cd)
      return(
        <path
          className='region'
          key={`path${i}`}
          d={pathGenerator(d)}
          fill={indata ? 'red' : '#deadbe'}
          strokeWidth='0.1px'
          stroke='white'
          onClick={x => console.log(d.properties.lau118nm)}
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
