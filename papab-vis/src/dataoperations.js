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

export {
  filterdata
}
