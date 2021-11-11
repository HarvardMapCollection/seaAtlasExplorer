/**
 * 
 * @param {str} state_string 
 * @param {object} data 
 * @returns 
 * Given a state string, which is a hexadecimal number representing a base-2 
 * number of the same length as the given `data`, returns an array representing 
 * which items in the `data` array should be active
 */
export function state_string_to_active_tiles(state_string, target_length) {

    // parse the state string as a base-36 integer
    var baseTenInt = BigInt(parseInt(state_string, 36));

    // converts the integer to a string, representing it in base-2
    var binaryString = baseTenInt.toString(2);

    // return that string, padded to match the length of the data
    return binaryString.padStart(target_length, "0");
}


export function focus_chart_map(bounds, sidebar_width, active_polygon_style, active_marker_icon, map) {
    // Sets map focus to given chart, represented by bbox collection item
    map.fitBounds(bounds, { paddingTopLeft: [sidebar_width, 0] });
    bbox_collection_display();
    bbox_collection_item['polygon'].setStyle(active_polygon_style);
    bbox_collection_item['marker'].setIcon(active_marker_icon);
    bbox_collection_item['polygon'].addTo(map);
}

// Adding new marker layers and dynamic display contents
function CollectionIsActive(collection) {
    // Checks if a given atlas is active based on sidebar state
    if ($("#" + collection + "_checkbox").is(":checked")) {
        return true;
    } else {
        if ($("#currentView > .collapseL1").length === 1 && $("#currentView > #" + collection + "CurrentHeading").length === 1) {
            return true;
        } else {
            return false;
        };
    }
};

/**
 * Displays map markers and sidebar items somewhat intelligently.
 * Map markers are displayed if the ideal zoom of their polygon is within one 
 * zoom level of the current map zoom level.
 * Sidebar list items are displayed if the bounding boxes they represent are 
 * within the current view and have an ideal zoom smaller than the current zoom 
 * level.
 */
function bbox_collection_display() {
    // Clearing map layers that aren't tiles
    map.eachLayer(function (layer) {
        if ('_tiles' in layer) { } else {
            map.removeLayer(layer);
        };
    });

    // Clearing dynamic display contents
    $("#currentView .chart-scope").remove();

    // clearing bookmark link
    $("#bookmark-link-text").removeClass("active");

    var markerCounter = 0;
    for (var key in BBOX_COLLECTION) {
        if (isInArray(BBOX_COLLECTION[key]['collection'], collectionList)) {
            var z = map.getZoom();
            var notTooSmall = BBOX_COLLECTION[key]['idealZoom'] <= z + 1;
            var notTooBig = BBOX_COLLECTION[key]['idealZoom'] >= z - 1;
            var inView = map.getBounds().contains(BBOX_COLLECTION[key]['marker'].getLatLng());
            var isActive = collectionIsActive(BBOX_COLLECTION[key]['collection']);
            if (DISPLAY_MARKERS) {
                if (notTooBig && notTooSmall && inView && isActive) {
                    BBOX_COLLECTION[key]['marker'].addTo(map);
                    markerCounter += 1;
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
    $("#currentView .id-link").on('click', idLink_click);
    $("#currentView .chart-scope").on('mouseover', function () {
        bbox_highlight_mouseover(this, 'chart-scope');
    });
    $("#currentView .chart-scope").on('mouseout', function () {
        bbox_highlight_mouseout(this, 'chart-scope');
    });
    $("#currentView .add-to-map").on("click", add_tile_layer_checkbox);
    add_counter();
    var all_chart_count = $("#bigList .chart-scope").length;
    $("#chartCount").text(markerCounter + "/" + all_chart_count + " charts visible right now.");
};