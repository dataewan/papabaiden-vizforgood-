import React, { Component } from 'react';
import * as topojson from 'topojson-client';
import './App.css';

import { filterdata, makecodelookup } from './dataoperations'
import { createScale } from './plotoperations'
import RSMap from './RSMap';
import LondonMap from './LondonMap';
import Demographic from './Demographic';
import DemographicTable from './DemographicTable'
import RegionFilter from './RegionFilter';
import Timeseries from './Timeseries';

import mapdata from './uk.json';
import data from './data.json';


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedRegion: null,
      selectedVariable: 'RSRate',
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

  changevariable(e){
    this.setState({
      selectedVariable: e
    })
  }

  render() {
    const scale = createScale(this.filtereddata, this.state.selectedVariable)
    return (
      <div className="App">
        <div className='containerrow'>
          <div className='story'>
            here is the story
          </div>
          <div className='map'>
            <RegionFilter
              selected={this.state.selectedRegion}
              clearregion={e => this.changeregion_frommap(null)}
              codelookup={this.codelookup}
            />
            <RSMap 
              geofeatures={this.geofeatures}
              data={this.filtereddata}
              selected={this.state.selectedRegion}
              changeregion={e => this.changeregion_frommap(e)}
              codelookup={this.codelookup}
              selectedVariable={this.state.selectedVariable}
              scale={scale}
            />
            <LondonMap
              geofeatures={this.geofeatures}
              data={this.filtereddata}
              selected={this.state.selectedRegion}
              changeregion={e => this.changeregion_frommap(e)}
              codelookup={this.codelookup}
              selectedVariable={this.state.selectedVariable}
              scale={scale}
            />
          </div>
          <div className='demographics'>
            <Demographic 
              variable={'RSRate'} 
              selected={this.state.selectedRegion} 
              data={this.filtereddata} 
              change={e => this.changevariable(e)}
              selectedVariable={this.state.selectedVariable}
            />
            <Demographic 
              variable={'Totalroughsleepercountestimate'} 
              selected={this.state.selectedRegion} 
              data={this.filtereddata} 
              change={e => this.changevariable(e)}
              selectedVariable={this.state.selectedVariable}
            />
            <Demographic 
              variable={'Under25yearsold'} 
              selected={this.state.selectedRegion} 
              data={this.filtereddata} 
              change={e => this.changevariable(e)}
              selectedVariable={this.state.selectedVariable}
            />
            <Demographic 
              variable={'Female'} 
              selected={this.state.selectedRegion} 
              data={this.filtereddata} 
              change={e => this.changevariable(e)}
              selectedVariable={this.state.selectedVariable}
            />
            <DemographicTable
              selected={this.state.selectedRegion} 
              data={this.filtereddata} 
              selectedVariable={this.state.selectedVariable}
              codelookup={this.codelookup}
              change={e => this.changeregion_frommap(e)}
            />
          </div>
          <div className='timeseries'>
            <Timeseries
              data={this.filtereddata} 
              selected={this.state.selectedRegion} 
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
