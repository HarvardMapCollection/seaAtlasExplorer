var arrowRclass = 'fa-plus-square-o';
var arrowDclass = 'fa-minus-square-o';

function geojson_bbox(filename) {
	// Global metadata variables
	GLOBAL_SEARCH_ID = 0;

	// Style definitions
	var defaultPolygonStyle = {
		"color": "#3F00FF",
		"opacity": 0.5,
		"weight": 3,
		"fillOpacity": 0.1
	};
	var highlightPolygonStyle = {
		"color": "#C34E4C",
		"opacity": 0.8,
		"weight": 3,
		"fillOpacity": 0
	};
	L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
	var defaultMarkerIcon = L.AwesomeMarkers.icon({
		markerColor: "cadetblue",
		icon: "anchor",
	});
	var highlightMarkerIcon = L.AwesomeMarkers.icon({
		markerColor: "red",
		icon: "anchor",
	});
	// End of style definitions

	// Global functions
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	};
	// End of global functions
	bbox_collection = {};
	var active_tile_collection_items = [];
	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		// Everything under this function should be using the geoJSON data in some way
		// Stuff that isn't dependent on geoJSON data (features, layers, etc.) can be defined elsewhere
		var focus_chart_map = function(bbox_collection_item) {
			// Sets map focus to given chart, represented by bbox collection item
			var width = $("#sidebar").width()
			map.fitBounds(bbox_collection_item['polygon'].getBounds(),{paddingTopLeft:[width,0]});
			bbox_collection_display();
			bbox_collection_item['polygon'].setStyle(highlightPolygonStyle);
			bbox_collection_item['marker'].setIcon(highlightMarkerIcon);
			bbox_collection_item['polygon'].addTo(map);
		};
		var focus_chart_sidebar = function(bbox_collection_item) {
			// Sets sidebar focus to given chart, represented by bbox collection item
			// Deactivating everything in sidebar
			$("#sidebar").removeClass("collapsed");
			$(".sidebar-tabs li").removeClass("active");
			$(".sidebar-pane").removeClass("active");
			// Activating current view tab
			$("#currentViewTab").addClass("active");
			$("#currentView").addClass("active");
			// Collapsing all descriptions
			$("#currentView .collapseL2 div").attr("style","display:none");
			$("#currentView .collapseL2 span.arrow").attr("class","arrow fa fa-plus-square-o")
			$("#currentView .collapseL1>:nth-child(even)").attr("style","display:none");
			$("#currentView .collapseL1>:nth-child(odd) span.arrow").attr("class","arrow fa fa-plus-square-o")
			// Expanding selected collection
			$("#"+bbox_collection_item['collection']+"Currentheading > div > span.arrow").attr("class","arrow fa fa-minus-square-o");
			$("#"+bbox_collection_item['collection']+"CurrentContent").attr("style","display:block");
			// Expanding selected item and scrolling it into view.
			$("#"+bbox_collection_item['UNIQUE_ID']+"_title span.arrow").attr("class","arrow fa fa-minus-square-o");
			$("#currentView ."+bbox_collection_item['UNIQUE_ID']+"_details").attr("style","display:block");
			console.log("#"+bbox_collection_item['UNIQUE_ID']+"_title")
			$("#"+bbox_collection_item['UNIQUE_ID']+"_title")[0].scrollIntoView();
		};
		var focus_chart = function(bbox_collection_item) {
			// Removes focus from previously selected chart, sets focus on given chart.
			if (GLOBAL_SEARCH_ID !== 0) {
				map.removeLayer(bbox_collection[GLOBAL_SEARCH_ID]['polygon']);
				bbox_collection[GLOBAL_SEARCH_ID]['polygon'].setStyle(defaultPolygonStyle)
				bbox_collection[GLOBAL_SEARCH_ID]['marker'].setIcon(defaultMarkerIcon)
			}
			GLOBAL_SEARCH_ID = bbox_collection_item['UNIQUE_ID']
			focus_chart_map(bbox_collection_item);
			focus_chart_sidebar(bbox_collection_item);
		}
		var reset_highlight = function() {
			// Unsets global search ID and undoes the effects of focusing on a chart.
			console.log("this function ran")
			$("#highlightInfobox").empty;
			$("#highlightInfobox").attr("style","display:none;");
			console.log(bbox_collection[GLOBAL_SEARCH_ID])
			bbox_collection[GLOBAL_SEARCH_ID]["polygon"].setStyle(defaultPolygonStyle);
			map.removeLayer(bbox_collection[GLOBAL_SEARCH_ID]["polygon"]);
			bbox_collection[GLOBAL_SEARCH_ID]["marker"].setIcon(defaultMarkerIcon);
			GLOBAL_SEARCH_ID = 0;
		}
		var add_infobox_contents = function(bbox_collection_item,infoboxID) {
			// Adds description based on bbox collection to element with ID infoboxID
			var description = "";
			description += "<h3 class=\"chartScope\">"+bbox_collection_item['geographic_scope']+"</h3>";
			description += "<p class=\"collectionName\">"+collectionInfo[bbox_collection_item['collection']]["prettyTitle"]+"</p>";
			description += "<p class=\"authorName\">"+collectionInfo[bbox_collection_item['collection']]["authorFirstName"]+" ";
			if (collectionInfo[bbox_collection_item['collection']]["authorMiddleName"] !== "") {
				description += collectionInfo[bbox_collection_item['collection']]["authorMiddleName"]+" ";
			}
			description += collectionInfo[bbox_collection_item['collection']]["authorLastName"]+"</p>";
			if (infoboxID === "#highlightInfobox") {
				description += "<p id=\"resetHighlight\">Reset highlight</p>"
			}
			$(infoboxID).append(description);
			if (infoboxID === "#highlightInfobox") {
				$("#resetHighlight").on("click",reset_highlight);
			};
			$(infoboxID).attr("style","display:block;");
		}
		var marker_poly_duo = function(feature,container_array) {
			// This process will be applied to each feature in the geojson file,
			// then be added to the bbox_collection variable.
			// bbox_collection is a global variable that stores all of the information
			// about all of the charts, including markers and polygons.
			var polygon = L.geoJson(feature);
			var marker = L.marker(polygon.getBounds().getCenter());
			var UID = feature.properties.UNIQUE_ID;
			var idealZoom = map.getBoundsZoom(polygon.getBounds());
			container_array[UID] = {
				'marker':marker,
				'polygon':polygon,
				'idealZoom':idealZoom
			};
			$.extend(container_array[UID],feature.properties);
			polygon.setStyle(defaultPolygonStyle);
			marker.setIcon(defaultMarkerIcon);
			marker.on('mouseover',function() {
				map.addLayer(polygon);
				add_infobox_contents(container_array[UID],"#hoverInfobox");
			});
			marker.on('mouseout', function() {
				if (typeof GLOBAL_SEARCH_ID !== 'undefined' && GLOBAL_SEARCH_ID !== UID) {
					map.removeLayer(polygon);
				};
				$("#hoverInfobox").empty();
				$("#hoverInfobox").attr("style","display:none;")
			});
			container_array[UID] = {
				'marker':marker,
				'polygon':polygon,
				'idealZoom':idealZoom
			};
			$.extend(container_array[UID],feature.properties);
			marker.on('click',function() {
				focus_chart(container_array[UID]);
				$("#highlightInfobox").empty();
				add_infobox_contents(container_array[UID],"#highlightInfobox");
				$("#hoverInfobox").empty();
				$("#hoverInfobox").attr("style","display:none;")
			});
		};
		var bbox_collection_generator = function(featureList) {
			// Container function to generate bbox_collection
			for (var i = featureList.length - 1; i >= 0; i--) {
				marker_poly_duo(featureList[i],bbox_collection);
			};
		};
		var dynamic_display = function(collection_item) {
			// Adds info section to dynamic list view for given item
			toAdd = ""
			toAdd += "<a href=\"#\" class=\""+collection_item.UNIQUE_ID+" idLink\"><i class=\"fa fa-arrows-alt\" title=\"Zoom to this sea chart\"></i></a>"
			toAdd += "<div class=\"subCollapsible collapseL2\">"
			if (collection_item.UNIQUE_ID == GLOBAL_SEARCH_ID) {
				toAdd += "<h3 id=\""+collection_item.UNIQUE_ID+"_title\" class=\""+collection_item.UNIQUE_ID+" chartTitle\"><span class=\"arrow fa fa-minus-square-o\"></span>"+collection_item.geographic_scope;
			} else {
				toAdd += "<h3 id=\""+collection_item.UNIQUE_ID+"_title\" class=\""+collection_item.UNIQUE_ID+" chartTitle\"><span class=\"arrow fa fa-plus-square-o\"></span>"+collection_item.geographic_scope;
			}
			toAdd += "</h3>\n"
			if (collection_item.UNIQUE_ID == GLOBAL_SEARCH_ID) {
				toAdd += "<div class=\""+collection_item.UNIQUE_ID+"_details\" style=\"display:block\">\n<ul>\n"
			} else {
				toAdd += "<div class=\""+collection_item.UNIQUE_ID+"_details\">\n<ul>\n"
			}
			toAdd += "<li><a href=\"tiles/?chart_id="+collection_item.UNIQUE_ID+"\">Georeferenced map</a></li>\n"
			if (collection_item.SEQUENCE!==null) {
				toAdd += "<li><a href=\"http://pds.lib.harvard.edu/pds/view/"+collection_item.DRS_ID+"?n="+collection_item.SEQUENCE+"\">View chart in atlas</a></li>\n"
			}
			toAdd += "<li><a href=\"http://id.lib.harvard.edu/aleph/"+collection_item.HOLLIS+"/catalog\">Library Catalog (HOLLIS) record</a></li>\n";
			toAdd += "<li><a href=\"http://nrs.harvard.edu/"+collection_item.URN+"\">Permalink</a></li>\n"
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
				var num_in_view = $("#"+collectionList[i]+"CurrentContent").children("div.collapseL2").length
				var num_total = $("#"+collectionList[i]+"MainContent").children("div.collapseL2").length
				$("#"+collectionList[i]+"Counter").text("("+num_in_view+"/"+num_total+" charts in current view)")
			};
		};
		var bbox_collection_display = function() {
			// Displays map markers and sidebar items somewhat intelligently.
			// Map markers are displayed if the ideal zoom of their polygon is within one zoom level
			//   of the current map zoom level
			// Sidebar list items are displayed if the bounding boxes they represent are within
			//   the current view and have an ideal zoom smaller than the current zoom level.
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
			var isActiveTest = function(collection) {
				if ($("#"+collection+"_checkbox").is(":checked")) {
					return true
				} else {
					if ($("#currentView > .collapseL1").length === 1 && $("#currentView > #"+collection+"CurrentHeading").length === 1) {
						return true
					} else {
						return false
					};
				}
			}
			var markerCounter = 0
			for (var key in bbox_collection) {
				if (isInArray(bbox_collection[key]['collection'],collectionList)) {
					var z = map.getZoom();
					var notTooSmall = bbox_collection[key]['idealZoom'] <= z+1;
					var notTooBig = bbox_collection[key]['idealZoom'] >= z-1
					var inView = map.getBounds().contains(bbox_collection[key]['marker'].getLatLng());
					var isActive = isActiveTest(bbox_collection[key]['collection'])
					if (isActive === false) {
						console.log()
					}
					if (notTooBig && notTooSmall && inView && isActive) {
						bbox_collection[key]['marker'].addTo(map);
						markerCounter+=1;
					}
					if (notTooBig && inView && isActive) {
						dynamic_display(bbox_collection[key]);
					}
					if (GLOBAL_SEARCH_ID == bbox_collection[key]['UNIQUE_ID']) {
						var disp_poly = bbox_collection[key]['polygon'];
						disp_poly.setStyle(highlightPolygonStyle);
						disp_poly.addTo(map);
					}
				}
			}
			$(".idLink").on('click',idLink_click);
			$(".idLink").on('mouseover',idLink_mouseover);
			$(".idLink").on('mouseout',idLink_mouseout);
			$(".chartTitle").on('mouseover',chartTitle_mouseover);
			$(".chartTitle").on('mouseout',chartTitle_mouseout);
			$(".subCollapsible").collapsible();
			$(".add_to_map").on("click", add_tile_layer);
			add_counter();
			var all_chart_count = $("#bigList .collapseL2").length
			$("#chartCount").text(markerCounter+"/"+all_chart_count+" charts visible right now.")
		};
		var idLink_click = function() {
			// What happens when you click on a sidebar map marker:
			// The corresponding bounding box is focused
			var classes = this.classList;
			classes.remove("idLink");
			var UID = classes[0];
			classes.add("idLink");
			focus_chart(bbox_collection[UID]);
			$("#highlightInfobox").empty();
			add_infobox_contents(bbox_collection[UID],"#highlightInfobox");
			$("#hoverInfobox").empty();
			$("#hoverInfobox").attr("style","display:none;")
		};
		var idLink_mouseover = function() {
			// What happens when you mouse over a sidebar map marker:
			// The corresponding bounding box is shown
			var classes = this.classList;
			classes.remove('idLink');
			classes.remove('chartTitle');
			var UID = classes[0];
			classes.add('idLink');
			map.addLayer(bbox_collection[UID]['polygon']);
		};
		var idLink_mouseout = function() {
			// What happens when you mouse out of a sidebar map marker:
			// The corresponding bounding box is removed if not highlighted
			var classes = this.classList;
			classes.remove('idLink');
			var UID = classes[0];
			classes.add('idLink');
			if (UID !== GLOBAL_SEARCH_ID) {
				map.removeLayer(bbox_collection[UID]['polygon']);
			};
		};
		var chartTitle_mouseover = function() {
			// What happens when you mouse over a sidebar map marker:
			// The corresponding bounding box is shown
			var classes = this.classList;
			classes.remove('chartTitle');
			classes.remove('chartTitle');
			var UID = classes[0];
			classes.add('chartTitle');
			map.addLayer(bbox_collection[UID]['polygon']);
		};
		var chartTitle_mouseout = function() {
			// What happens when you mouse out of a sidebar map marker:
			// The corresponding bounding box is removed if not highlighted
			var classes = this.classList;
			classes.remove('chartTitle');
			var UID = classes[0];
			classes.add('chartTitle');
			if (UID !== GLOBAL_SEARCH_ID) {
				map.removeLayer(bbox_collection[UID]['polygon']);
			};
		};
		var add_tile_layer = function() {
			// Adds a tile layer corresponding to the chart ID.
			var map_id = $(this).attr("id").split("|")[1];
			var layer_url = "tiles/"+map_id+"/{z}/{x}/{y}.png";
			var layerTitle = bbox_collection[map_id]['collection'] + ", " + bbox_collection[map_id]['geographic_scope']
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
					bounds: [[bbox_collection[map_id]['minLat'],bbox_collection[map_id]['minLong']],[bbox_collection[map_id]['maxLat'],bbox_collection[map_id]['maxLong']]],
					maxZoom: bbox_collection[map_id]['maxZoom'],
					minZoom: bbox_collection[map_id]['minZoom'],
					tms: true,
					opacity: 0.9,
				};
				layer_to_add = L.tileLayer(layer_url,layerProperties);
				overlayMaps[layerTitle] = layer_to_add;
				layer_to_add.addTo(map);
			} else {
				delete overlayMaps[layerTitle];
			};
			controlLayers.removeFrom(map);
			controlLayers = L.control.layers(baseMaps,overlayMaps)
			controlLayers.addTo(map);
			active_tile_collection_items += map_id;
		};
		bbox_collection_generator(data.features);
		bbox_collection_display(bbox_collection);
		map.on('zoomend',bbox_collection_display);
		map.on('dragend',bbox_collection_display);
		$(".idLink").on('click',idLink_click);
		$(".idLink").on('mouseover',idLink_mouseover);
		$(".idLink").on('mouseout',idLink_mouseout);
		$(".chartTitle").on('mouseover',chartTitle_mouseover);
		$(".chartTitle").on('mouseout',chartTitle_mouseout);
		$(".filterControl").on("click",bbox_collection_display)
		$(".add_to_map").on("click", add_tile_layer);
		var width = $("#sidebar").width();
		map.fitBounds([
			[-90,-180],
			[90,180]
		],{paddingTopLeft:[width,0]});
	});
};