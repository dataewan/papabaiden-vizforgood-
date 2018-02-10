geo:
	rm data/geo/LAD_wgs84.*
	ogr2ogr \
		-f "ESRI Shapefile" \
		-t_srs "+proj=longlat +ellps=WGS84 +no_defs +towgs84=0,0,0" \
		data/geo/LAD_wgs84.shp \
		data/geo/Local_Administrative_Units_Level_1_January_2018_Ultra_Generalised_Clipped_Boundaries_in_United_Kingdom.shp
	
	shp2json data/geo/LAD_wgs84.shp -o data/geo/uk.json
	ndjson-split 'd.features' \
		< data/geo/uk.json > data/geo/uk.ndjson
	sed s,E07000240,E07000100,g data/geo/uk.ndjson > data/geo/uk-stalbans.ndjson
	sed s,E07000241,E07000104,g data/geo/uk-stalbans.ndjson > data/geo/uk-welwyn.ndjson
	geo2topo -n \
		tracts=data/geo/uk-welwyn.ndjson \
		> data/geo/uk-topo.json
	toposimplify -p 0.0000001 -f \
		< data/geo/uk-topo.json \
		> data/geo/uk-simple.json

copyfiles:
	cp data/geo/uk-simple.json papab-vis/src/uk.json
	cp data/processed/data.json papab-vis/src/data.json
