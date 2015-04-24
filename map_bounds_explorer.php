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
		<div id="sidebar" class="sidebar">
			<ul class="sidebar-tabs" role="tablist">
				<li id="homeTab" class="active"><a href="#home" role="tab"><i class="fa fa-list"></i></a></li>
				<li id="filterTab"><a href="#filter" role="tab"><i class="fa fa-filter"></i></a></li>
			</ul>
			<div class="sidebar-content active">
				<div id="home" class="sidebar-pane active">
					<h1>Here are our things!</h1>
					<p>The following list uses PHP!</p>
					<ul>
						<?php include("php/chart_lists.php") ?>
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

	var defaultStyle = {
		"color": "#B80407",
		"opacity": 0.5,
		"weight": 3,
		"fillOpacity": 0.1
	};

	var hoverStyle = {
		"color": "#2ca25f",
		"opacity": 0.5,
		"weight": 3,
		"fillOpacity": 0.1
	};

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle(hoverStyle);

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}

	function resetHighlight(e) {
		var layer = e.target;
		layer.setStyle(defaultStyle);
	}

	function onEachFeature(feature,layer) {
		// defining popup content for polygons. 
		// Will eventually switch to sidebar, this is just easier
		popupContent = "";
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
		layer.bindPopup(popupContent);
		// changing styling based on mouseover events
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		});
		layer._polygonId = feature.properties.fname.substring(0,8);
		console.log(layer._polygonId);
	}

	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		var deg_min = 180;
		var dispBoxes = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= deg_min || feature.properties.lng_extent >= deg_min;
				return big_enough
			}
		});
		map.on('zoomend', function(e) {
			map.removeLayer(dispBoxes);
			var z = map.getZoom();
			if (z!=0 && z!=1) {
				var base = 360/Math.pow(2,z);
				var deg_min = base-base/4;
				var deg_max = base+base/2;
				dispBoxes = L.geoJson(data, {
					style: defaultStyle,
					onEachFeature: onEachFeature,
					filter: function(feature,layer) {
						var big_enough = feature.properties.lat_extent >= deg_min || feature.properties.lng_extent >= deg_min;
						var small_enough = feature.properties.lat_extent < deg_max || feature.properties.lng_extent < deg_max;
						return big_enough && small_enough
					}
				});
			} else {
				var deg_min = 180;
				dispBoxes = L.geoJson(data, {
					style: defaultStyle,
					onEachFeature: onEachFeature,
					filter: function(feature,layer) {
						var big_enough = feature.properties.lat_extent >= deg_min || feature.properties.lng_extent >= deg_min;
						return big_enough
					}
				});
			};
			dispBoxes.addTo(map)
		})
		var sidebar = L.control.sidebar('sidebar').addTo(map);
		OpenStreetMap_Mapnik.addTo(map);
		dispBoxes.addTo(map);
		$(".idLink").on("click",function() {
			var searchId=$(this).text()
			console.log("I clicked "+searchId)
			dispBoxes.eachLayer(function(layer) {
				if (layer._polygonId==searchId) {
					layer.setStyle(hoverStyle);
				} else {
					layer.setStyle(defaultStyle);
				};
			})
		})
	});
	</script>
	</body>
</html>