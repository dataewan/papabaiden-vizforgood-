import React from 'react';

import { geoPath, geoAlbers } from 'd3-geo'

class LondonMap extends React.Component {
  render() {
    const { geofeatures, data } = this.props

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

    window.geofeatures = geofeatures
    window.data = data

    const regions = geofeatures.map((d, i) => {
      const indata = codes.includes(d.properties.lau118cd)
      return(
        <path
          className='region'
          key={`path${i}`}
          d={pathGenerator(d)}
          fill={'salmon'}
          strokeWidth='0.5px'
          stroke='white'
          onClick={x => console.log(d.properties.lau118nm)}
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
