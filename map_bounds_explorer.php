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
				<li id="homeTab"><a href="#home" role="tab"><i class="fa fa-list"></i></a></li>
				<li id="filterTab"><a href="#filter" role="tab"><i class="fa fa-filter"></i></a></li>
			</ul>
			<div class="sidebar-content">
				<div id="home" class="sidebar-pane">
					<h1>Here are our things!</h1>
					<p>The following list uses PHP!</p>
					<ul>
						<?php include("php/chart_lists.php"); ?>
					</ul>
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
			</div>
		</div>
		<div id="map" class="sidebar-map"></div>
		<!-- Leaflet Sidebar -->
		<script type="text/javascript" src="js/leaflet-sidebar.js"></script>
	<script type="text/javascript">
	var map = L.map('map').setView([0, 0], 1);

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

	L.control.layers(baseMaps).addTo(map);

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
		var layer = e.target;
		layer.setStyle(defaultStyle);
	}

	function onEachFeature(feature,layer) {
		// defining popup content for polygons. 
		// Will eventually switch to sidebar, this is just easier
		/*popupContent = "";
		if (feature.properties && feature.properties.fname) {
			popupContent += "<p>" + feature.properties.fname + "</p>";
		}
		if (feature.properties && feature.properties.collection) {
			popupContent += "<p>" + feature.properties.collection + "</p>";
		}
		if (feature.properties && feature.properties.lat_extent) {
			popupContent += "<p>" + feature.properties.lat_extent + "</p>";
		}
		if (feature.properties && feature.properties.lng_extent) {
			popupContent += "<p>" + feature.properties.lng_extent + "</p>";
		}
		layer.bindPopup(popupContent);*/
		// changing styling based on mouseover events
		layer.on({
			click: highlightFeature
		});
		layer._polygonId = feature.properties.UNIQUE_ID;
	}

	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		var z = map.getZoom()
		dispBoxes = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				return z==map.getBoundsZoom(L.geoJson(feature).getBounds())
			}
		});
		map.on('zoomend', function(e) {
			map.removeLayer(dispBoxes);
			var z = map.getZoom();
			dispBoxes = L.geoJson(data, {
				style: defaultStyle,
				onEachFeature: onEachFeature,
				filter: function(feature,layer) {
					return z==map.getBoundsZoom(L.geoJson(feature).getBounds())
				}
			});
			dispBoxes.addTo(map)
		})
		var allBoxes = L.geoJson(data, {onEachFeature: onEachFeature})
		var sidebar = L.control.sidebar('sidebar').addTo(map);
		OpenStreetMap_Mapnik.addTo(map);
		dispBoxes.addTo(map);
		$(".idLink").on("click",function() {
			var searchId=$(this).attr("id")
			allBoxes.eachLayer(function(layer) {
				if(layer._polygonId==searchId) {
					map.fitBounds(layer.getBounds());
				}
			});
			dispBoxes.eachLayer(function(layer) {
				if (layer._polygonId==searchId) {
					layer.setStyle(hoverStyle);
				} else {
					layer.setStyle(defaultStyle);
				};
			});
		})
	});
	</script>
	</body>
</html>