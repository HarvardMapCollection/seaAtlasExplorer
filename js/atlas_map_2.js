var arrowRclass = 'fa-plus-square-o';
var arrowDclass = 'fa-minus-square-o';

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
	L.AwesomeMarkers.Icon.prototype.options.prefix = 'atlasIcons';
	var defaultMarkerIcon = L.AwesomeMarkers.icon({
		markerColor: "cadetblue",
		icon: "Wa",
	});
	var highlightMarkerIcon = L.AwesomeMarkers.icon({
		markerColor: "red",
		icon: "Wa",
	});
	// End of style definitions

	// Global functions
	function isInArray(value, array) {
		return array.indexOf(value) > -1;
	};
	// End of global functions
	bbox_collection = {};
	active_tile_collection_items = [];
	$.getJSON($('link[rel="polygons"]').attr("href"), function(data) {
		// Everything under this function should be using the geoJSON data in some way
		// Stuff that isn't dependent on geoJSON data (features, layers, etc.) can be defined elsewhere
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
			var focus_dynamic = typeof focus_dynamic !== 'undefined' ? focus_dynamic : true;
			if (focus_dynamic) {} else {};
		};
		var focus_chart = function(bbox_collection_item, focus_dynamic) {
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
		var add_infobox_contents = function(collection_item,infoboxID) {
			// Adds description based on bbox collection to element with ID infoboxID
			var description = "";
			description += "<h3 class=\"chartScope\">"+collection_item['geographic_scope']+"</h3>";
			description += "<p class=\"collectionName\">"+collectionInfo[collection_item['collection']]["prettyTitle"]+"</p>";
			description += "<p class=\"authorName\">"
			description += collectionInfo[collection_item['collection']]["authorLastName"]
			description += ", "
			description += collectionInfo[collection_item['collection']]["authorFirstName"];
			if (collectionInfo[collection_item['collection']]["authorMiddleName"] !== "") {
				description += " "+collectionInfo[collection_item['collection']]["authorMiddleName"];
			}
			description += "</p>";
			if (infoboxID === "#highlightInfobox") {
				if (isInArray(collection_item.UNIQUE_ID,active_tile_collection_items)) {
					description += "<p><input type=\"checkbox\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\" checked>"
				} else {
					description += "<p><input type=\"checkbox\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\">"
				};
				description += "View chart on top of current map</p>"
				description += "<p><a href=\"tiles/?chart_id="+collection_item.UNIQUE_ID+"\">View chart on new map</a></p>\n"
				if (collection_item.SEQUENCE!==null) {
					description += "<p><a href=\"http://pds.lib.harvard.edu/pds/view/"+collection_item.DRS_ID+"?n="+collection_item.SEQUENCE+"\">View chart in atlas</a></p>\n"
				}
				description += "<p><a href=\"http://id.lib.harvard.edu/aleph/"+collection_item.HOLLIS+"/catalog\">Library Catalog (HOLLIS) record</a></p>\n";
				description += "<p><a href=\"http://nrs.harvard.edu/"+collection_item.URN+"\">Permalink</a></p>\n"
				description += "<div id=\"resetHighlight\"><i class=\"fa fa-times\"></i></div>"
			}
			$(infoboxID).append(description);
			if (infoboxID === "#highlightInfobox") {
				$("#resetHighlight").on("click",reset_highlight);
				$("#highlightInfobox .add_to_map").on("click", add_tile_layer_checkbox)
			};
			$(infoboxID).attr("style","display:block;");
		}
		var marker_poly_duo = function(feature,container_array,i) {
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
			marker.setIcon(L.AwesomeMarkers.icon({
				markerColor: "cadetblue",
				icon: collectionInfo[feature.properties['collection']]['atlasIcon'],
			}));
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
			if (tiles_to_activate) {
				if (tiles_to_activate[i] == 1) {
					add_tile_layer(container_array[UID])
				}
			}
		};
		// figuring out which tiles to activate
		var activeTiles = readCookie("activeTiles");
		if (activeTiles) {
			console.log(activeTiles)
			tiles_to_activate = bigInt(activeTiles,36)
			tiles_to_activate = tiles_to_activate.toString(2)
			dataLength = data.features.length
			console.log(dataLength)
			reverseIndex = -1 * dataLength
			console.log(reverseIndex)
			tiles_to_activate = (Array(dataLength).join("0") + tiles_to_activate).slice(reverseIndex)
			console.log(tiles_to_activate)
		}
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
				toAdd += "<input type=\"checkbox\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\" checked>"
			} else {
				toAdd += "<input type=\"checkbox\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\">"
			};
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
			// What happens when you mouse over a sidebar map marker:
			// The corresponding bounding box is shown
			var classes = original_this.classList;
			classes.remove(selector_class);
			var UID = classes[0];
			classes.add(selector_class);
			map.addLayer(bbox_collection[UID]['polygon']);
		};
		var bbox_highlight_mouseout = function(original_this, selector_class) {
			// What happens when you mouse out of a sidebar map marker:
			// The corresponding bounding box is removed if not highlighted
			var classes = original_this.classList;
			classes.remove(selector_class);
			var UID = classes[0];
			classes.add(selector_class);
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

		var updateOpacity = function(value, layer) {
			layer.setOpacity(value);
		};
		var layer_description = function(collection_item, layer) {
			var desc = "";
			desc += "<div id=\""+collection_item['UNIQUE_ID']+"_starred\">\n";
			desc += "<h3 class=\""+collection_item['UNIQUE_ID']+" idLink\">"
			desc += "<span class=\"iconBG\"><i class=\"atlasIcons atlasIcons-"+collectionInfo[collection_item['collection']]['atlasIcon']+"\"></i></span>"
			desc += "<span class=\"starredScope\">"+collection_item.geographic_scope+"</span>"
			desc += "<input type=\"checkbox\" class=\"add_to_map "+collection_item.UNIQUE_ID+"\" checked>";
			desc += "</h3>"
			desc += "<label for=\""+collection_item['UNIQUE_ID']+"_slider\">Transparency: </label>"
			desc += '<input id=\"'+collection_item['UNIQUE_ID']+'_slider\" class="slide" type="range" min="0" max="1" step="0.1" value="0.7">'
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
			$(selector).addClass(flash_class);setTimeout(function() {$(selector).removeClass(flash_class);},time);
		};
		var add_tile_layer = function(bbox_collection_item) {
			var layer_url = "tiles/"+bbox_collection_item.UNIQUE_ID+"/{z}/{x}/{y}.png";
			var layerTitle = bbox_collection_item.collection + ", " + bbox_collection_item.geographic_scope;
			map.eachLayer(function(layer) {
				if (layer._url == layer_url) {
					map.removeLayer(layer);
				};
			});
			if ($.inArray(bbox_collection_item.UNIQUE_ID,active_tile_collection_items)==-1) {
				console.log("Layer not active, activating.")
				if ($("#"+bbox_collection_item['UNIQUE_ID']+"_starred").length === 0) {
					flash_tab_icon("#chartAddedNotification","active",2000)
					map.eachLayer(function(layer) {
						if (layer._url == layer_url) {
							map.removeLayer(layer);
						};
					});
					layerProperties = {
						bounds: [[bbox_collection_item['minLat'],bbox_collection_item['minLong']],[bbox_collection_item['maxLat'],bbox_collection_item['maxLong']]],
						maxZoom: bbox_collection_item['maxZoom'],
						minZoom: bbox_collection_item['minZoom'],
						tms: true,
						opacity: 0.9,
					};
					layer_to_add = L.tileLayer(layer_url,layerProperties);
					overlayMaps[layerTitle] = layer_to_add;
					desc = layer_description(bbox_collection_item,layer_to_add);
					$("#selections").append(desc);
					tile_layer_desc_func_register(bbox_collection_item,layer_to_add);
					flash_tab_icon("#selectionsTab i","flash_add",250);
					layer_to_add.addTo(map);
					active_tile_collection_items.push(bbox_collection_item.UNIQUE_ID);
				}
			} else {
				console.log("Layer already active, deactivating")
				delete overlayMaps[layerTitle];
				$("#"+bbox_collection_item.UNIQUE_ID+"_starred").remove()
				flash_tab_icon("#selectionsTab i","flash_remove",250)
				console.log($.inArray(bbox_collection_item.UNIQUE_ID,active_tile_collection_items))
				active_tile_collection_items.splice($.inArray(bbox_collection_item.UNIQUE_ID,active_tile_collection_items),1)
			};
			controlLayers.removeFrom(map);
			controlLayers = L.control.layers(baseMaps,overlayMaps)
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
		window.onbeforeunload = function(e) {
			// Set cookie values to preserve map state
			eraseCookie();
			// get bounding box of current view
			createCookie("North",map.getBounds().getNorth(),7);
			createCookie("East",map.getBounds().getEast(),7);
			createCookie("South",map.getBounds().getSouth(),7);
			createCookie("West",map.getBounds().getWest(),7);
			// get currently active tiles
			activeTiles = [];
			for (var i = 0; i < data.features.length; i++) {
				if (isInArray(data.features[i].properties.UNIQUE_ID,active_tile_collection_items)) {
					activeTiles.push("1")
				} else {
					activeTiles.push("0")
				};
			};
			console.log(activeTiles.join(""));
			activeTilesBin = bigInt(activeTiles.join(""),2)
			activeTilesHex = activeTilesBin.toString(36);
			console.log(activeTilesHex);
			createCookie("activeTiles",activeTilesHex,7);
			// get current highlight
			var highlightedChart = GLOBAL_SEARCH_ID;
			createCookie("highlightedChart",highlightedChart,7);
			return undefined;
		}
		bbox_collection_generator(data.features);
		bbox_collection_display(bbox_collection);
		map.on('zoomend',bbox_collection_display);
		map.on('dragend',bbox_collection_display);
		$("#bigList .idLink").on('click',idLink_click);
		$("#bigList .idLink").on('mouseover',function() {
			bbox_highlight_mouseover(this, "idLink");
		});
		$("#bigList .idLink").on('mouseout',function() {
			bbox_highlight_mouseout(this, "idLink")
		});
		$("#bigList .chartTitle").on('mouseover',chartTitle_mouseover);
		$("#bigList .chartTitle").on('mouseout',chartTitle_mouseout);
		$("#currentView .filterControl").on("click",bbox_collection_display);
		$("#bigList .add_to_map").on("click", add_tile_layer_checkbox);
		$("#chartAddedNotification").on("click", function() {$("#chartAddedNotification").removeClass("active")})
		var N = readCookie("North");
		var E = readCookie("East");
		var S = readCookie("South");
		var W = readCookie("West");
		var width = $("#sidebar").width();
		if (N) {
			map.fitBounds([
				[S,W],
				[N,E]
			])
		} else {
			map.fitBounds([
				[30,-10], // [south,west],
				[60,30] // [north,east]
			],{paddingTopLeft:[width,0]});
		}
	});
};