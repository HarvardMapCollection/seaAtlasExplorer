function geojson_bbox(filename) {
	// Global metadata variables
	GLOBAL_SEARCH_ID = 0;
	// The following is code pulled from StackOverflow, and is used to create an array of information in the HTTP GET
	// taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript, answer by BrunoLM
	/*var qs = (function(a) {
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
	};*/
	collections_to_display = collectionList;

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
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	};
	toggle = function(source) {
		checkboxes = document.getElementsByClassName('filterControl');
		for(var i=0, n=checkboxes.length;i<n;i++) {
			checkboxes[i].checked = source.checked;
		};
	};
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
		GLOBAL_SEARCH_ID = layer._polygonId

		$("#sidebar").removeClass("collapsed");
		$(".sidebar-tabs li").removeClass("active");
		$(".sidebar-pane").removeClass("active");
		$("#currentViewTab").addClass("active");
		$("#currentView").addClass("active");
		$(".collapseL2 div").attr("style","display:none");
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
		// Assigning metadata from feature. All properties will be available.
		$.extend(layer,feature.properties)
		// changing styling based on mouseover events
		layer.on({
			click: highlightFeature
		});
		if (layer._polygonId == GLOBAL_SEARCH_ID) {
			layer.setStyle(hoverStyle);
		};
	};
	// End of global functions

	// jQuery Listeners
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
	// End of jQuery Listeners
	bbox_collection = {};
	active_tile_collection_items = [];
	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		// Everything under this function should be using the geoJSON data in some way
		// Stuff that isn't dependent on geoJSON data (features, layers, etc.) can be defined elsewhere
		var focus_polygon = function(bbox_collection_item) {
			GLOBAL_SEARCH_ID = bbox_collection_item['UNIQUE_ID']
			bbox_collection_display()
			var width = $("#sidebar").width()
			map.fitBounds(bbox_collection_item['polygon'].getBounds(),{paddingTopLeft:[width,0]});
			bbox_collection_item['polygon'].setStyle(hoverStyle);
			bbox_collection_item['polygon'].addTo(map);
		}
		var marker_poly_duo = function(feature,container_array) {
			// This process will be applied to each feature in the geojson file,
			// then be added to the bbox_collection variable.
			var polygon = L.geoJson(feature);
			var marker = L.marker(polygon.getBounds().getCenter());
			var UID = feature.properties.UNIQUE_ID;
			var idealZoom = map.getBoundsZoom(polygon.getBounds());
			marker.on('mouseover',function() {
				map.addLayer(polygon);
			});
			marker.on('mouseout', function() {
				if (typeof GLOBAL_SEARCH_ID !== 'undefined' && GLOBAL_SEARCH_ID !== UID) {
					map.removeLayer(polygon);
				};
			});
			container_array[UID] = {
				'marker':marker,
				'polygon':polygon,
				'idealZoom':idealZoom
			};
			$.extend(container_array[UID],feature.properties);
			marker.on('click',function() {
				focus_polygon(container_array[UID]);
			});
		};
		var bbox_collection_generator = function(featureList) {
			// Container function to generate bbox_collection
			for (var i = featureList.length - 1; i >= 0; i--) {
				marker_poly_duo(featureList[i],bbox_collection);
			};
		};
		var dynamic_display = function(collection_item) {
			// Adds info box to dynamic list view
			toAdd = ""
			toAdd += "<a href=\"#\" class=\""+collection_item.UNIQUE_ID+" idLink\"><i class=\"fa fa-map-marker\"></i></a>"
			toAdd += "<div class=\"subCollapsible collapseL2\">"
			if (collection_item.UNIQUE_ID == GLOBAL_SEARCH_ID) {
				toAdd += "<h3 id=\""+collection_item.UNIQUE_ID+"_title\" class=\""+collection_item.UNIQUE_ID+"\"><span class=\"arrow arrow-d\"></span>"+collection_item.geographic_scope;
			} else {
				toAdd += "<h3 id=\""+collection_item.UNIQUE_ID+"_title\" class=\""+collection_item.UNIQUE_ID+"\"><span class=\"arrow arrow-r\"></span>"+collection_item.geographic_scope;
			}
			toAdd += "</h3>\n"
			if (collection_item.UNIQUE_ID == GLOBAL_SEARCH_ID) {
				toAdd += "<div id=\""+collection_item.UNIQUE_ID+"_details\" style=\"display:block\">\n<ul>\n"
			} else {
				toAdd += "<div id=\""+collection_item.UNIQUE_ID+"_details\">\n<ul>\n"
			}
			toAdd += "<li><a href=\""+collection_item.UNIQUE_ID+"\">Georeferenced map</a></li>\n"
			toAdd += "<li><a href=\"http://pds.lib.harvard.edu/pds/view/"+collection_item.DRS_ID+"?n="+collection_item.SEQUENCE+"\">View original image in Harvard Page Delivery Service</a></li>\n"
			toAdd += "<li><a href=\"http://id.lib.harvard.edu/aleph/"+collection_item.HOLLIS+"/catalog\">Library Catalog (HOLLIS) record</a></li>\n";
			toAdd += "<li><a href=\"http://nrs.harvard.edu/"+collection_item.URN+"\">Stable link</a></li>\n"
			if (isInArray(collection_item.UNIQUE_ID,active_tile_collection_items)) {
				toAdd += "<li><input type=\"checkbox\" class=\"add_to_map\" id=\"add|"+collection_item.UNIQUE_ID+"\" checked>"
			} else {
				toAdd += "<li><input type=\"checkbox\" class=\"add_to_map\" id=\"add|"+collection_item.UNIQUE_ID+"\">"
			};
			toAdd += "<label for=\"add_"+collection_item.UNIQUE_ID+"\">Include in current view?</label></li>\n"
			toAdd += "</ul>\n</div>\n"
			toAdd += "</div>"
			$("#"+collection_item.collection+"CurrentContent").append(toAdd)
		};
		var add_counter = function() {
			// Adds a count of how many entries are in each collection to current view list
			for (var i = collectionList.length - 1; i >= 0; i--) {
				var len = $("#"+collectionList[i]+"CurrentContent").children("div.collapseL2").length
				$("#"+collectionList[i]+"Counter").text("("+len+" charts)")
			};
		};
		var bbox_collection_display = function() {
			// Clearing map layers that aren't tiles
			map.eachLayer(function(layer) {
				if ('_tiles' in layer) {} else {
					map.removeLayer(layer);
				};
			});
			// Clearing dynamic display contents
			$(".subCollapsible").remove()
			$("#currentView .collapsible div a").remove();
			// Adding new marker layers and dynamic display contents
			for (var key in bbox_collection) {
				if (key !== GLOBAL_SEARCH_ID) {
					bbox_collection[key]['polygon'].setStyle(defaultStyle);
				}
				var z = map.getZoom();
				notTooSmall = bbox_collection[key]['idealZoom'] <= z+1;
				notTooBig = bbox_collection[key]['idealZoom'] >= z-1
				inView = map.getBounds().intersects(bbox_collection[key]['polygon'].getBounds());
				if (notTooBig && notTooSmall && inView) {
					bbox_collection[key]['marker'].addTo(map);
				}
				if (notTooBig && inView) {
					dynamic_display(bbox_collection[key]);
				}
				if (typeof GLOBAL_SEARCH_ID !== 'undefined') {
					if (GLOBAL_SEARCH_ID == bbox_collection[key]['UNIQUE_ID']) {
						var disp_poly = bbox_collection[key]['polygon'];
						disp_poly.setStyle(hoverStyle);
						disp_poly.addTo(map);
					}
				}
			}
			$(".idLink").on('click',idLink_click);
			$(".idLink").on('mouseover',idLink_mouseover);
			$(".idLink").on('mouseout',idLink_mouseout);
			$(".subCollapsible").collapsible();
			add_counter();
		};
		var idLink_click = function() {
			var classes = this.classList;
			classes.remove('idLink');
			var UID = classes[0];
			classes.add('idLink');
			focus_polygon(bbox_collection[UID]);
		};
		var idLink_mouseover = function() {
			var classes = this.classList;
			classes.remove('idLink');
			var UID = classes[0];
			classes.add('idLink');
			map.addLayer(bbox_collection[UID]['polygon']);
		};
		var idLink_mouseout = function() {
			var classes = this.classList;
			classes.remove('idLink');
			var UID = classes[0];
			classes.add('idLink');
			map.removeLayer(bbox_collection[UID]['polygon']);
		};
		bbox_collection_generator(data.features);
		bbox_collection_display(bbox_collection);
		map.on('zoomend',bbox_collection_display);
		$(".idLink").on('click',idLink_click);
		$(".idLink").on('mouseover',idLink_mouseover);
		$(".idLink").on('mouseout',idLink_mouseout);
		/*// Creating an associative array of feature properties
		var featureProperties = {};
		for (var i = data['features'].length - 1; i >= 0; i--) {
			featureProperties[data.features[i]['properties']['UNIQUE_ID']] = data.features[i]['properties']
		};

		// Defines a variable containing all geoJSON features
		// This will be used for zooming to polygons that are not currently displayed
		var activeBoxes = L.geoJson(data, {onEachFeature: onEachFeature,filter:collection_filter})
		var allBoxes = L.geoJson(data, {onEachFeature: onEachFeature})
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
			active_tile_layers = Object.keys(overlayMaps);
			if (itFits && notTooBig) {
				toAdd = ""
				toAdd += "<a href=\"#\" class=\""+layer._polygonId+" idLink\"><i class=\"fa fa-map-marker\"></i></a>"
				toAdd += "<div class=\"subCollapsible collapseL2\">"
				if (layer._polygonId == search_UID) {
					toAdd += "<h3 id=\""+layer._polygonId+"_title\" class=\""+layer._polygonId+"\"><span class=\"arrow arrow-d\"></span>"+layer.geographic_scope;
				} else {
					toAdd += "<h3 id=\""+layer._polygonId+"_title\" class=\""+layer._polygonId+"\"><span class=\"arrow arrow-r\"></span>"+layer.geographic_scope;
				}
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
				if (isInArray(layer._polygonId,active_tile_layers)) {
					toAdd += "<li><input type=\"checkbox\" class=\"add_to_map\" id=\"add|"+layer._polygonId+"\" checked>"
				} else {
					toAdd += "<li><input type=\"checkbox\" class=\"add_to_map\" id=\"add|"+layer._polygonId+"\">"
				};
				toAdd += "<label for=\"add_"+layer._polygonId+"\">Include in current view?</label></li>\n"
				toAdd += "</ul>\n</div>\n"
				toAdd += "</div>"
				$("#"+layer.collection+"CurrentContent").append(toAdd)
			};
		}
		function add_counter(){
			// Adds a count of how many entries are in each collection to current view list
			for (var i = collectionList.length - 1; i >= 0; i--) {
				var len = $("#"+collectionList[i]+"CurrentContent").children("div.collapseL2").length
				$("#"+collectionList[i]+"Counter").text("("+len+" charts)")
			};
		};
		function add_tile_layer() {
			map_id = $(this).attr("id").split("|")[1];
			layer_url = map_id+"/{z}/{x}/{y}.png";
			map.eachLayer(function(layer) {
				if (layer._url == layer_url) {
					map.removeLayer(layer);
				};
			});
			if (this.checked) {
				map.eachLayer(function(layer) {
					if (layer._url == layer_url) {
						map.removeLayer(layer);
					};
				});
				layerProperties = {
					bounds: [[featureProperties[map_id]['minLat'],featureProperties[map_id]['minLong']],[featureProperties[map_id]['maxLat'],featureProperties[map_id]['maxLong']]],
					maxZoom: featureProperties[map_id]['maxZoom'],
					minZoom: featureProperties[map_id]['minZoom'],
					tms:true,
					zIndex:9001,
				};
				layer_to_add = L.tileLayer(layer_url,layerProperties);
				overlayMaps[map_id] = layer_to_add;
				layer_to_add.addTo(map);
			} else {
				delete overlayMaps[map_id];
			};
			controlLayers.removeFrom(map);
			controlLayers = L.control.layers(baseMaps,overlayMaps)
			controlLayers.addTo(map);
		};

		// On zoom end, recalculates which features to display using same method as before.
		map.on('zoomend', function(e) {
			$(".subCollapsible").remove()
			$(".collapsible div .idLink").remove();
			map.removeLayer(dispBoxes);
			dispBoxes = L.geoJson(data, {
				style: defaultStyle,
				onEachFeature: onEachFeature,
				filter: display_filter,
			});
			dispBoxes.addTo(map)
			activeBoxes.eachLayer(add_to_currentViewContent);
			$(".add_to_map").on("click", add_tile_layer);
			add_counter()
			$(".subCollapsible").collapsible();
			activeBoxes = L.geoJson(data, {onEachFeature: onEachFeature, filter: collection_filter})
		});
		// As a drag finishes, figure out what to put in sidebar
		map.on('dragend', function(e) {
			$(".subCollapsible").remove();
			$(".collapsible div .idLink").remove();
			//$("#currentViewContent").append("<ul>")
			activeBoxes.eachLayer(add_to_currentViewContent);
			$(".add_to_map").on("click", add_tile_layer);
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
		});
		// On checkbox click, map is updated to exclude/include relevant polygons
		$(".filterControl").on("click", function() {
			collections_to_display = [];
			elements = $(":checkbox:checked")
			for(var i=0;typeof(elements[i])!='undefined';collections_to_display.push(elements[i++].getAttribute('value')))
				{};
			$(".subCollapsible").remove();
			$(".collapsible div .idLink").remove();
			map.removeLayer(dispBoxes);
			dispBoxes = L.geoJson(data, {
				style: defaultStyle,
				onEachFeature: onEachFeature,
				filter: display_filter,
			});
			dispBoxes.addTo(map)
			activeBoxes = L.geoJson(data, {onEachFeature: onEachFeature,filter:collection_filter})
			activeBoxes.eachLayer(add_to_currentViewContent);
			$(".add_to_map").on("click", add_tile_layer);
			add_counter();
			$(".subCollapsible").collapsible();
		});

		//Adding everything to initial map view

		// Adds details and counter to initial view
		activeBoxes.eachLayer(add_to_currentViewContent);
		$(".add_to_map").on("click", add_tile_layer);
		add_counter();
		$(".subCollapsible").collapsible();

		// Adds initial polygon layer, defined earlier based on initial zoom level
		dispBoxes.addTo(map);

		width = $("#sidebar").width();
		//if(dispBoxes.getBounds()._southWest){}else{map.zoomIn()};
		map.fitBounds(activeBoxes.getBounds(),{paddingTopLeft:[width,0]});
	*/});
};