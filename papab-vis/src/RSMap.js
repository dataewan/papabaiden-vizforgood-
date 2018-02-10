import React from 'react';

import { geoPath, geoAlbers } from 'd3-geo'

class RSMap extends React.Component {
  render() {
    const { geofeatures, data } = this.props

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
      const indata = codes.includes(d.properties.lau118cd)
      return(
        <path
          className='region'
          key={`path${i}`}
          d={pathGenerator(d)}
          fill={d.properties.lau118cd === this.props.selected ? 'red' : 'salmon'}
          strokeWidth='0.1px'
          stroke='white'
          onClick={x => this.props.changeregion(d.properties.lau118cd)}
        />
      )
    }
    )

    return (
      <div>
        <h3>{this.props.selected ? this.props.codelookup[this.props.selected] : 'England'}</h3>
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
