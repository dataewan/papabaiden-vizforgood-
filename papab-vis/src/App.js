import React, { Component } from 'react';
import * as topojson from 'topojson-client';
import './App.css';

import { filterdata, makecodelookup } from './dataoperations'
import RSMap from './RSMap';
import LondonMap from './LondonMap';

import mapdata from './uk.json';
import data from './data.json';


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedRegion: null
    }

    const { filteredmap, filtereddata } = filterdata(mapdata, data)
    this.codelookup = makecodelookup(filteredmap)
    this.geofeatures = topojson.feature(
      filteredmap, 
      filteredmap.objects.tracts).features
    this.filtereddata = filtereddata;
  }

  changeregion_frommap(e){
    /* change the highlighted region */
    this.setState({
      selectedRegion: e
    })
  }

  render() {
    return (
      <div className="App">
        <div className='containerrow'>
          <div className='map'>
            <RSMap 
              geofeatures={this.geofeatures}
              data={this.filtereddata}
              selected={this.state.selectedRegion}
              changeregion={e => this.changeregion_frommap(e)}
              codelookup={this.codelookup}
            />
            <LondonMap
              geofeatures={this.geofeatures}
              data={this.filtereddata}
              selected={this.state.selectedRegion}
              changeregion={e => this.changeregion_frommap(e)}
              codelookup={this.codelookup}
            />
          </div>
          <div className='demographics'>
            here are my demographics
          </div>
          <div className='timeseries'>
            here are the timeseries
          </div>
        </div>
      </div>
    );
  }
}

export default App;
