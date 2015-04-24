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
	}

	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		// What follows is a big bunch of repetetive code, that I wish I knew how to make shorter
		// What each zoom[0-9]+ does is define a range of extents that it covers, 
		// then turn it into a subset of the larger geojson collection.
		// The style and the onEachFeature function are defined above, and are the same for each.
		// These objects will be used below, where the current zoom level determines what subset 
		// of the geojson set will be displayed.
		// All of the repetetive code was generated by the zoom_level_generator ipython notebook.
		var zoom0 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 180 || feature.properties.lng_extent >= 180;
				var small_enough = feature.properties.lat_extent < 99999999 || feature.properties.lng_extent < 99999999;
				return big_enough && small_enough
			}
		});
		var zoom1 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 180 || feature.properties.lng_extent >= 180;
				var small_enough = feature.properties.lat_extent < 99999999 || feature.properties.lng_extent < 99999999;
				return big_enough && small_enough
			}
		});
		var zoom2 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 135.0 || feature.properties.lng_extent >= 135.0;
				var small_enough = feature.properties.lat_extent < 270.0 || feature.properties.lng_extent < 270.0;
				return big_enough && small_enough
			}
		});
		var zoom3 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 67.5 || feature.properties.lng_extent >= 67.5;
				var small_enough = feature.properties.lat_extent < 135.0 || feature.properties.lng_extent < 135.0;
				return big_enough && small_enough
			}
		});
		var zoom4 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 33.75 || feature.properties.lng_extent >= 33.75;
				var small_enough = feature.properties.lat_extent < 67.5 || feature.properties.lng_extent < 67.5;
				return big_enough && small_enough
			}
		});
		var zoom5 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 16.875 || feature.properties.lng_extent >= 16.875;
				var small_enough = feature.properties.lat_extent < 33.75 || feature.properties.lng_extent < 33.75;
				return big_enough && small_enough
			}
		});
		var zoom6 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 8.4375 || feature.properties.lng_extent >= 8.4375;
				var small_enough = feature.properties.lat_extent < 16.875 || feature.properties.lng_extent < 16.875;
				return big_enough && small_enough
			}
		});
		var zoom7 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 4.21875 || feature.properties.lng_extent >= 4.21875;
				var small_enough = feature.properties.lat_extent < 8.4375 || feature.properties.lng_extent < 8.4375;
				return big_enough && small_enough
			}
		});
		var zoom8 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 2.109375 || feature.properties.lng_extent >= 2.109375;
				var small_enough = feature.properties.lat_extent < 4.21875 || feature.properties.lng_extent < 4.21875;
				return big_enough && small_enough
			}
		});
		var zoom9 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 1.0546875 || feature.properties.lng_extent >= 1.0546875;
				var small_enough = feature.properties.lat_extent < 2.109375 || feature.properties.lng_extent < 2.109375;
				return big_enough && small_enough
			}
		});
		var zoom10 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.52734375 || feature.properties.lng_extent >= 0.52734375;
				var small_enough = feature.properties.lat_extent < 1.0546875 || feature.properties.lng_extent < 1.0546875;
				return big_enough && small_enough
			}
		});
		var zoom11 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.263671875 || feature.properties.lng_extent >= 0.263671875;
				var small_enough = feature.properties.lat_extent < 0.52734375 || feature.properties.lng_extent < 0.52734375;
				return big_enough && small_enough
			}
		});
		var zoom12 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.1318359375 || feature.properties.lng_extent >= 0.1318359375;
				var small_enough = feature.properties.lat_extent < 0.263671875 || feature.properties.lng_extent < 0.263671875;
				return big_enough && small_enough
			}
		});
		var zoom13 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.06591796875 || feature.properties.lng_extent >= 0.06591796875;
				var small_enough = feature.properties.lat_extent < 0.1318359375 || feature.properties.lng_extent < 0.1318359375;
				return big_enough && small_enough
			}
		});
		var zoom14 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.032958984375 || feature.properties.lng_extent >= 0.032958984375;
				var small_enough = feature.properties.lat_extent < 0.06591796875 || feature.properties.lng_extent < 0.06591796875;
				return big_enough && small_enough
			}
		});
		var zoom15 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.0164794921875 || feature.properties.lng_extent >= 0.0164794921875;
				var small_enough = feature.properties.lat_extent < 0.032958984375 || feature.properties.lng_extent < 0.032958984375;
				return big_enough && small_enough
			}
		});
		var zoom16 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.00823974609375 || feature.properties.lng_extent >= 0.00823974609375;
				var small_enough = feature.properties.lat_extent < 0.0164794921875 || feature.properties.lng_extent < 0.0164794921875;
				return big_enough && small_enough
			}
		});
		var zoom17 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.004119873046875 || feature.properties.lng_extent >= 0.004119873046875;
				var small_enough = feature.properties.lat_extent < 0.00823974609375 || feature.properties.lng_extent < 0.00823974609375;
				return big_enough && small_enough
			}
		});
		var zoom18 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.0020599365234375 || feature.properties.lng_extent >= 0.0020599365234375;
				var small_enough = feature.properties.lat_extent < 0.004119873046875 || feature.properties.lng_extent < 0.004119873046875;
				return big_enough && small_enough
			}
		});
		var zoom19 = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: function(feature,layer) {
				var big_enough = feature.properties.lat_extent >= 0.00102996826171875 || feature.properties.lng_extent >= 0.00102996826171875;
				var small_enough = feature.properties.lat_extent < 0.0020599365234375 || feature.properties.lng_extent < 0.0020599365234375;
				return big_enough && small_enough
			}
		});
		// The following repetetive chunks of code determine which geojson layers created above will be displayed.
		// Essentially, each layer will be displayed on the corresponding zoom level.
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 0 ){ map.removeLayer( zoom0 )}
			else if ( map.getZoom() == 0 ){ map.addLayer( zoom0 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 1 ){ map.removeLayer( zoom1 )}
			else if ( map.getZoom() == 1 ){ map.addLayer( zoom1 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 2 ){ map.removeLayer( zoom2 )}
			else if ( map.getZoom() == 2 ){ map.addLayer( zoom2 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 3 ){ map.removeLayer( zoom3 )}
			else if ( map.getZoom() == 3 ){ map.addLayer( zoom3 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 4 ){ map.removeLayer( zoom4 )}
			else if ( map.getZoom() == 4 ){ map.addLayer( zoom4 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 5 ){ map.removeLayer( zoom5 )}
			else if ( map.getZoom() == 5 ){ map.addLayer( zoom5 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 6 ){ map.removeLayer( zoom6 )}
			else if ( map.getZoom() == 6 ){ map.addLayer( zoom6 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 7 ){ map.removeLayer( zoom7 )}
			else if ( map.getZoom() == 7 ){ map.addLayer( zoom7 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 8 ){ map.removeLayer( zoom8 )}
			else if ( map.getZoom() == 8 ){ map.addLayer( zoom8 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 9 ){ map.removeLayer( zoom9 )}
			else if ( map.getZoom() == 9 ){ map.addLayer( zoom9 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 10 ){ map.removeLayer( zoom10 )}
			else if ( map.getZoom() == 10 ){ map.addLayer( zoom10 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 11 ){ map.removeLayer( zoom11 )}
			else if ( map.getZoom() == 11 ){ map.addLayer( zoom11 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 12 ){ map.removeLayer( zoom12 )}
			else if ( map.getZoom() == 12 ){ map.addLayer( zoom12 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 13 ){ map.removeLayer( zoom13 )}
			else if ( map.getZoom() == 13 ){ map.addLayer( zoom13 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 14 ){ map.removeLayer( zoom14 )}
			else if ( map.getZoom() == 14 ){ map.addLayer( zoom14 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 15 ){ map.removeLayer( zoom15 )}
			else if ( map.getZoom() == 15 ){ map.addLayer( zoom15 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 16 ){ map.removeLayer( zoom16 )}
			else if ( map.getZoom() == 16 ){ map.addLayer( zoom16 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 17 ){ map.removeLayer( zoom17 )}
			else if ( map.getZoom() == 17 ){ map.addLayer( zoom17 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 18 ){ map.removeLayer( zoom18 )}
			else if ( map.getZoom() == 18 ){ map.addLayer( zoom18 )}
		});
		map.on('zoomend ', function(e) {
			if ( map.getZoom() != 19 ){ map.removeLayer( zoom19 )}
			else if ( map.getZoom() == 19 ){ map.addLayer( zoom19 )}
		});
		var sidebar = L.control.sidebar('sidebar').addTo(map);
		OpenStreetMap_Mapnik.addTo(map);
		zoom1.addTo(map);
	});
	</script>
	</body>
</html>