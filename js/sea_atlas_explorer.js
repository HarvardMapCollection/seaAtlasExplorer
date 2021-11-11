import { createCookie, readCookie, eraseCookie, getURLParameter, isInArray } from './modules/utility.js';
import { state_string_to_active_tiles } from './modules/map_utils.js'
import { sidebar_skeleton } from './modules/sidebar_skeleton.js';
import { atlas_metadata } from './modules/atlas_metadata.js';

var TILE_LOCATION = 'http://sea-atlases.org/maps/tiles/';

// START OF THINGS THAT MIGHT NOT BE IN USE
// classes for icons that will open/close dropdowns
var arrowRclass = 'fa-plus-square-o';
var arrowDclass = 'fa-minus-square-o';

function toggle(source) {
    checkboxes = document.getElementsByClassName('filterControl');
    for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
    };
}
// END OF THINGS THAT MIGHT NOT BE IN USE

// Main function
export function setup_page() {
	
	$("#staticList").html(sidebar_skeleton(false));
	$("#dynamicList").html(sidebar_skeleton(true));

	///////////
	// SETUP //
	///////////

	// Map creation
	var map = L.map('map');
	map.setView([0, 0], 1);

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
	var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png', {
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
		subdomains: 'abcd',
		minZoom: 0,
		maxZoom: 20,
		ext: 'png'
	});
	var baseMaps = {
		"Stamen Watercolor": Stamen_Watercolor,
		"Stamen Toner (high contrast)": Stamen_Toner,
		"Open Street Map": OpenStreetMap_Mapnik,
		"ESRI World Satellite Imagery": Esri_WorldImagery,
		"National Geographic World Map": Esri_NatGeoWorldMap
	}

	// Adding tile layer control
	L.control.layers(baseMaps).addTo(map);
	// End of tile layer definitions

	// Adds sidebar as a control
	L.control.sidebar('sidebar').addTo(map);

	// Adds initial base layer
	Stamen_Watercolor.addTo(map);

	// Global metadata variables
	var GLOBAL_SEARCH_ID = 0;
	var BBOX_COLLECTION = {};
	var ACTIVE_TILE_COLLECTION_ITEMS = [];
	var ACTIVE_BEFORE_RESET;
	var DISPLAY_MARKERS = true;
	var collectionList = Object.keys(atlas_metadata);
	// collectionList and collectionInfo are also available as global variables
	// They are generated in the current_view_headers php file.
	// This is because they use data from the atlas metadata CSV.
	// End of global metadata variables

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
	L.AwesomeMarkers.Icon.prototype.options.prefix='atlasIcons';
	// End of style definitions

	//////////////////
	// LOADING DATA //
	//////////////////
	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		// Everything under this function should be using the geoJSON data in some way
		// Stuff that isn't dependent on geoJSON data (features, layers, etc.) can be defined elsewhere

		// figuring out which tiles to activate
		if (getURLParameter("active")!==null) {
			var activeTiles = getURLParameter("active");
			// If the url has active tile information, switch to the selections tab
			$(".sidebar-tabs li").removeClass("active");
			$(".sidebar-pane").removeClass("active");
			$("#selectionsTab").addClass("active");
			$("#selections").addClass("active");
		} else if (readCookie("activeTiles")) {
			var activeTiles = readCookie("activeTiles");
		} else {
			var activeTiles = 0;
		}

		if (typeof(activeTiles)!=='undefined') {
			var tiles_to_activate = state_string_to_active_tiles(activeTiles, data.length);
		}

		// Functions for highlighting a given chart
		// function in map_utils.js
		function focus_chart_map(bbox_collection_item) {
			// Sets map focus to given chart, represented by bbox collection item
			var width = $("#sidebar").width();
			map.fitBounds(bbox_collection_item['polygon'].getBounds(), { paddingTopLeft: [width, 0] });
			bbox_collection_display();
			bbox_collection_item['polygon'].setStyle(highlightPolygonStyle);
			bbox_collection_item['marker'].setIcon(L.AwesomeMarkers.icon({
				markerColor: "red",
				icon: atlas_metadata[bbox_collection_item['collection']]['atlasIcon'],
			}));
			bbox_collection_item['polygon'].addTo(map);
		}

		var focus_chart_sidebar = function(bbox_collection_item, focus_dynamic) {
			// Setting focus on sidebar. Currently doesn't do anything.
			// Keeping it around in case setting sidebar focus becomes a priority.
			var focus_dynamic = typeof focus_dynamic !== 'undefined' ? focus_dynamic : true;
			if (focus_dynamic) {} else {};
		};

		var focus_chart = function(bbox_collection_item, focus_dynamic) {
			// Focuses on the given chart, and toggles whether it focuses on the dynamic sidebar
			var focus_dynamic = typeof focus_dynamic !== 'undefined' ? focus_dynamic : true;
			// Removes focus from previously selected chart, sets focus on given chart.
			if (GLOBAL_SEARCH_ID !== 0) {
				map.removeLayer(BBOX_COLLECTION[GLOBAL_SEARCH_ID]['polygon']);
				BBOX_COLLECTION[GLOBAL_SEARCH_ID]['polygon'].setStyle(defaultPolygonStyle)
				BBOX_COLLECTION[GLOBAL_SEARCH_ID]['marker'].setIcon(L.AwesomeMarkers.icon({
					markerColor: "cadetblue",
					icon: atlas_metadata[BBOX_COLLECTION[GLOBAL_SEARCH_ID]['collection']]['atlasIcon'],
				}))
			}
			GLOBAL_SEARCH_ID = bbox_collection_item['UNIQUE_ID']
			focus_chart_map(bbox_collection_item);
			if (focus_dynamic) {
				focus_chart_sidebar(bbox_collection_item, focus_dynamic);
			};
		}

		var reset_highlight = function() {
			// Unsets global search ID and undoes the effects of focusing on a chart.
			$("#highlightInfobox").empty;
			$("#highlightInfobox").attr("style","display:none;");
			BBOX_COLLECTION[GLOBAL_SEARCH_ID]["polygon"].setStyle(defaultPolygonStyle);
			map.removeLayer(BBOX_COLLECTION[GLOBAL_SEARCH_ID]["polygon"]);
			BBOX_COLLECTION[GLOBAL_SEARCH_ID]["marker"].setIcon(L.AwesomeMarkers.icon({
				markerColor: "cadetblue",
				icon: atlas_metadata[BBOX_COLLECTION[GLOBAL_SEARCH_ID]['collection']]['atlasIcon'],
			}));
			GLO
			BAL_SEARCH_ID = 0;
		}

		var add_infobox_contents = function(bbox_collection_item,infoboxID) {
			// Adds description based on bbox collection item to element with ID infoboxID
			// It looks a little messy, but each line being added to the description should only do one thing
			// The idea is to be able to re-arrange the contents of this infobox easily,
			// even with the dynamic elements
			var description = "";
			if (infoboxID === "#highlightInfobox") {
				description += "<div class=\"infobox-title\">Highlighted Chart</div>"
			} else {
				description += "<div class=\"infobox-title\">Hovered Chart</div>"
			};
			description += "<h3 class=\"chart-scope\">"+bbox_collection_item['geographic_scope']+"</h3>";
			description += "<div id=\"infobox-metadata\">"
			description += "<p class=\"collectionName\"><a title=\"Library Catalog (HOLLIS) link\" href=\"http://id.lib.harvard.edu/aleph/"+bbox_collection_item.HOLLIS+"/catalog\">"+atlas_metadata[bbox_collection_item['collection']]["prettyTitle"]+"</a></p>";
			description += "<p>"
			description += "<span class=\"authorName\">"
			description += atlas_metadata[bbox_collection_item['collection']]["authorLastName"]
			description += ", "
			description += atlas_metadata[bbox_collection_item['collection']]["authorFirstName"];
			if (atlas_metadata[bbox_collection_item['collection']]["authorMiddleName"] !== "") {
				description += " "+atlas_metadata[bbox_collection_item['collection']]["authorMiddleName"];
			}
			description += "</span> ("
			description += atlas_metadata[bbox_collection_item['collection']]['pubYear']
			description += ")</p>";
			description += "</div>";
			if (infoboxID === "#highlightInfobox") {
				description += "<div id=\"infobox-action-items\">"
				if (isInArray(bbox_collection_item.UNIQUE_ID,ACTIVE_TILE_COLLECTION_ITEMS)) {
					description += "<p><input id=\"infobox_add-to-map\" type=\"checkbox\" class=\"add-to-map "+bbox_collection_item.UNIQUE_ID+" infobox-left-box\" checked>"
				} else {
					description += "<p><input id=\"infobox_add-to-map\" type=\"checkbox\" class=\"add-to-map "+bbox_collection_item.UNIQUE_ID+" infobox-left-box\">"
				};
				description += "<label for=\"infobox_add-to-map\">View chart on top of current map</label></p>"
				// description += "<p><a href=\"tiles/?chart_id="+bbox_collection_item.UNIQUE_ID+"\">View chart on new map</a></p>\n"
				if (bbox_collection_item.SEQUENCE!==null) {
					description += "<p><a href=\"http://nrs.harvard.edu/"+bbox_collection_item.atlasURN+"?n="+bbox_collection_item.SEQUENCE+"\"><i class=\"fa fa-external-link infobox-left-box\"></i>View chart in atlas</a></p>\n"
				}
				// description += "<p><a href=\"http://id.lib.harvard.edu/aleph/"+bbox_collection_item.HOLLIS+"/catalog\">Library Catalog (HOLLIS) record</a></p>\n";
				description += "<p><a href=\"http://nrs.harvard.edu/"+bbox_collection_item.URN+"\"><i class=\"fa fa-external-link infobox-left-box\"></i>Permalink</a></p>\n"
				description += "</div>"
				description += "<div id=\"reset-highlight\"><i class=\"fa fa-times\"></i></div>"
			}
			$(infoboxID).append(description);
			if (infoboxID === "#highlightInfobox") {
				$("#reset-highlight").on("click",reset_highlight);
				$("#highlightInfobox .add-to-map").on("click", add_tile_layer_checkbox)
			};
			$(infoboxID).attr("style","display:block;");
		}
		// End of functions for highlighting a given chart

		var marker_poly_duo = function(feature,container_array,i) {
			// This function establishes the elements of the chart data structure
			// Each chart is an element in an associative array,
			// uniquely identified by a DRS ID plus "_MAPA" etc. as needed
			// Whenever you see something referencing a BBOX_COLLECTION,
			// it's referencing the data structure here.
			// Properties from the source geojson are added, as well as ideal zoom levels,
			// map markers, and polygons.
			// Basically, anything you want to access about a given chart will go through
			// BBOX_COLLECTION, and what's in BBOX_COLLECTION is defined here.
			var polygon = L.geoJson(feature); // feature defined by geojson
			var marker = L.marker(polygon.getBounds().getCenter()); // marker at center of polygon
			var UID = feature.properties.UNIQUE_ID; // UID from geojson properties, UNIQUE_ID
			var idealZoom = map.getBoundsZoom(polygon.getBounds()); // ideal zoom determines what zoom level marker displays at
			// attributes begin to be gathered under container_array[UID]
			container_array[UID] = {
				'marker':marker,
				'polygon':polygon,
				'idealZoom':idealZoom
			};
			// geojson feature properties are added
			$.extend(container_array[UID],feature.properties);
			// Polygon set to default style
			polygon.setStyle(defaultPolygonStyle);
			// Marker set to style partially determined by imported atlas_metadata
			marker.setIcon(L.AwesomeMarkers.icon({
				markerColor: "cadetblue",
				icon: atlas_metadata[feature.properties['collection']]['atlasIcon'],
			}));
			// Setting behavior for hovering over marker by both mouseover and mouseout
			marker.on('mouseover', function() {
				if (UID !== GLOBAL_SEARCH_ID) {
					map.addLayer(polygon);
					add_infobox_contents(container_array[UID],"#hoverInfobox");
				}
			});
			marker.on('mouseout', function() {
				if (typeof GLOBAL_SEARCH_ID !== 'undefined' && GLOBAL_SEARCH_ID !== UID) {
					map.removeLayer(polygon);
				};
				$("#hoverInfobox").empty();
				$("#hoverInfobox").attr("style","display:none;")
			});
			// Setting behavior for clicking on a marker, currently highlights given chart
			marker.on('click',function() {
				focus_chart(container_array[UID]);
				$("#highlightInfobox").empty();
				add_infobox_contents(container_array[UID],"#highlightInfobox");
				$("#hoverInfobox").empty();
				$("#hoverInfobox").attr("style","display:none;")
			});
			// If there's a global tiles_to_activate, and it indicates this chart should be active,
			// its tiles are added to the map.
			// This can come from the cookies (to ensure state preservation from back button),
			// or from the HTTP GET (for bookmarking)
			if (typeof(tiles_to_activate)!=='undefined') {
				if (tiles_to_activate[i] == 1) {
					add_tile_layer(container_array[UID])
				}
			}
		};

		var bbox_collection_generator = function(featureList) {
			// Container function to generate bbox_collection
			for (var i = featureList.length - 1; i >= 0; i--) {
				marker_poly_duo(featureList[i],BBOX_COLLECTION,i);
			};
		};

		var dynamic_display = function(collection_item) {
			// Adds info section to dynamic list view for given item
			var toAdd = ""
			toAdd += "<h3 class=\""+collection_item.UNIQUE_ID+" chart-scope\">"
			toAdd += "<span class=\""+collection_item.UNIQUE_ID+" id-link\">"
			toAdd += "<i class=\"fa fa-map-marker\" title=\"Zoom to this sea chart\"></i>  "
			toAdd += collection_item.geographic_scope
			toAdd += "</span>"
			if (isInArray(collection_item.UNIQUE_ID,ACTIVE_TILE_COLLECTION_ITEMS)) {
				toAdd += "<input type=\"checkbox\" id=\"add_"+collection_item.UNIQUE_ID+"_to_map\" class=\"add-to-map "+collection_item.UNIQUE_ID+"\" checked>"
			} else {
				toAdd += "<input type=\"checkbox\" id=\"add_"+collection_item.UNIQUE_ID+"_to_map\" class=\"add-to-map "+collection_item.UNIQUE_ID+"\">"
			};
			toAdd += "<label for=\"add_"+collection_item.UNIQUE_ID+"_to_map\"></label>"
			toAdd += "</h3>"
			$("#"+collection_item.collection+"CurrentContent").append(toAdd)
		};

		var add_counter = function() {
			// Adds a count of how many entries are in each collection to current view list
			for (var i = collectionList.length - 1; i >= 0; i--) {
				var num_in_view = $("#"+collectionList[i]+"CurrentContent").children("h3.chart-scope").length
				var num_total = $("#"+collectionList[i]+"MainContent").children("h3.chart-scope").length
				$("#"+collectionList[i]+"Counter").text("("+num_in_view+"/"+num_total+" charts in current view)")
			};
		};

		// function in map_utils.js
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
			$("#dynamicList .chart-scope").remove()
			// clearing bookmark link
			$("#bookmark-link-text").removeClass("active");
			// Adding new marker layers and dynamic display contents
			var isActiveTest = function(collection) {
				// Checks if a given atlas is active based on sidebar state
				if ($("#"+collection+"_checkbox").is(":checked")) {
					return true
				} else {
					if ($("#dynamicList > .collapseL1").length === 1 && $("#dynamicList > #"+collection+"CurrentHeading").length === 1) {
						return true
					} else {
						return false
					};
				}
			}
			var markerCounter = 0
			for (var key in BBOX_COLLECTION) {
				if (isInArray(BBOX_COLLECTION[key]['collection'],collectionList)) {
					var z = map.getZoom();
					var notTooSmall = BBOX_COLLECTION[key]['idealZoom'] <= z+1;
					var notTooBig = BBOX_COLLECTION[key]['idealZoom'] >= z-1
					var inView = map.getBounds().contains(BBOX_COLLECTION[key]['marker'].getLatLng());
					var isActive = isActiveTest(BBOX_COLLECTION[key]['collection'])
					if (DISPLAY_MARKERS) {
						if (notTooBig && notTooSmall && inView && isActive) {
							BBOX_COLLECTION[key]['marker'].addTo(map);
							markerCounter+=1;
						}
					}
					if (notTooBig && inView && isActive) {
						dynamic_display(BBOX_COLLECTION[key]);
					}
					if (GLOBAL_SEARCH_ID == BBOX_COLLECTION[key]['UNIQUE_ID']) {
						var disp_poly = BBOX_COLLECTION[key]['polygon'];
						disp_poly.setStyle(highlightPolygonStyle);
						disp_poly.addTo(map);
					}
				}
			}
			// Set up functions to run appropriately for newly added content
			$("#dynamicList .id-link").on('click',idLink_click);
			$("#dynamicList .chart-scope").on('mouseover',function() {
				bbox_highlight_mouseover(this, 'chart-scope')
			});
			$("#dynamicList .chart-scope").on('mouseout', function() {
				bbox_highlight_mouseout(this, 'chart-scope')
			});
			$("#dynamicList .add-to-map").on("click", add_tile_layer_checkbox);
			add_counter();
			var all_chart_count = $("#staticList .chart-scope").length
			$("#chartCount").text(markerCounter+"/"+all_chart_count+" charts visible right now.")
		};

		var idLink_click = function(event) {
			// If the event had some data indicating it should focus on the dynamic view, this will be recorded. Default is true.
			if (typeof event.data !== 'undefined') {
				var focus_dynamic = event.data.focus_dynamic;
			} else {
				focus_dynamic = typeof focus_dynamic !== 'undefined' ? focus_dynamic : true;
			};
			// What happens when you click on a sidebar map marker:
			// The corresponding bounding box is focused
			// The highlight infobox is emptied of its contents
			// The highlight infobox gets new, appropriate contents added
			// The hover infobox is emptied and hidden.
			var classes = this.classList;
			classes.remove("id-link");
			var UID = classes[0];
			classes.add("id-link");
			focus_chart(BBOX_COLLECTION[UID], focus_dynamic);
			$("#highlightInfobox").empty();
			add_infobox_contents(BBOX_COLLECTION[UID],"#highlightInfobox");
			$("#hoverInfobox").empty();
			$("#hoverInfobox").attr("style","display:none;")
		};

		var bbox_highlight_mouseover = function(original_this, selector_class) {
			// Highlight something on mouseover
			// Assumes a chart ID as first class, and a general selector also in classes.
			var classes = original_this.classList;
			classes.remove(selector_class);
			var UID = classes[0];
			classes.add(selector_class);
			map.addLayer(BBOX_COLLECTION[UID]['polygon']);
		};

		var bbox_highlight_mouseout = function(original_this, selector_class) {
			// Unhighlight something on mouseover
			// Assumes a chart ID as first class, and a general selector also in classes.
			var classes = original_this.classList;
			classes.remove(selector_class);
			var UID = classes[0];
			classes.add(selector_class);
			if (UID !== GLOBAL_SEARCH_ID) {
				map.removeLayer(BBOX_COLLECTION[UID]['polygon']);
			};
		};

		// Tile layer stuff
		var updateOpacity = function(value, layer) {
			// updates opacity, currently hooked up to transparency sliders
			layer.setOpacity(value);
		};

		var layer_description = function(collection_item, layer) {
			// Layer description HTML, to be added to selected charts section.
			var desc = "";
			desc += "<div id=\""+collection_item['UNIQUE_ID']+"_starred\" class=\"selected-chart\">\n";
			desc += "<h3 class=\""+collection_item['UNIQUE_ID']+" id-link\">"
			desc += "<div class=\"awesome-marker-icon-cadetblue awesome-marker\" style=\"width: 35px; height: 45px;position: relative;float: left;\"><i class=\"atlasIcons atlasIcons-"+atlas_metadata[collection_item['collection']]['atlasIcon']+" icon-white\"></i></div>";
			desc += "<span class=\"starredScope\">"+collection_item.geographic_scope+"</span>"
			desc += "<input type=\"checkbox\" id=\"selections-tab-add-"+collection_item.UNIQUE_ID+"-to-map\" class=\"add-to-map "+collection_item.UNIQUE_ID+"\" checked>";
			desc += "<label for=\"selections-tab-add-"+collection_item.UNIQUE_ID+"-to-map\"  class=\"selection-checkbox\"></label>"
			desc += "</h3>"
			desc += "<div class=\"transparency-slider\"><label for=\""+collection_item['UNIQUE_ID']+"_slider\">Transparency:&nbsp;</label>"
			desc += '<i class=\"fa fa-circle-o\"></i>&nbsp;<input id=\"'+collection_item['UNIQUE_ID']+'_slider\" class="slide" type="range" min="0" max="1" step="0.1" value="0.7">&nbsp;<i class=\"fa fa-circle\"></i></div>'
			desc += "</div>";
			return desc
		};

		var tile_layer_desc_func_register = function(collection_item, layer) {
			// Sets up functions to run appropriately on newly added tile descriptions
			$("#"+collection_item['UNIQUE_ID']+"_starred .id-link").on('click',{focus_dynamic:false},idLink_click);
			$("#"+collection_item['UNIQUE_ID']+"_starred .id-link").on('mouseover', function() {
				bbox_highlight_mouseover(this, "id-link");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .id-link").on('mouseout', function() {
				bbox_highlight_mouseout(this, "id-link");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .chartTitle").on('mouseover', function() {
				bbox_highlight_mouseover(this, "chartTitle");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .chartTitle").on('mouseout', function() {
				bbox_highlight_mouseout(this, "chartTitle");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .subCollapsible").collapsible();
			$("#"+collection_item['UNIQUE_ID']+"_starred .add-to-map").on("click", add_tile_layer_checkbox);
			$("#"+collection_item['UNIQUE_ID']+"_starred .slide").on("change", function() {updateOpacity(this.value,layer)});
		};

		var flash_tab_icon = function(selector,flash_class,time) {
			// Adds flash_class on selector, waits `time` in ms and then removes flash_class
			$(selector).addClass(flash_class);
			setTimeout(function() {
				$(selector).removeClass(flash_class);
			},time);
		};

		var tile_layer_title_maker = function(bbox_collection_item) {
			// Makes a title for tile layer, for use in layer control
			var returnVal = atlas_metadata[bbox_collection_item.collection]['authorLastName'] + ", " + bbox_collection_item.geographic_scope;
			return returnVal;
		};

		var tile_layer_url_maker = function(bbox_collection_item) {
			// Makes a url for tile layer, for use in layer control
			var returnVal = TILE_LOCATION+bbox_collection_item.UNIQUE_ID+"/{z}/{x}/{y}.png";
			return returnVal;
		};

		var add_tile_layer_to_map = function(bbox_collection_item) {
			// Clear bookmark link text box
			$("#bookmark-link-text").attr("style","display:none;")
			// Adds tile layer to map, checking first if it's already there.
			if ($("#"+bbox_collection_item['UNIQUE_ID']+"_starred").length === 0) {
				var layerTitle = tile_layer_title_maker(bbox_collection_item);
				var layerUrl = tile_layer_url_maker(bbox_collection_item);
				// Flash the notification that a chart has been added
				flash_tab_icon("#chartAddedNotification","active",3000)
				// If the tile layer is already there, remove it
				map.eachLayer(function(layer) {
					if (layer._url == layerUrl) {
						map.removeLayer(layer);
					};
				});
				// Define layer and properties
				var layerProperties = {
					bounds: [[bbox_collection_item['minLat'],bbox_collection_item['minLong']],[bbox_collection_item['maxLat'],bbox_collection_item['maxLong']]],
					maxZoom: bbox_collection_item['maxZoom'],
					minZoom: bbox_collection_item['minZoom'],
					tms: true,
					opacity: 0.9,
					zIndex: 2,
				};
				var layer_to_add = L.tileLayer(layerUrl,layerProperties);
				// Add layer description to sidebar
				var desc = layer_description(bbox_collection_item,layer_to_add);
				$("#selections").append(desc);
				// Hook up js functions
				tile_layer_desc_func_register(bbox_collection_item,layer_to_add);
				// Flash add class on selection tab icon
				flash_tab_icon("#selectionsTab i","flash-add",250);
				// Add layer to map
				layer_to_add.addTo(map);
				// Add unique id to array of active tile layer IDs
				ACTIVE_TILE_COLLECTION_ITEMS.push(bbox_collection_item.UNIQUE_ID);
			};
		};

		var remove_tile_layer_from_map = function(bbox_collection_item) {
			// Does what it says, removes a tile layer and associated metadata from map
			var layerTitle = tile_layer_title_maker(bbox_collection_item);
			var layerUrl = tile_layer_url_maker(bbox_collection_item);
			// Flash the notification that a chart has been added
			map.eachLayer(function(layer) {
				if (layer._url == layerUrl) {
					map.removeLayer(layer);
				};
			});
			$("#"+bbox_collection_item.UNIQUE_ID+"_starred").remove()
			flash_tab_icon("#selectionsTab i","flash-remove",250)
			var tile_id_index = $.inArray(bbox_collection_item.UNIQUE_ID, ACTIVE_TILE_COLLECTION_ITEMS)
			ACTIVE_TILE_COLLECTION_ITEMS.splice(tile_id_index, 1)
			if (bbox_collection_item.UNIQUE_ID !== GLOBAL_SEARCH_ID) {
				map.removeLayer(bbox_collection_item.polygon);
			};
			$(".add-to-map."+bbox_collection_item.UNIQUE_ID).prop("checked",false);
		};

		var add_tile_layer = function(bbox_collection_item) {
			// Adds a tile layer to the map based on info in the collection item
			var layer_url = TILE_LOCATION+bbox_collection_item.UNIQUE_ID+"/{z}/{x}/{y}.png";
			var layerTitle = tile_layer_title_maker(bbox_collection_item);
			map.eachLayer(function(layer) {
				if (layer._url == layer_url) {
					map.removeLayer(layer);
				};
			});
			if ($.inArray(bbox_collection_item.UNIQUE_ID,ACTIVE_TILE_COLLECTION_ITEMS)==-1) {
				add_tile_layer_to_map(bbox_collection_item);
			} else {
				remove_tile_layer_from_map(bbox_collection_item);
			};
			// controlLayers.removeFrom(map);
			// controlLayers.addTo(map);
		};

		var add_tile_layer_checkbox = function() {
			// Adding a tile layer from a checkbox, which includes setting
			// all other checkboxes to be either checked or unchecked appropriately.
			var map_id = this.classList[1];
			add_tile_layer(BBOX_COLLECTION[map_id])
			if (this.checked) {
				$("."+this.classList[0]+"."+this.classList[1]).prop("checked",true)
			} else {
				$("."+this.classList[0]+"."+this.classList[1]).prop("checked",false)
			};
		};

		var reset_active_tile_layers = function() {
			// Does what it says, removes all actively selecte tile layers
			var ACTIVE_BEFORE_RESET = save_active_tile_layers();
			$("#undo_reset_tile_layers").removeClass("disabled");
			$("#undo_reset_tile_layers").on("click",undo_reset_active_tile_layers);
			$("#reset_tile_layers").addClass("disabled");
			$("#reset_tile_layers").off();
			for (var i = ACTIVE_TILE_COLLECTION_ITEMS.length-1; i >= 0; i--) {
				remove_tile_layer_from_map(BBOX_COLLECTION[ACTIVE_TILE_COLLECTION_ITEMS[i]]);
			};
			// controlLayers.removeFrom(map);
			// controlLayers.addTo(map);
		};

		var undo_reset_active_tile_layers = function() {
			// undoes the previous function
			// They both disable each other's buttons.
			console.log("undo function ran")
			$("#undo_reset_tile_layers").addClass("disabled");
			$("#undo_reset_tile_layers").off();
			$("#reset_tile_layers").removeClass("disabled");
			$("#reset_tile_layers").on("click",reset_active_tile_layers);
			console.log("button disabled")
			var active_tiles_binary = state_string_to_active_tiles(ACTIVE_BEFORE_RESET, data.length);
			console.log("active_tiles_binary created")
			for (var i = 0; i < active_tiles_binary.length; i++) {
				if (active_tiles_binary[i] == 1) {
					console.log("chart ID added to ACTIVE_TILE_COLLECTION_ITEMS")
					add_tile_layer(BBOX_COLLECTION[data.features[i].properties.UNIQUE_ID]);
					console.log("tile layer added")
					$(".add-to-map."+data.features[i].properties.UNIQUE_ID).prop("checked", true)
				}
			};
		};

		// End of tile layer stuff

		// Map state preservation
		var save_active_tile_layers = function() {
			// get currently active tiles
			activeTiles = [];
			for (var i = 0; i < data.features.length; i++) {
				if (isInArray(data.features[i].properties.UNIQUE_ID,ACTIVE_TILE_COLLECTION_ITEMS)) {
					activeTiles.push("1")
				} else {
					activeTiles.push("0")
				};
			};
			var activeTilesBin = BigInt(parseInt(activeTiles.join(""),2));
			var activeTiles36 = activeTilesBin.toString(36);
			return activeTiles36;
		};

		var map_state_url = function() {
			// Create a url preserving current map state.
			var activeTiles = save_active_tile_layers();
			var mapbounds = [
				map.getBounds().getNorth(),
				map.getBounds().getEast(),
				map.getBounds().getSouth(),
				map.getBounds().getWest()].join();
			var activeAtlas = getURLParameter("atlas");
			var baseURL = window.location.href.split("?")[0];
			var bookmarkURL = baseURL;
			bookmarkURL += "?atlas=" + activeAtlas;
			if (activeTiles != 0) {
				bookmarkURL += "&active=" + activeTiles;
			};
			bookmarkURL += "&mapbounds=" + mapbounds;
			return bookmarkURL;
		};

		var map_state_link = function() {
			// Takes URL and puts it into some usable HTML.
			// Currently unused, but useful.
			var stateLink = "";
			stateLink += "<a href=\"";
			stateLink += map_state_url();
			stateLink += "\">Bookmarkable link to current view</a>"
			return stateLink;
		};

		// Before you leave, the map state gets saved in cookies.
		window.onbeforeunload = function(e) {
			// Set cookie values to preserve map state
			eraseCookie();
			// get bounding box of current view
			createCookie("North",map.getBounds().getNorth(),7);
			createCookie("East",map.getBounds().getEast(),7);
			createCookie("South",map.getBounds().getSouth(),7);
			createCookie("West",map.getBounds().getWest(),7);
			createCookie("activeTiles",save_active_tile_layers(),7);
			// get current highlight
			var highlightedChart = GLOBAL_SEARCH_ID;
			createCookie("highlightedChart",highlightedChart,7);
			hopscotch.endTour(true)
			return undefined;
		};

		///////////////////////////
		// RUN DEFINED FUNCTIONS //
		///////////////////////////

		// Make the bbox collection
		bbox_collection_generator(data.features);

		// Display bounding box markers appropriately
		bbox_collection_display(BBOX_COLLECTION);

		// Refresh what's shown after zooming and dragging
		map.on('zoomend',bbox_collection_display);
		map.on('dragend',bbox_collection_display);

		// Register functions so static list contents behave.
		$("#staticList .id-link").on('click',idLink_click);
		$("#staticList .id-link").on('mouseover',function() {
			bbox_highlight_mouseover(this, "id-link");
		});
		$("#staticList .id-link").on('mouseout',function() {
			bbox_highlight_mouseout(this, "id-link")
		});
		$("#staticList .add-to-map").on("click", add_tile_layer_checkbox);

		// Update display after atlases are filtered in or out.
		$("#dynamicList .filterControl").on("click",bbox_collection_display);

		// Function so you can click on notification of tile addition to close it.
		$("#chartAddedNotification").on("click", function() {$("#chartAddedNotification").removeClass("active")})
		$("#reset_tile_layers").on("click",reset_active_tile_layers);

		// Adding controls to right of sidebar
		var marker_switch_button = "<div id=\"marker-switch\" class=\"leaflet-bar leaflet-control side-icon active\"><i class=\"fa fa-map-marker\"></i></div>";
		var bookmark_link_button = "<div id=\"bookmark-link\" class=\"leaflet-bar leaflet-control side-icon\"><i class=\"fa fa-link\"></i></div>";
		var bookmark_link_text = "<div id=\"bookmark-link-text\"><input type=\"text\" value=\"http://www.sea-atlases.org/maps/?atlas=all\"></div>"
		$(".leaflet-top.leaflet-left").append(marker_switch_button);
		$(".leaflet-top.leaflet-left").append(bookmark_link_button);
		$("#bookmark-link").append(bookmark_link_text);
		$("#marker-switch").on("click",function() {
			if (DISPLAY_MARKERS) {
				DISPLAY_MARKERS = false;
				$("#marker-switch").removeClass("active")
			} else {
				DISPLAY_MARKERS = true;
				$("#marker-switch").addClass("active")
			}
			bbox_collection_display(BBOX_COLLECTION);
		});
		$("#bookmark-link").on("click", function() {
			if ($("#bookmark-link-text").hasClass("active")) {
				$("#bookmark-link-text").removeClass("active")
			} else {
				$("#bookmark-link-text").addClass("active")
				$("#bookmark-link-text input").attr("value",map_state_url());
				$("#bookmark-link-text input")[0].setSelectionRange(0,99999);
			}
		});
		$("#bookmark-link-text").on("click",function() {
			$("#bookmark-link-text input")[0].setSelectionRange(0,99999);
		});
		// try to read cookie values for map state
		if (getURLParameter("mapbounds")!==null) {
			var mapbounds = getURLParameter("mapbounds").split(",");
			var N = mapbounds[0]
			var E = mapbounds[1]
			var S = mapbounds[2]
			var W = mapbounds[3]
		} else {
			var N = readCookie("North");
			var E = readCookie("East");
			var S = readCookie("South");
			var W = readCookie("West");
		}
		var width = $("#sidebar").width();
		if (N) {
			// if cookie has map stat info, use it
			map.fitBounds([
				[S,W],
				[N,E]
			])
		} else {
			// otherwise focus on europe
			map.fitBounds([
				[30,-10], // [south,west],
				[60,30] // [north,east]
			],{paddingTopLeft:[width,0]});
		}
	});
};
