// classes for icons that will open/close dropdowns
var arrowRclass = 'fa-plus-square-o';
var arrowDclass = 'fa-minus-square-o';

// cookie functions
var createCookie = function(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
var readCookie = function(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
var eraseCookie = function(name) {
	createCookie(name,"",-1);
}
var getURLParameter = function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

// Main function
function geojson_bbox(filename) {
	// Global metadata variables
	GLOBAL_SEARCH_ID = 0;
	bbox_collection = {};
	active_tile_collection_items = [];
	display_markers = true;
	// End of global metadata variables

	// Global functions
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	};
	// End of global functions

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
		} else {
			var activeTiles = readCookie("activeTiles");
		}
		state_string_to_active_tiles = function(state_string) {
			var return_value = bigInt(state_string,36)
			return_value = return_value.toString(2)
			var dataLength = data.features.length
			var reverseIndex = -1 * dataLength
			return_value = (Array(dataLength).join("0") + return_value).slice(reverseIndex)
			return return_value
		}
		if (typeof(activeTiles)!=='undefined') {
			tiles_to_activate = state_string_to_active_tiles(activeTiles);
		}

		// Functions for highlighting a given chart
		var focus_chart_map = function(bbox_collection_item) {
			// Sets map focus to given chart, represented by bbox collection item
			var width = $("#sidebar").width()
			map.fitBounds(bbox_collection_item['polygon'].getBounds(),{paddingTopLeft:[width,0]});
			bbox_collection_display();
			bbox_collection_item['polygon'].setStyle(highlightPolygonStyle);
			bbox_collection_item['marker'].setIcon(L.AwesomeMarkers.icon({
				markerColor: "red",
				icon: collectionInfo[bbox_collection_item['collection']]['atlasIcon'],
			}));
			bbox_collection_item['polygon'].addTo(map);
		};
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
				map.removeLayer(bbox_collection[GLOBAL_SEARCH_ID]['polygon']);
				bbox_collection[GLOBAL_SEARCH_ID]['polygon'].setStyle(defaultPolygonStyle)
				bbox_collection[GLOBAL_SEARCH_ID]['marker'].setIcon(L.AwesomeMarkers.icon({
					markerColor: "cadetblue",
					icon: collectionInfo[bbox_collection[GLOBAL_SEARCH_ID]['collection']]['atlasIcon'],
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
			bbox_collection[GLOBAL_SEARCH_ID]["polygon"].setStyle(defaultPolygonStyle);
			map.removeLayer(bbox_collection[GLOBAL_SEARCH_ID]["polygon"]);
			bbox_collection[GLOBAL_SEARCH_ID]["marker"].setIcon(L.AwesomeMarkers.icon({
				markerColor: "cadetblue",
				icon: collectionInfo[bbox_collection[GLOBAL_SEARCH_ID]['collection']]['atlasIcon'],
			}));
			GLOBAL_SEARCH_ID = 0;
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
			description += "<h3 class=\"chartScope\">"+bbox_collection_item['geographic_scope']+"</h3>";
			description += "<div id=\"infobox-metadata\">"
			description += "<p class=\"collectionName\"><a title=\"Library Catalog (HOLLIS) link\" href=\"http://id.lib.harvard.edu/aleph/"+bbox_collection_item.HOLLIS+"/catalog\">"+collectionInfo[bbox_collection_item['collection']]["prettyTitle"]+"</a></p>";
			description += "<p>"
			description += "<span class=\"authorName\">"
			description += collectionInfo[bbox_collection_item['collection']]["authorLastName"]
			description += ", "
			description += collectionInfo[bbox_collection_item['collection']]["authorFirstName"];
			if (collectionInfo[bbox_collection_item['collection']]["authorMiddleName"] !== "") {
				description += " "+collectionInfo[bbox_collection_item['collection']]["authorMiddleName"];
			}
			description += "</span> ("
			description += collectionInfo[bbox_collection_item['collection']]['pubYear']
			description += ")</p>";
			description += "</div>";
			if (infoboxID === "#highlightInfobox") {
				description += "<div id=\"infobox-action-items\">"
				if (isInArray(bbox_collection_item.UNIQUE_ID,active_tile_collection_items)) {
					description += "<p><input id=\"infobox_add_to_map\" type=\"checkbox\" class=\"add_to_map "+bbox_collection_item.UNIQUE_ID+" infobox-left-box\" checked>"
				} else {
					description += "<p><input id=\"infobox_add_to_map\" type=\"checkbox\" class=\"add_to_map "+bbox_collection_item.UNIQUE_ID+" infobox-left-box\">"
				};
				description += "<label for=\"infobox_add_to_map\">View chart on top of current map</label></p>"
				// description += "<p><a href=\"tiles/?chart_id="+bbox_collection_item.UNIQUE_ID+"\">View chart on new map</a></p>\n"
				if (bbox_collection_item.SEQUENCE!==null) {
					description += "<p><a href=\"http://pds.lib.harvard.edu/pds/view/"+bbox_collection_item.DRS_ID+"?n="+bbox_collection_item.SEQUENCE+"\"><i class=\"fa fa-external-link infobox-left-box\"></i>View chart in atlas</a></p>\n"
				}
				// description += "<p><a href=\"http://id.lib.harvard.edu/aleph/"+bbox_collection_item.HOLLIS+"/catalog\">Library Catalog (HOLLIS) record</a></p>\n";
				description += "<p><a href=\"http://nrs.harvard.edu/"+bbox_collection_item.URN+"\"><i class=\"fa fa-external-link infobox-left-box\"></i>Permalink</a></p>\n"
				description += "</div>"
				description += "<div id=\"resetHighlight\"><i class=\"fa fa-times\"></i></div>"
			}
			$(infoboxID).append(description);
			if (infoboxID === "#highlightInfobox") {
				$("#resetHighlight").on("click",reset_highlight);
				$("#highlightInfobox .add_to_map").on("click", add_tile_layer_checkbox)
			};
			$(infoboxID).attr("style","display:block;");
		}
		// End of functions for highlighting a given chart

		var marker_poly_duo = function(feature,container_array,i) {
			// This function establishes the elements of the chart data structure
			// Each chart is an element in an associative array, 
			// uniquely identified by a DRS ID plus "_MAPA" etc. as needed
			// Whenever you see something referencing a bbox_collection,
			// it's referencing the data structure here.
			// Properties from the source geojson are added, as well as ideal zoom levels,
			// map markers, and polygons.
			// Basically, anything you want to access about a given chart will go through
			// bbox_collection, and what's in bbox_collection is defined here.
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
			// Marker set to style partially determined by collectionInfo
			// collectionInfo is defined by atlas CSV in earlier PHP
			marker.setIcon(L.AwesomeMarkers.icon({
				markerColor: "cadetblue",
				icon: collectionInfo[feature.properties['collection']]['atlasIcon'],
			}));
			// Setting behavior for hovering over marker by both mouseover and mouseout
			marker.on('mouseover',function() {
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
				marker_poly_duo(featureList[i],bbox_collection,i);
			};
		};
		var dynamic_display = function(collection_item) {
			// Adds info section to dynamic list view for given item
			toAdd = ""
			toAdd += "<h3 class=\""+collection_item.UNIQUE_ID+" chartScope\">"
			toAdd += "<span class=\""+collection_item.UNIQUE_ID+" idLink\">"
			toAdd += "<i class=\"fa fa-map-marker\" title=\"Zoom to this sea chart\"></i>  "
			toAdd += collection_item.geographic_scope
			toAdd += "</span>"
			if (isInArray(collection_item.UNIQUE_ID,active_tile_collection_items)) {
				toAdd += "<input type=\"checkbox\" id=\"add_"+collection_item.UNIQUE_ID+"_to_map\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\" checked>"
			} else {
				toAdd += "<input type=\"checkbox\" id=\"add_"+collection_item.UNIQUE_ID+"_to_map\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\">"
			};
			toAdd += "<label for=\"add_"+collection_item.UNIQUE_ID+"_to_map\"></label>"
			toAdd += "</h3>"
			$("#"+collection_item.collection+"CurrentContent").append(toAdd)
		};
		var add_counter = function() {
			// Adds a count of how many entries are in each collection to current view list
			for (var i = collectionList.length - 1; i >= 0; i--) {
				var num_in_view = $("#"+collectionList[i]+"CurrentContent").children("h3.chartScope").length
				var num_total = $("#"+collectionList[i]+"MainContent").children("h3.chartScope").length
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
			$("#currentView .chartScope").remove()
			// clearing bookmark link
			$("#bookmark_link_text").attr("style","display:none;")
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
					if (display_markers) {
						if (notTooBig && notTooSmall && inView && isActive) {
							bbox_collection[key]['marker'].addTo(map);
							markerCounter+=1;
						}
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
			$("#currentView .idLink").on('click',idLink_click);
			$("#currentView .chartScope").on('mouseover',function() {
				bbox_highlight_mouseover(this, 'chartScope')
			});
			$("#currentView .chartScope").on('mouseout', function() {
				bbox_highlight_mouseout(this, 'chartScope')
			});
			$("#currentView .add_to_map").on("click", add_tile_layer_checkbox);
			add_counter();
			var all_chart_count = $("#bigList .chartScope").length
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
			var classes = this.classList;
			classes.remove("idLink");
			var UID = classes[0];
			classes.add("idLink");
			focus_chart(bbox_collection[UID], focus_dynamic);
			$("#highlightInfobox").empty();
			add_infobox_contents(bbox_collection[UID],"#highlightInfobox");
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
			map.addLayer(bbox_collection[UID]['polygon']);
		};
		var bbox_highlight_mouseout = function(original_this, selector_class) {
			// Unhighlight something on mouseover
			// Assumes a chart ID as first class, and a general selector also in classes.
			var classes = original_this.classList;
			classes.remove(selector_class);
			var UID = classes[0];
			classes.add(selector_class);
			if (UID !== GLOBAL_SEARCH_ID) {
				map.removeLayer(bbox_collection[UID]['polygon']);
			};
		};

		// Tile layer stuff
		var updateOpacity = function(value, layer) {
			// updates opacity, currently hooked up to transparency sliders
			layer.setOpacity(value);
		};
		var layer_description = function(collection_item, layer) {
			var desc = "";
			desc += "<div id=\""+collection_item['UNIQUE_ID']+"_starred\" class=\"selected_chart\">\n";
			desc += "<h3 class=\""+collection_item['UNIQUE_ID']+" idLink\">"
			desc += "<div class=\"awesome-marker-icon-cadetblue awesome-marker\" style=\"width: 35px; height: 45px;position: relative;float: left;\"><i class=\"atlasIcons atlasIcons-"+collectionInfo[collection_item['collection']]['atlasIcon']+" icon-white\"></i></div>";
			desc += "<span class=\"starredScope\">"+collection_item.geographic_scope+"</span>"
			desc += "<input type=\"checkbox\" id=\"selections-tab-add-"+collection_item.UNIQUE_ID+"-to-map\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\" checked>";
			desc += "<label for=\"selections-tab-add-"+collection_item.UNIQUE_ID+"-to-map\"  class=\"selection-checkbox\"></label>"
			desc += "</h3>"
			desc += "<div class=\"transparency-slider\"><label for=\""+collection_item['UNIQUE_ID']+"_slider\">Transparency:&nbsp;</label>"
			desc += '<i class=\"fa fa-circle-o\"></i>&nbsp;<input id=\"'+collection_item['UNIQUE_ID']+'_slider\" class="slide" type="range" min="0" max="1" step="0.1" value="0.7">&nbsp;<i class=\"fa fa-circle\"></i></div>'
			desc += "</div>";
			return desc
		};
		var tile_layer_desc_func_register = function(collection_item, layer) {
			$("#"+collection_item['UNIQUE_ID']+"_starred .idLink").on('click',{focus_dynamic:false},idLink_click);
			$("#"+collection_item['UNIQUE_ID']+"_starred .idLink").on('mouseover', function() {
				bbox_highlight_mouseover(this, "idLink");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .idLink").on('mouseout', function() {
				bbox_highlight_mouseout(this, "idLink");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .chartTitle").on('mouseover', function() {
				bbox_highlight_mouseover(this, "chartTitle");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .chartTitle").on('mouseout', function() {
				bbox_highlight_mouseout(this, "chartTitle");
			});
			$("#"+collection_item['UNIQUE_ID']+"_starred .subCollapsible").collapsible();
			$("#"+collection_item['UNIQUE_ID']+"_starred .add_to_map").on("click", add_tile_layer_checkbox);
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
			var returnVal = collectionInfo[bbox_collection_item.collection]['authorLastName'] + ", " + bbox_collection_item.geographic_scope;
			return returnVal;
		};
		var tile_layer_url_maker = function(bbox_collection_item) {
			// Makes a url for tile layer, for use in layer control
			var returnVal = "tiles/"+bbox_collection_item.UNIQUE_ID+"/{z}/{x}/{y}.png";
			return returnVal;
		};
		var add_tile_layer_to_map = function(bbox_collection_item) {
			// Clear bookmark link text box
			$("#bookmark_link_text").attr("style","display:none;")
			// Adds tile layer to map, checking first if it's already there.
			if ($("#"+bbox_collection_item['UNIQUE_ID']+"_starred").length === 0) {
				layerTitle = tile_layer_title_maker(bbox_collection_item);
				layerUrl = tile_layer_url_maker(bbox_collection_item);
				// Flash the notification that a chart has been added
				flash_tab_icon("#chartAddedNotification","active",2000)
				// If the tile layer is already there, remove it
				map.eachLayer(function(layer) {
					if (layer._url == layerUrl) {
						map.removeLayer(layer);
					};
				});
				// Define layer and properties
				layerProperties = {
					bounds: [[bbox_collection_item['minLat'],bbox_collection_item['minLong']],[bbox_collection_item['maxLat'],bbox_collection_item['maxLong']]],
					maxZoom: bbox_collection_item['maxZoom'],
					minZoom: bbox_collection_item['minZoom'],
					tms: true,
					opacity: 0.9,
				};
				layer_to_add = L.tileLayer(layerUrl,layerProperties);
				// Add layer description to sidebar
				desc = layer_description(bbox_collection_item,layer_to_add);
				$("#selections").append(desc);
				// Hook up js functions
				tile_layer_desc_func_register(bbox_collection_item,layer_to_add);
				// Flash add class on selection tab icon
				flash_tab_icon("#selectionsTab i","flash_add",250);
				// Add layer to map
				layer_to_add.addTo(map);
				// Add unique id to array of active tile layer IDs
				active_tile_collection_items.push(bbox_collection_item.UNIQUE_ID);
			};
		};
		var remove_tile_layer_from_map = function(bbox_collection_item) {
			layerTitle = tile_layer_title_maker(bbox_collection_item);
			layerUrl = tile_layer_url_maker(bbox_collection_item);
			// Flash the notification that a chart has been added
			map.eachLayer(function(layer) {
				if (layer._url == layerUrl) {
					map.removeLayer(layer);
				};
			});
			$("#"+bbox_collection_item.UNIQUE_ID+"_starred").remove()
			flash_tab_icon("#selectionsTab i","flash_remove",250)
			tile_id_index = $.inArray(bbox_collection_item.UNIQUE_ID, active_tile_collection_items)
			active_tile_collection_items.splice(tile_id_index, 1)
			if (bbox_collection_item.UNIQUE_ID !== GLOBAL_SEARCH_ID) {
				map.removeLayer(bbox_collection_item.polygon);
			};
			$(".add_to_map."+bbox_collection_item.UNIQUE_ID).prop("checked",false);
		};
		var add_tile_layer = function(bbox_collection_item) {
			var layer_url = "tiles/"+bbox_collection_item.UNIQUE_ID+"/{z}/{x}/{y}.png";
			var layerTitle = tile_layer_title_maker(bbox_collection_item);
			map.eachLayer(function(layer) {
				if (layer._url == layer_url) {
					map.removeLayer(layer);
				};
			});
			if ($.inArray(bbox_collection_item.UNIQUE_ID,active_tile_collection_items)==-1) {
				add_tile_layer_to_map(bbox_collection_item);
			} else {
				remove_tile_layer_from_map(bbox_collection_item);
			};
			controlLayers.removeFrom(map);
			controlLayers.addTo(map);
		}
		var add_tile_layer_checkbox = function() {
			var map_id = this.classList[1];
			add_tile_layer(bbox_collection[map_id])
			if (this.checked) {
				$("."+this.classList[0]+"."+this.classList[1]).prop("checked",true)
			} else {
				$("."+this.classList[0]+"."+this.classList[1]).prop("checked",false)
			};
		};
		var reset_active_tile_layers = function() {
			ACTIVE_BEFORE_RESET = save_active_tile_layers();
			$("#undo_reset_tile_layers").removeClass("disabled");
			$("#undo_reset_tile_layers").on("click",undo_reset_active_tile_layers);
			$("#reset_tile_layers").addClass("disabled");
			$("#reset_tile_layers").off();
			for (var i = active_tile_collection_items.length-1; i >= 0; i--) {
				remove_tile_layer_from_map(bbox_collection[active_tile_collection_items[i]]);
			};
			controlLayers.removeFrom(map);
			controlLayers.addTo(map);
		};
		var undo_reset_active_tile_layers = function() {
			console.log("undo function ran")
			$("#undo_reset_tile_layers").addClass("disabled");
			$("#undo_reset_tile_layers").off();
			$("#reset_tile_layers").removeClass("disabled");
			$("#reset_tile_layers").on("click",reset_active_tile_layers);
			console.log("button disabled")
			var active_tiles_binary = state_string_to_active_tiles(ACTIVE_BEFORE_RESET);
			console.log("active_tiles_binary created")
			for (var i = 0; i < active_tiles_binary.length; i++) {
				if (active_tiles_binary[i] == 1) {
					console.log("chart ID added to active_tile_collection_items")
					add_tile_layer(bbox_collection[data.features[i].properties.UNIQUE_ID]);
					console.log("tile layer added")
					$(".add_to_map."+data.features[i].properties.UNIQUE_ID).prop("checked", true)
				}
			};
		}
		// End of tile layer stuff

		// Map state preservation
		var save_active_tile_layers = function() {
			// get currently active tiles
			activeTiles = [];
			for (var i = 0; i < data.features.length; i++) {
				if (isInArray(data.features[i].properties.UNIQUE_ID,active_tile_collection_items)) {
					activeTiles.push("1")
				} else {
					activeTiles.push("0")
				};
			};
			activeTilesBin = bigInt(activeTiles.join(""),2)
			activeTiles36 = activeTilesBin.toString(36);
			return activeTiles36;
		};
		var map_state_url = function() {
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
			var stateLink = "";
			stateLink += "<a href=\"";
			stateLink += map_state_url();
			stateLink += "\">Bookmarkable link to current view</a>"
			return stateLink;
		}
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
			return undefined;
		};

		// Everything actually gets run
		// Make the bbox collection
		bbox_collection_generator(data.features);
		// Display bounding box markers appropriately
		bbox_collection_display(bbox_collection);
		// Refresh what's shown after zooming and dragging
		map.on('zoomend',bbox_collection_display);
		map.on('dragend',bbox_collection_display);
		// Register functions so static list contents behave.
		$("#bigList .idLink").on('click',idLink_click);
		$("#bigList .idLink").on('mouseover',function() {
			bbox_highlight_mouseover(this, "idLink");
		});
		$("#bigList .idLink").on('mouseout',function() {
			bbox_highlight_mouseout(this, "idLink")
		});
		$("#bigList .add_to_map").on("click", add_tile_layer_checkbox);
		// Update display after atlases are filtered in or out.
		$("#currentView .filterControl").on("click",bbox_collection_display);
		// Function so you can click on notification of tile addition to close it.
		$("#chartAddedNotification").on("click", function() {$("#chartAddedNotification").removeClass("active")})
		$("#reset_tile_layers").on("click",reset_active_tile_layers);

		// Adding controls to right of sidebar
		var marker_switch_button = "<div id=\"marker_switch\" class=\"leaflet-bar leaflet-control side-icon active\"><i class=\"fa fa-map-marker\"></i></div>";
		var bookmark_link_button = "<div id=\"bookmark_link\" class=\"leaflet-bar leaflet-control side-icon\"><i class=\"fa fa-link\"></i></div>";
		var bookmark_link_text = "<div id=\"bookmark_link_text\" style=\"display:none;\"><input type=\"text\" value=\"http://www.sea-atlases.org/maps/?atlas=all\"></div>"
		$(".leaflet-top.leaflet-left").append(marker_switch_button);
		$(".leaflet-top.leaflet-left").append(bookmark_link_button);
		$("#bookmark_link").append(bookmark_link_text);
		$("#marker_switch").on("click",function() {
			if (display_markers) {
				display_markers = false;
				$("#marker_switch").removeClass("active")
			} else {
				display_markers = true;
				$("#marker_switch").addClass("active")
			}
			bbox_collection_display(bbox_collection);
		});
		$("#bookmark_link").on("click", function() {
			$("#bookmark_link_text").attr("style","display:block;")
			$("#bookmark_link_text input").attr("value",map_state_url());
			$("#bookmark_link_text input")[0].setSelectionRange(0,99999);
		});
		$("#bookmark_link_text").on("click",function() {
			$("#bookmark_link_text input")[0].setSelectionRange(0,99999);
		})
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