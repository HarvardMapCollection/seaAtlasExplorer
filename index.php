<html>
	<head>
		<title>Sea Atlas Explorer</title>
		<meta charset="utf-8">

		<!-- Stylesheets -->
		<!-- Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
		<!-- Leaflet Sidebar Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/leaflet-sidebar.css">
		<!-- Leaflet Awesome Markers -->
		<link rel="stylesheet" type="text/css" href="css/leaflet.awesome-markers.css">
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
		<!-- Leaflet Awesome Markers -->
		<script type="text/javascript" src="js/leaflet.awesome-markers.js"></script>
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<!-- jQuery collapsible lists -->
		<script type="text/javascript" src="js/jquery.collapsible.js"></script>
		<!-- jQuery CSV module -->
		<script type="text/javascript" src="js/jquery.csv-0.71.js"></script>
		<!-- bbox mapping script -->
		<script type="text/javascript" src="js/atlas_map_2.js"></script>

		<!-- GeoJSON Data -->
		<link rel="polygons" type="application/json" href="geoJson/all_atlases.geojson">

	</head>
	<body>
		<div id="sidebar" class="sidebar" style="background-image:url(bg-test.png)">
			<ul class="sidebar-tabs" role="tablist">
				<li id="bigListTab" class="active"><a href="#bigList" role="tab"><i class="fa fa-list" title="List of all sea charts available for display"></i></a></li>
				<li id="currentViewTab"><a href="#currentView" role="tab"><i class="fa fa-compass" title="List of sea charts in current view"></i></a></li>
				<li id="selectionsTab"><a href="#selections"><i class="fa fa-star" title="List of charts that you've added to the current view"></i></a></li>
			</ul>
			<div class="sidebar-content">
				<div id="bigList" class="sidebar-pane active">
					<?php include("php/big_list_headers.php"); ?>
				</div>
				<div id="currentView" class="sidebar-pane">
					<?php include("php/current_view_headers.php"); ?>
				</div>
				<div id="selections" class="sidebar-pane">
					<p>This is where stuff that's been added to the map will go.</p>
				</div>
			</div>
		</div>
		<div id="map" class="sidebar-map"></div>
		<div id="infobox">
			<div id="hoverInfobox" style="display:none;"></div>
			<div id="highlightInfobox" style="display:none;"></div>
			<div id="chartCount"></div>
		</div>
		<div id="breadcrumb-wrapper">
			<div id="breadcrumb" class="container">
				<a href="http://hcl.harvard.edu/maps/">Harvard Map Collection</a> 
				&nbsp;»&nbsp;
				<a href="http://sea-atlases.org/front.php">Sea Atlases</a> 
				&nbsp;»&nbsp;
				Sea Atlas Explorer
			</div>
		</div>
	<script type="text/javascript">
	var toggle = function(source) {
		checkboxes = document.getElementsByClassName('filterControl');
		for(var i=0, n=checkboxes.length;i<n;i++) {
			checkboxes[i].checked = source.checked;
		};
	};
	
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
	<!-- Google Analytics -->
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-63066162-1', 'auto');
		ga('send', 'pageview');
	</script>
	</body>
</html>