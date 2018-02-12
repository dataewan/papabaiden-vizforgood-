import React, { Component } from 'react';
import * as topojson from 'topojson-client';
import './App.css';

import { filterdata, makecodelookup } from './dataoperations'
import { createScale } from './plotoperations'
import Story from './Story';
import RSMap from './RSMap';
import LondonMap from './LondonMap';
import Demographic from './Demographic';
import DemographicTable from './DemographicTable'
import RegionFilter from './RegionFilter';
import Timeseries from './Timeseries';
import VacantTimeseries from './VacantTimeseries';

import mapdata from './uk.json';
import data from './data.json';


class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      selectedRegion: null,
      selectedVariable: 'Totalroughsleepercountestimate',
      highlightTS: false,
      highlightRSTS: false,
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

  highlightTS(value){
    console.log(value)
    this.setState({
      highlightTS: value
    })
  }

  highlightRSTS(value){
    this.setState({
      highlightRSTS: value
    })
  }

  render() {
    const scale = createScale(this.filtereddata, this.state.selectedVariable)
    return (
      <div className="App">
        <div className='containerrow'>
          <div className='story'>
            <Story
              changeregion={e => this.changeregion_frommap(e)}
              change={e => this.changevariable(e)}
              highlightTS={e => this.highlightTS(e)}
              highlightRSTS={e => this.highlightRSTS(e)}
            />

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
              highlight={this.state.highlightTS}
            />
            <VacantTimeseries
              data={this.filtereddata} 
              selected={this.state.selectedRegion} 
              highlight={this.state.highlightRSTS}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
