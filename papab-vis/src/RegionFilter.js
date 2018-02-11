import React from 'react';

class RegionFilter extends React.Component {
  render() {
    const { selected, clearregion, codelookup } = this.props
    const clearbutton = selected ? <button onClick={clearregion}>X</button> : null
    return (
      <div>
        <div className='regionfilter'>{clearbutton} {codelookup[selected]}</div>
      </div>
    );
  }
}

export default RegionFilter
