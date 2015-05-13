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

		<!-- GeoJSON Data -->
		<link rel="polygons" type="application/json" href="geoJson/all_atlases.geojson">

	</head>
	<body>
		<div id="sidebar" class="sidebar">
			<ul class="sidebar-tabs" role="tablist">
				<li id="currentViewTab" class="active"><a href="#currentView" role="tab"><i class="fa fa-compass"></i></a></li>
				<li id="filterTab"><a href="#filter" role="tab"><i class="fa fa-filter"></i></a></li>
				<li id="bigListTab"><a href="#bigList" role="tab"><i class="fa fa-list"></i></a></li>
			</ul>
			<div class="sidebar-content">
				<div id="currentView" class="sidebar-pane active">
					<h1>Here's what you're looking at now:</h1>
					<input id="blaeu_checkbox" type="checkbox" class="filterControl" value="blaeu"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="blaeuCurrentHeading"><span class="arrow arrow-r"></span>Blaeu <span id="blaeuCounter"></span></h2>
						<div class="subCollapsible collapseL2" id="blaeuCurrentContent"></div>
					</div>
					<input id="colom_checkbox" type="checkbox" class="filterControl" value="colom"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="colomCurrentHeading"><span class="arrow arrow-r"></span>Colom <span id="colomCounter"></span></h2>
						<div class="subCollapsible collapseL2" id="colomCurrentContent"></div>
					</div>
					<input id="dewit_checkbox" type="checkbox" class="filterControl" value="dewit"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="dewitCurrentHeading"><span class="arrow arrow-r"></span>DeWit <span id="dewitCounter"></span></h2>
						<div class="subCollapsible collapseL2" id="dewitCurrentContent"></div>
					</div>
					<input id="dudleyV1_checkbox" type="checkbox" class="filterControl" value="dudleyV1"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="dudleyV1CurrentHeading"><span class="arrow arrow-r"></span>Dudley Vol. 1 <span id="dudleyV1Counter"></span></h2>
						<div class="subCollapsible collapseL2" id="dudleyV1CurrentContent"></div>
					</div>
					<input id="dudleyV3_checkbox" type="checkbox" class="filterControl" value="dudleyV3"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="dudleyV3CurrentHeading"><span class="arrow arrow-r"></span>Dudley Vol. 3 <span id="dudleyV3Counter"></span></h2>
						<div class="subCollapsible collapseL2" id="dudleyV3CurrentContent"></div>
					</div>
					<input id="goos_checkbox" type="checkbox" class="filterControl" value="goos"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="goosCurrentHeading"><span class="arrow arrow-r"></span>Goos <span id="goosCounter"></span></h2>
						<div class="subCollapsible collapseL2" id="goosCurrentContent"></div>
					</div>
					<input id="keulenV1_checkbox" type="checkbox" class="filterControl" value="keulenV1"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="keulenV1CurrentHeading"><span class="arrow arrow-r"></span>Keulen Vol. 1 <span id="keulenV1Counter"></span></h2>
						<div class="subCollapsible collapseL2" id="keulenV1CurrentContent"></div>
					</div>
					<input id="keulenV2_checkbox" type="checkbox" class="filterControl" value="keulenV2"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="keulenV2CurrentHeading"><span class="arrow arrow-r"></span>Keulen Vol. 2 <span id="keulenV2Counter"></span></h2>
						<div class="subCollapsible collapseL2" id="keulenV2CurrentContent"></div>
					</div>
					<input id="renard_checkbox" type="checkbox" class="filterControl" value="renard"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="renardCurrentHeading"><span class="arrow arrow-r"></span>Renard <span id="renardCounter"></span></h2>
						<div class="subCollapsible collapseL2" id="renardCurrentContent"></div>
					</div>
					<input id="waghenaer_checkbox" type="checkbox" class="filterControl" value="waghenaer"/>
					<div id="currentViewContent" class="collapsible collapseL1">
						<h2 id="waghenaerCurrentHeading"><span class="arrow arrow-r"></span>Waghenaer <span id="waghenaerCounter"></span></h2>
						<div class="subCollapsible collapseL2" id="waghenaerCurrentContent"></div>
					</div>
				</div>
				<div id="filter" class="sidebar-pane">
					<h1>Filters</h1>
					<p>
						<input id="blaeu_checkbox" type="checkbox" class="filterControl" value="blaeu"/>
						<label for="blaeu">Blaeu</label>
					</p>
					<p>
						<input id="colom_checkbox" type="checkbox" class="filterControl" value="colom"/>
						<label for="colom">Colom</label>
					</p>
					<p>
						<input id="dewit_checkbox" type="checkbox" class="filterControl" value="dewit"/>
						<label for="dewit">DeWit</label>
					</p>
					<p>
						<input id="dudleyV1_checkbox" type="checkbox" class="filterControl" value="dudleyV1"/>
						<label for="dudleyV1">Dudley Vol. 1</label>
					</p>
					<p>
						<input id="dudleyV3_checkbox" type="checkbox" class="filterControl" value="dudleyV3"/>
						<label for="dudleyV3">Dudley Vol. 3</label>
					</p>
					<p>
						<input id="goos_checkbox" type="checkbox" class="filterControl" value="goos"/>
						<label for="goos">Goos</label>
					</p>
					<p>
						<input id="keulenV1_checkbox" type="checkbox" class="filterControl" value="keulenV1"/>
						<label for="keulenV1">Keulen Vol. 1</label>
					</p>
					<p>
						<input id="keulenV2_checkbox" type="checkbox" class="filterControl" value="keulenV2"/>
						<label for="keulenV2">Keulen Vol. 2</label>
					</p>
					<p>
						<input id="renard_checkbox" type="checkbox" class="filterControl" value="renard"/>
						<label for="renard">Renard</label>
					</p>
					<p>
						<input id="waghenaer_checkbox" type="checkbox" class="filterControl" value="waghenaer"/>
						<label for="waghenaer">Waghenaer</label>
					</p>
					<p><a id="selectAll" class="filterControl">Select All</a></p>
					<p><a id="selectNone" class="filterControl">Select None</a></p>
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
	<script type="text/javascript">
	// Global metadata variables
	var collectionList = ["blaeu","colom","dewit","dudleyV1","dudleyV3","goos","keulenV1","keulenV2","renard","waghenaer"]
	var search_UID = 0;
	var collection_display = {
		"blaeu":"Blaeu",
		"colom":"Colom",
		"dewit":"DeWit",
		"dudleyV1":"Dudley Vol. 1",
		"dudleyV3":"Dudley Vol. 3",
		"goos":"Goos",
		"keulenV1":"Keulen Vol. 1",
		"keulenV2":"Keulen Vol. 2",
		"renard":"Renard",
		"waghenaer":"Waghenaer"
	};
	var qs = (function(a) {
		if (a == "") return {};
		var b = {};
		for (var i = 0; i < a.length; ++i)
		{
			var p=a[i].split('=', 2);
			if (p.length == 1)
				b[p[0]] = "";
			else
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return b;
	})(window.location.search.substr(1).split('&'));
	var collections_to_display = Object.keys(qs);
	for (var i = collections_to_display.length - 1; i >= 0; i--) {
		$("#"+collections_to_display[i]+"_checkbox")[0].checked = true;
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
		"Open Street Map": OpenStreetMap_Mapnik,
		"Stamen Watercolor": Stamen_Watercolor,
		"ESRI World Imagery": Esri_WorldImagery,
		"National Geographic World Map": Esri_NatGeoWorldMap
	}
	// Adding tile layer control
	L.control.layers(baseMaps).addTo(map);
	// End of tile layer definitions


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
	// End of style definitions

	// Global functions
	$("#selectAll").on("click",function(){
		boxes = $(":checkbox");
		for (var i = boxes.length - 1; i >= 0; i--) {
			boxes[i].checked = true
		};
	});
	$("#selectNone").on("click",function(){
		boxes = $(":checkbox");
		for (var i = boxes.length - 1; i >= 0; i--) {
			boxes[i].checked = false
		};
	});
	function display_filter(feature,layer){
		// Filters bounding boxes to be displayed based on zoom level and filter list.
		// Zoom based filter, selects polygons that fit in current zoom +/- 1
		var z = map.getZoom();
		var b = map.getBoundsZoom(L.geoJson(feature).getBounds())
		correct_zoom = b-1 <= z && z <= b+1
		// Collection filter, if collection in current list of collections for display
		display_collection = $.inArray(feature['properties']['collection'], collections_to_display) != -1
		return correct_zoom && display_collection
	};
	function collection_filter(feature,layer){
		// Collection filter, if collection in current list of collections for display
		display_collection = $.inArray(feature['properties']['collection'], collections_to_display) != -1
		return display_collection
	};
	function highlightFeature(e) {
		// Adds highlight styling, moves feature to back.
		var layer = e.target;

		dispBoxes.eachLayer(function(layer) {
			layer.setStyle(defaultStyle);
		});

		layer.setStyle(hoverStyle);

		var width = $("#sidebar").width();
		map.fitBounds(layer.getBounds(),{paddingTopLeft:[width,0]});

		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToBack();
		}
		// highlight sidebar text for highlighted feature
		$(".idLink").removeClass("highlight");
		$("."+layer._polygonId).addClass("highlight");
		search_UID = layer._polygonId

		$("#sidebar").removeClass("collapsed");
		$(".sidebar-tabs li").removeClass("active");
		$(".sidebar-pane").removeClass("active");
		$("#currentViewTab").addClass("active");
		$("#currentView").addClass("active");
		$(".collapsible div").attr("style","display:none");
		$("#"+layer.collection+"Currentheading span.arrow").attr("class","arrow-d");
		$("#"+layer.collection+"CurrentContent").attr("style","display:block");
		$("#"+layer._polygonId+"_title span.arrow").attr("class","arrow-d");
		$("#"+layer._polygonId+"_title")[0].scrollIntoView();
		$("#"+layer._polygonId+"_details").attr("style","display:block");
	};
	function resetHighlight(e) {
		// Resets highlighting
		var layer = e.target;
		layer.setStyle(defaultStyle);
	};
	function onEachFeature(feature,layer) {
		// Assigning polygon IDs based on UNIQUE_ID in feature
		layer._polygonId = feature.properties.UNIQUE_ID;
		// Assigning metadata
		layer.geographic_scope = feature.properties.geographic_scope;
		layer.collection = feature.properties.collection;
		layer.URN = feature.properties.URN;
		layer.DRS_ID = feature.properties.DRS_ID;
		layer.HOLLIS = feature.properties.HOLLIS;
		layer.SEQUENCE = feature.properties.SEQUENCE;
		// changing styling based on mouseover events
		layer.on({
			click: highlightFeature
		});
		if (layer._polygonId == search_UID) {
			layer.setStyle(hoverStyle);
		};
	};
	// End of global functions

	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		// Everything under this function should be using the geoJSON data in some way
		// Stuff that isn't dependent on geoJSON data (features, layers, etc.) can be defined elsewhere

		// Defines a variable containing all geoJSON features
		// This will be used for zooming to polygons that are not currently displayed
		var allBoxes = L.geoJson(data, {onEachFeature: onEachFeature,filter:collection_filter})
		// Getting subset of geoJSON to display based on current zoom level
		dispBoxes = L.geoJson(data, {
			style: defaultStyle,
			onEachFeature: onEachFeature,
			filter: display_filter,
		});

		// Function for contents of currentViewContent, to be added on zoomend and dragend.
		function add_to_currentViewContent(layer) {
			itFits = map.getBounds().intersects(layer.getBounds());
			var z = map.getZoom();
			var b = map.getBoundsZoom(layer.getBounds());
			notTooBig = z-1 <= b;
			if (itFits && notTooBig) {
				if (layer._polygonId == search_UID) {
					toAdd = "<h3 id=\""+layer._polygonId+"_title\" class=\""+layer._polygonId+"\"><span class=\"arrow arrow-d\"></span>"+layer.geographic_scope;
				} else {
					toAdd = "<h3 id=\""+layer._polygonId+"_title\" class=\""+layer._polygonId+"\"><span class=\"arrow arrow-r\"></span>"+layer.geographic_scope;
				}
				toAdd +=" <a href=\"#\" class=\""+layer._polygonId+" idLink\"><i class=\"fa fa-map-marker\"></i></a>"
				toAdd += "</h3>\n"
				if (layer._polygonId == search_UID) {
					toAdd += "<div id=\""+layer._polygonId+"_details\" style=\"display:block\">\n<ul>\n"
				} else {
					toAdd += "<div id=\""+layer._polygonId+"_details\">\n<ul>\n"
				}
				toAdd += "<li><a href=\""+layer._polygonId+"\">Georeferenced map</a></li>\n"
				toAdd += "<li><a href=\"http://pds.lib.harvard.edu/pds/view/"+layer.DRS_ID+"?n="+layer.SEQUENCE+"\">View original image in Harvard Page Delivery Service</a></li>\n"
				toAdd += "<li><a href=\"http://id.lib.harvard.edu/aleph/"+layer.HOLLIS+"/catalog\">Library Catalog (HOLLIS) record</a></li>\n";
				toAdd += "<li><a href=\"http://nrs.harvard.edu/"+layer.URN+"\">Stable link</a></li>\n"
				toAdd += "</ul>\n</div>\n"
				$("#"+layer.collection+"CurrentContent").append(toAdd)
			};
		}
		function add_counter(){
			// Adds a count of how many entries are in each collection to current view list
			for (var i = collectionList.length - 1; i >= 0; i--) {
				var len = $("#"+collectionList[i]+"CurrentContent").children("div").length
				$("#"+collectionList[i]+"Counter").text("("+len+" charts)")
			};
		};

		// On zoom end, recalculates which features to display using same method as before.
		map.on('zoomend', function(e) {
			$("#currentViewContent div").empty()
			map.removeLayer(dispBoxes);
			dispBoxes = L.geoJson(data, {
				style: defaultStyle,
				onEachFeature: onEachFeature,
				filter: display_filter,
			});
			dispBoxes.addTo(map)
			allBoxes.eachLayer(add_to_currentViewContent);
			add_counter()
			$(".subCollapsible").collapsible();
			allBoxes = L.geoJson(data, {onEachFeature: onEachFeature, filter: collection_filter})
		});
		// As a drag finishes, figure out what to put in sidebar
		map.on('dragend', function(e) {
			$("#currentViewContent div").empty();
			//$("#currentViewContent").append("<ul>")
			allBoxes.eachLayer(add_to_currentViewContent);
			add_counter()
			$(".subCollapsible").collapsible();
		});

		// jQuery, on ID link click, map will zoom to polygon with corresponding ID
		// Corresponding ID should also be highlighted
		$(document).on("click", ".idLink", function() {
			search_UID = $(this).attr("class").split(" ");
			search_UID.pop("idLink");
			allBoxes.eachLayer(function(layer) {
				if(layer._polygonId==search_UID) {
					if ($("#sidebar").hasClass("collapsed")) {
						map.fitBounds(layer.getBounds());
					} else {
						var width = $("#sidebar").width()
						map.fitBounds(layer.getBounds(),{paddingTopLeft:[width,0]});
					};
				}
			});
			dispBoxes.eachLayer(function(layer) {
				if (layer._polygonId==search_UID) {
					layer.setStyle(hoverStyle);
				} else {
					layer.setStyle(defaultStyle);
				};
			});
			$("."+search_UID).addClass
		});
		// On checkbox click, map is updated to exclude/include relevant polygons
		$(".filterControl").on("click", function() {
			collections_to_display = [];
			elements = $(":checkbox:checked")
			for(var i=0;typeof(elements[i])!='undefined';collections_to_display.push(elements[i++].getAttribute('value')))
				{};
			$("#currentViewContent div").empty();
			map.removeLayer(dispBoxes);
			dispBoxes = L.geoJson(data, {
				style: defaultStyle,
				onEachFeature: onEachFeature,
				filter: display_filter,
			});
			dispBoxes.addTo(map)
			allBoxes = L.geoJson(data, {onEachFeature: onEachFeature,filter:collection_filter})
			allBoxes.eachLayer(add_to_currentViewContent);
			add_counter()
			$(".subCollapsible").collapsible();
		});

		//Adding everything to initial map view

		// Adds details and counter to initial view
		allBoxes.eachLayer(add_to_currentViewContent);
		add_counter()
		$(".subCollapsible").collapsible();

		// Adds sidebar as a control
		var sidebar = L.control.sidebar('sidebar').addTo(map);
		
		// Adds initial base layer
		OpenStreetMap_Mapnik.addTo(map);

		// Adds initial polygon layer, defined earlier based on initial zoom level
		dispBoxes.addTo(map);

		width = $("#sidebar").width()
		if(dispBoxes.getBounds()._southWest){}else{map.zoomIn()};
		map.fitBounds(dispBoxes.getBounds(),{paddingTopLeft:[width,0]})
	});

	// collapsible lists
	$(".collapsible").collapsible();
	</script>
	</body>
</html>