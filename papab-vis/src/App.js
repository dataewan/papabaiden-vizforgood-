import React, { Component } from 'react';
import * as topojson from 'topojson-client';
import './App.css';

import RSMap from './RSMap';

import mapdata from './uk.json';
import data from './data.json';

class App extends Component {
  constructor(props){
    super(props)
    this.geofeatures = topojson.feature(
      mapdata, 
      mapdata.objects.tracts).features
    window.codes = data.map(d => d.code)
    window.geocodes = this.geofeatures.map(d => d.properties.lau118cd)
  }
  render() {
    return (
      <div className="App">
        <RSMap 
          geofeatures={this.geofeatures}
          data={data}
        />
      </div>
    );
  }
}

export default App;
