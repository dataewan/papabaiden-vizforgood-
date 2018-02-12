import * as _ from 'lodash';

const filterdata = (mapdata, data) => {
  console.log('filtering')
  const codes = data.map(d => d.code)
  const geometries = mapdata.objects.tracts.geometries
  const filteredgeometries = _.filter(
    geometries,
    d => (_.includes(codes, d.properties.lau118cd))
  )
  const filteredmapdata = _.assign(
    mapdata.objects.tracts,
    {
      geometries: filteredgeometries
    }
  );
  const transformeddata = transform(data);

  return {
    filteredmap: mapdata,
    filtereddata: transformeddata
  }
}

const transform = (data) => {
  /* perform calculations on top of the data to make new fields */
  return _.map(
    data,
    d => {
      d.data.demographics.RSRate = d.data.demographics.Totalroughsleepercountestimate / d.data.demographics.numhouseholds * 1000;
      return d
    }
  )
}


const makecodelookup = (mapdata) => {
  window.mapdata = mapdata;
  const codes = _.map(mapdata.objects.tracts.geometries, d => d.properties.lau118cd)
  const names = _.map(mapdata.objects.tracts.geometries, d => d.properties.lau118nm)
  return _.zipObject(codes, names)
}

export {
  filterdata,
  makecodelookup
}
