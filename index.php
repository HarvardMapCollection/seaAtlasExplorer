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
				<li id="bigListTab"><a href="#bigList" role="tab"><i class="fa fa-list" title="List of all sea charts available for display"></i><span class="tabDescription">Comprehensive List</span></a></li>
				<li id="currentViewTab" class="active"><a href="#currentView" role="tab"><i class="fa fa-compass" title="List of sea charts in current view"></i><span class="tabDescription">Map Based List</span></a></li>
				<li id="selectionsTab"><a href="#selections"><i class="fa fa-star" title="List of charts that you've added to the current view"></i><span class="tabDescription">Charts Displayed</span></a></li>
				<li id="helpTab"><a href="#help"><i class="fa fa-question" title="Help with using this interface"></i><span class="tabDescription">How to use this</span></a></li>
			</ul>
			<div class="sidebar-content">
				<div id="bigList" class="sidebar-pane">
					<?php include("php/big_list_headers.php"); ?>
				</div>
				<div id="currentView" class="sidebar-pane active">
					<?php include("php/current_view_headers.php"); ?>
				</div>
				<div id="selections" class="sidebar-pane">
					<h1>Charts Displayed</h1>
					<p>If you include a georeferenced chart in the current view, it will appear here.</p>
				</div>
				<div id="help" class="sidebar-pane">
					<h1>How to use this site</h1>
					<p>There's a lot that you can do with these charts, so here's a rundown of what everything means, and how to use all of the features of this exhibition</p>
					<h3>The Basics</h3>
					<p><strong>If you just want to explore the collection</strong>, use the map to the left. As you zoom in to different locations, icons representing charts at similar scales will appear. You can hover over these icons to see the extent of the charts they represent, or click on them to highlight them.</p>
					<p><strong>If you want to find a specific chart</strong>, use this sidebar. The <i class="fa fa-list" title="list icon"></i> Comprehensive List tab will show a static list of all available charts. The <i class="fa fa-compass"></i> Map Based List tab displays a dynamic list of charts. It includes every chart inside the current map view, even the ones that are too small to currently have icons displayed. If you move the map to an area you're interested in, you can use this list to discover charts in that area.</p>
					<h3>Icons</h3>
					<p>Here are some of the icons we're using and what they indicate:</p>
					<p><i class="fa fa-arrows-alt"></i>: Interface icon. Click this icon to zoom to the extent of the corresponding chart. The chart area will be highlighted on the map as you hover, although it may be very small in the current view.</p>
					<p><i class="fa fa-anchor"></i>: Interface icon. This is the icon that represents a single chart on the map. When you hover over it, it will show the extent of the chart it represents. When you click on it, it will highlight the given chart, pinning its info to the bottom right of the screen.</p>
					<p><i class="fa fa-list"></i>: Menu icon. This represents the list of all charts available for viewing.</p>
					<p><i class="fa fa-compass"></i>: Menu icon. This represents a dynamic list of charts that updates based on the current map view. It will display all of the charts that cover the area that in your current view.</p>
					<p><i class="fa fa-star"></i>: Menu icon. This represents a list of all the charts that you've selected to be overlaid on the map.</p>
					<p><i class="fa fa-question"></i>: Menu icon. This brings you to this help page.</p>
					</ul>
				</div>
			</div>
		</div>
		<div id="map" class="sidebar-map"></div>
		<div id="infobox">
			<div id="hoverInfobox" style="display:none;"></div>
			<div id="highlightInfobox" style="display:none;"></div>
			<div id="chartCount"></div>
		</div>
		<?php include("php/breadcrumbs.php"); ?>
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