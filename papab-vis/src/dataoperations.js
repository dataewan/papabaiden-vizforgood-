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
  return {
    filteredmap: mapdata,
    filtereddata: data
  }
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
