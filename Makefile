geo:
	ogr2ogr \
		-f "ESRI Shapefile" \
		-t_srs "+proj=longlat +ellps=WGS84 +no_defs +towgs84=0,0,0" \
		data/geo/LAD_wgs84.shp \
		data/geo/Local_Administrative_Units_Level_1_January_2018_Ultra_Generalised_Clipped_Boundaries_in_United_Kingdom.shp
	
	shp2json data/geo/LAD_wgs84.shp -o data/geo/uk.json
	ndjson-split 'd.features' \
		< data/geo/uk.json > data/geo/uk.ndjson
	geo2topo -n \
		tracts=data/geo/uk.ndjson \
		> data/geo/uk-topo.json
	toposimplify -p 0.0005 -f \
		< data/geo/uk-topo.json \
		> data/geo/uk-simple.json
