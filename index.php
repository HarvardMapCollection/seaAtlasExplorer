<html>
	<head>
		<title>Leaflet Base</title>
		<meta charset="utf-8">

		<!-- Stylesheets -->
		<!-- Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
		<!-- Leaflet Sidebar Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/leaflet-sidebar.css">
		<!-- FontAwesome -->
		<link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
		<!-- Custom Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/leaflet_style.css">

		<!-- Javascript -->
		<!-- Leaflet -->
		<script type="text/javascript" src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>

		<!-- GeoJSON Data -->
		<link rel="polygons" type="application/json" href="geoJson/all_atlases.geojson">

	</head>
	<body>
		<div id="sidebar" class="sidebar collapsed">
			<ul class="sidebar-tabs" role="tablist">
				<li id="currentViewTab"><a href="#currentView" role="tab"><i class="fa fa-compass"></i></a></li>
				<li id="filterTab"><a href="#filter" role="tab"><i class="fa fa-filter"></i></a></li>
				<li id="bigListTab"><a href="#bigList" role="tab"><i class="fa fa-list"></i></a></li>
			</ul>
			<div class="sidebar-content">
				<div id="currentView" class="sidebar-pane">
					<h1>Here's what you're looking at now:</h1>
					<div id="currentViewContent"></div>
				</div>
				<div id="filter" class="sidebar-pane">
					<h1>Filters</h1>
					<p>These should be checkboxes probably!</p>
					<p>
						<input id="what" type="checkbox" value="what"/>
						<label for="what">What?</label>
					</p>
					<p>
						<input id="okay" type="checkbox" value="okay"/>
						<label for="okay">okay</label>
					</p>
				</div>
				<div id="bigList" class="sidebar-pane">
					<h1>Here are our things!</h1>
					<p>The following list uses PHP!</p>
					<ul>
						<?php include("php/chart_lists.php"); ?>
					</ul>
				</div>
			</div>
		</div>
		<div id="map" class="sidebar-map"></div>
		<!-- Leaflet Sidebar -->
		<script type="text/javascript" src="js/leaflet-sidebar.js"></script>
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
	var NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('http://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
		attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
		bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
		minZoom: 1,
		maxZoom: 8,
		format: 'jpg',
		time: '',
		tilematrixset: 'GoogleMapsCompatible_Level'
	});
	var baseMaps = {
		"Open Street Map": OpenStreetMap_Mapnik,
		"Stamen Watercolor": Stamen_Watercolor,
		"ESRI World Imagery": Esri_WorldImagery,
		"National Geographic World Map": Esri_NatGeoWorldMap,
		"NASA Earth at Night": NASAGIBS_ViirsEarthAtNight2012
	}
	// Adding tile layer control
	L.control.layers(baseMaps).addTo(map);

	// Style definitions
	var defaultStyle = {
		"color": "#B80407",
		"opacity": 0.5,
		"weight": 3,
		"fillOpacity": 0.1
	};
	var hoverStyle = {
		"color": "#E1ED00",
		"opacity": 0.8,
		"weight": 3,
		"fillOpacity": 0.4
	};

	function highlightFeature(e) {
		// Adds highlight styling, moves feature to back.
		var layer = e.target;

		dispBoxes.eachLayer(function(layer) {
			layer.setStyle(defaultStyle);
		});

		layer.setStyle(hoverStyle);
		map.fitBounds(layer.getBounds());

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToBack();
		}
	}

	function resetHighlight(e) {
		// Resets highlighting
		var layer = e.target;
		layer.setStyle(defaultStyle);
	}

	function onEachFeature(feature,layer) {
		// Assigning polygon IDs based on UNIQUE_ID in feature
		layer._polygonId = feature.properties.UNIQUE_ID;
		// Assigning metadata
		layer.geographic_scope = feature.properties.geographic_scope;
		// changing styling based on mouseover events
		layer.on({
			click: highlightFeature
		});
	}

	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		// Defines a variable containing all geoJSON features
		// This will be used for zooming to polygons that are not currently displayed
		var allBoxes = L.geoJson(data, {onEachFeature: onEachFeature})

		// Getting subset of geoJSON to display based on current zoom level
		var z = map.getZoom()
		dispBoxes = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				// This line determines display based on zoom level
				// Gets the appropriate zoom level for the feature and compares it to current zoom level
				return z==map.getBoundsZoom(L.geoJson(feature).getBounds())
			}
		});

		// Function for contents of currentViewContent, to be added on zoomend and dragend.
		function add_to_currentViewContent(layer) {
			if (map.getBounds().contains(layer.getBounds()) || map.getBounds().intersects(layer.getBounds())) {
				$("#currentViewContent").append("<li><a href=\"#\" class=\""+layer._polygonId+" idLink\">"+layer.geographic_scope+"</a></li>")
			};
		}

		// On zoom end, recalculates which features to display using same method as before.
		map.on('zoomend', function(e) {
			$("#currentViewContent").empty()
			map.removeLayer(dispBoxes);
			var z = map.getZoom();
			dispBoxes = L.geoJson(data, {
				style: defaultStyle,
				onEachFeature: onEachFeature,
				filter: function(feature,layer) {
					// This line determines display based on zoom level
					// Gets the appropriate zoom level for the feature and compares it to current zoom level
					return z==map.getBoundsZoom(L.geoJson(feature).getBounds())
				}
			});
			dispBoxes.addTo(map)
			$("#currentViewContent").append("<ul>")
			allBoxes.eachLayer(add_to_currentViewContent);
			$("#currentViewContent").append("</ul>")
		});

		// jQuery, on ID link click, map will zoom to polygon with corresponding ID
		// Corresponding ID should also be highlighted
		$(document).on("click", ".idLink", function() {
			var search_UID = $(this).attr("class").split(" ");
			search_UID.pop("idLink");
			console.log(search_UID);
			allBoxes.eachLayer(function(layer) {
				if(layer._polygonId==search_UID) {
					map.fitBounds(layer.getBounds());
				}
			});
			dispBoxes.eachLayer(function(layer) {
				if (layer._polygonId==search_UID) {
					layer.setStyle(hoverStyle);
				} else {
					layer.setStyle(defaultStyle);
				};
			});
		});

		// As a drag finishes, figure out what to put in sidebar
		map.on('dragend', function(e) {
			$("#currentViewContent").empty();
			$("#currentViewContent").append("<ul>")
			allBoxes.eachLayer(add_to_currentViewContent);
			$("#currentViewContent").append("</ul>")
		});

		// Adds sidebar as a control
		var sidebar = L.control.sidebar('sidebar').addTo(map);
		
		// Adds initial base layer
		OpenStreetMap_Mapnik.addTo(map);

		// Adds initial polygon layer, defined earlier based on initial zoom level
		dispBoxes.addTo(map);
	});
	</script>
	</body>
</html>