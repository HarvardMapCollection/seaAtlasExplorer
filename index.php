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
		<!-- collapsible jquery css -->
		<link rel="stylesheet" type="text/css" href="css/collapse.css">
		<!-- Custom Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/leaflet_style.css">

		<!-- Javascript -->
		<!-- Leaflet -->
		<script type="text/javascript" src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<!-- jQuery collapsible lists -->
		<script type="text/javascript" src="js/jquery.collapsible.js"></script>

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
					<div id="currentViewContent" class="collapsible collapse-container">
						<h2 id="blaeuCurrentHeading"><span class="arrow-r"></span>Blaeu <span id="blaeuCounter"></span></h2>
						<div id="blaeuCurrentContent"></div>
						<h2 id="colomCurrentHeading"><span class="arrow-r"></span>Colom <span id="colomCounter"></span></h2>
						<div id="colomCurrentContent"></div>
						<h2 id="dewitCurrentHeading"><span class="arrow-r"></span>DeWit <span id="dewitCounter"></span></h2>
						<div id="dewitCurrentContent"></div>
						<h2 id="dudleyV1CurrentHeading"><span class="arrow-r"></span>Dudley Vol. 1 <span id="dudleyV1Counter"></span></h2>
						<div id="dudleyV1CurrentContent"></div>
						<h2 id="dudleyV3CurrentHeading"><span class="arrow-r"></span>Dudley Vol. 3 <span id="dudleyV3Counter"></span></h2>
						<div id="dudleyV3CurrentContent"></div>
						<h2 id="goosCurrentHeading"><span class="arrow-r"></span>Goos <span id="goosCounter"></span></h2>
						<div id="goosCurrentContent"></div>
						<h2 id="keulenV1CurrentHeading"><span class="arrow-r"></span>Keulen Vol. 1 <span id="keulenV1Counter"></span></h2>
						<div id="keulenV1CurrentContent"></div>
						<h2 id="keulenV2CurrentHeading"><span class="arrow-r"></span>Keulen Vol. 2 <span id="keulenV2Counter"></span></h2>
						<div id="keulenV2CurrentContent"></div>
						<h2 id="renardCurrentHeading"><span class="arrow-r"></span>Renard <span id="renardCounter"></span></h2>
						<div id="renardCurrentContent"></div>
						<h2 id="waghenaerCurrentHeading"><span class="arrow-r"></span>Waghenaer <span id="waghenaerCounter"></span></h2>
						<div id="waghenaerCurrentContent"></div>
					</div>
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
	var collectionList = ["blaeu","colom","dewit","dudleyV1","dudleyV3","goos","keulenV1","keulenV2","renard","waghenaer"]

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
		"Open Street Map": OpenStreetMap_Mapnik,
		"Stamen Watercolor": Stamen_Watercolor,
		"ESRI World Imagery": Esri_WorldImagery,
		"National Geographic World Map": Esri_NatGeoWorldMap
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
		// highlight sidebar text for highlighted feature
		$(".idLink").removeClass("highlight");
		$("."+layer._polygonId).addClass("highlight");
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
		layer.collection = feature.properties.collection;
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
			if (map.getBounds().contains(layer.getBounds())) {
				toAdd = "<h3>"
				$("#"+layer.collection+"CurrentContent").append("<p><a href=\"#\" class=\""+layer._polygonId+" idLink\">"+layer.geographic_scope+"</a></p>")
			};
		}

		function add_counter(){
			for (var i = collectionList.length - 1; i >= 0; i--) {
				var len = $("#"+collectionList[i]+"CurrentContent").children().length
				$("#"+collectionList[i]+"Counter").text("("+len+" charts)")
			};
		}

		// On zoom end, recalculates which features to display using same method as before.
		map.on('zoomend', function(e) {
			$("#currentViewContent div").empty()
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
			allBoxes.eachLayer(add_to_currentViewContent);
			add_counter()
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
			$("#currentViewContent div").empty();
			//$("#currentViewContent").append("<ul>")
			allBoxes.eachLayer(add_to_currentViewContent);
			add_counter()
		});

		// Adds details and counter to initial view
		allBoxes.eachLayer(add_to_currentViewContent);
		add_counter()

		// Adds sidebar as a control
		var sidebar = L.control.sidebar('sidebar').addTo(map);
		
		// Adds initial base layer
		OpenStreetMap_Mapnik.addTo(map);

		// Adds initial polygon layer, defined earlier based on initial zoom level
		dispBoxes.addTo(map);
	});

	// collapsible lists
	$(".collapsible").collapsible();
	</script>
	</body>
</html>