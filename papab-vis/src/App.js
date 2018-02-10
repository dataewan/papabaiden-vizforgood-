import React, { Component } from 'react';
import * as topojson from 'topojson-client';
import './App.css';

import { filterdata } from './dataoperations'
import RSMap from './RSMap';
import LondonMap from './LondonMap';

import mapdata from './uk.json';
import data from './data.json';


class App extends Component {
  constructor(props){
    super(props)
    const { filteredmap, filtereddata } = filterdata(mapdata, data)
    this.geofeatures = topojson.feature(
      filteredmap, 
      filteredmap.objects.tracts).features
    this.filtereddata = filtereddata;
  }
  render() {
    return (
      <div className="App">
        <RSMap 
          geofeatures={this.geofeatures}
          data={this.filtereddata}
        />
        <LondonMap
          geofeatures={this.geofeatures}
          data={this.filtereddata}
        />
      </div>
    );
  }
}

export default App;
