<html>
	<head>
		<title>Sea Atlas Explorer</title>
		<meta charset="utf-8">

		<!-- Stylesheets -->
		<!-- Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
		<!-- Leaflet Sidebar Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/leaflet-sidebar.css">
		<!-- FontAwesome -->
		<link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
		<!-- collapsible jquery css -->
		<link rel="stylesheet" type="text/css" href="css/collapse.css">
		<!-- Custom Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/leaflet_style.css">

		<!-- Javascript -->
		<!-- Leaflet -->
		<script type="text/javascript" src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
		<!-- Leaflet Sidebar -->
		<script type="text/javascript" src="js/leaflet-sidebar.js"></script>
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<!-- jQuery collapsible lists -->
		<script type="text/javascript" src="js/jquery.collapsible.js"></script>
		<!-- jQuery CSV module -->
		<script type="text/javascript" src="js/jquery.csv-0.71.js"></script>
		<!-- bbox mapping script -->
		<script type="text/javascript" src="js/atlas_map.js"></script>

		<!-- GeoJSON Data -->
		<link rel="polygons" type="application/json" href="geoJson/all_atlases.geojson">

	</head>
	<body>
		<div id="sidebar" class="sidebar" style="background-image:url(bg-test.png)">
			<ul class="sidebar-tabs" role="tablist">
				<li id="currentViewTab" class="active"><a href="#currentView" role="tab"><i class="fa fa-compass"></i></a></li>
				<li id="bigListTab"><a href="#bigList" role="tab"><i class="fa fa-list"></i></a></li>
			</ul>
			<div class="sidebar-content">
				<div id="currentView" class="sidebar-pane active">
					<h1>In current view:</h1>
					<div>
						<input type="checkbox" id="allAtlasesCheckbox" class="filterControl" style="margin:0;" onclick="toggle(this)">
						<label for="allAtlasesCheckbox">Select All Atlases</label>
					</div>
					<?php include("php/header_lists.php"); ?>
				</div>
				<div id="bigList" class="sidebar-pane">
					<h1>The Entire Collection</h1>
					<p>The following is a complete list of our collection of Sea Atlases.</p>
					<?php include("php/chart_lists.php"); ?>
				</div>
			</div>
		</div>
		<div id="map" class="sidebar-map"></div>
	<script type="text/javascript">
	// Map creation
	var map = L.map('map').setView([0, 0], 1);

	// Adding tile layers
	var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});
	var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 1,
		maxZoom: 16,
		ext: 'png'
	});
	var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});
	var Esri_NatGeoWorldMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
		maxZoom: 16
	});
	var baseMaps = {
		"Stamen Watercolor": Stamen_Watercolor,
		"Open Street Map": OpenStreetMap_Mapnik,
		"ESRI World Imagery": Esri_WorldImagery,
		"National Geographic World Map": Esri_NatGeoWorldMap
	}
	var overlayMaps = {};
	// Adding tile layer control
	controlLayers = L.control.layers(baseMaps,overlayMaps)
	controlLayers.addTo(map);
	// End of tile layer definitions

	// Adds sidebar as a control
	var sidebar = L.control.sidebar('sidebar').addTo(map);
	
	// Adds initial base layer
	Stamen_Watercolor.addTo(map);

	geojson_bbox("php/atlas_metadata.csv")

	// collapsible lists
	$(".collapsible").collapsible();
	$(".bigListCollapsible").collapsible();
	</script>
	</body>
</html>