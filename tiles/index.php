<html>
	<?php
		$chart_id = $_GET['chart_id'];
		include("../php/tile_display.php");
	?>
	<head>
		<title><?php echo($title);?></title>
		<meta charset="utf-8">
		<!-- Leaflet -->
		<script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<!-- GeoJson File -->
		<?php echo($geojson_file); ?>
		<!-- Leaflet CSS -->
		<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
		<!-- Custom Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="../css/leaflet_style.css">
	</head>
	<body>
		<div id="map"></div>
		<div id="infowindow">
			<div id="infoText">
				<h1><?php echo($pretty_collection);?></h1>
				<h2><?php echo($geographic_scope);?></h2>
				<?php echo($pds_link);?>
				<?php echo($hollis_link); ?>
				<?php echo($urn_link); ?>
			</div>
			<label for="slide">Adjust transparency</label>
			<input id="slide" type="range" min="0" max="1" step="0.1" value="0.7" onchange="updateOpacity(this.value)">
		</div>
	<?php echo($tile_layer) ?>
	<script type="text/javascript">
	var map = L.map('map'); /* variables go here */
	var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	var MapQuestOpen_OSM = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpeg', {
		attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: '1234'
	});
	var Stamen_Watercolor = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 1,
		maxZoom: 16
	});
	var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});
	var Esri_NatGeoWorldMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
		maxZoom: 16
	});
	var baseLayers = {
		"Stamen Watercolor": Stamen_Watercolor,
		"OSM Mapnik": OpenStreetMap_Mapnik,
		"MapQuest": MapQuestOpen_OSM,
		"ESRI World Imagery": Esri_WorldImagery,
		"ESRI National Geographic World Map": Esri_NatGeoWorldMap
	};
	var overlays = {
		"36673624": rasterLayer
	};
	$.getJSON($('link[rel="polygon"]').attr("href"), function(data) {
		var boundingBox = L.geoJson(data)
		map.fitBounds(boundingBox.getBounds());
	});
	function updateOpacity(value) {
		rasterLayer.setOpacity(value);
	};
	L.control.layers(baseLayers,overlays).addTo(map);
	Stamen_Watercolor.addTo(map);
	rasterLayer.addTo(map);
	</script>
	</body>
</html>