import { atlas_metadata } from "./atlas_metadata.js";

/**
 * @param {object} row 
 * @returns {string}
 * Returns the html for a div with an icon to represent an atlas
 */
function atlas_icon(row) {
    var html = `
        <div class="awesome-marker-icon-cadetblue awesome-marker" style="width: 35px; height: 45px;position: relative;float: left;">
            <i class="atlasIcons atlasIcons-${row["atlasIcon"]} icon-white\"></i>
        </div>`
    return html;
}

/**
 * @param {object} row 
 * @returns {string}
 * Returns the html to present a checkbox to select all of the atlases in a 
 * collection. This should only appear in the dynamic list of atlases, not the
 * static list.
 */
function atlas_select_all(row) {
    var html = `
        <div class="selection-checkbox">
            <input id="${row["identifier"]}_checkbox" type="checkbox" class="filterControl" value="${row["identifier"]}" checked/>
            <label for="${row["identifier"]}_checkbox"></label>
        </div>`
    return html;
}

/**
 * @param {object} row 
 * @returns {string}
 * Returns the html skeleton for a counter showing how many charts are 
 * currently visible out of the total count.
 */
function atlas_counter(row) {
    var html = `<span id="${row['identifier']}Counter" class="counter"></span>`;
    return html;
}

/**
 * @param {object} row 
 * @param {boolean} dynamic 
 * @returns {string}
 * Returns the html for the always-visible header for an atlas, containing the
 * title and author name, as well as the count of visible charts are visible
 * out of the total in the atlas.
 */
function atlas_heading(row, dynamic) {
    var authorDisplayName = `${row['authorLastName']}, ${row['authorFirstName']} ${(row['authorMiddleName']) ? row['authorMiddleName'] : ""}`.trim();
    var html = `
        <div>
            <span class=\"arrow fa fa-plus-square-o\"></span>
            <h2>${row['title']}</h2>
            <h3>${authorDisplayName}, ${row['pubYear']}</h3>
            ${(dynamic) ? atlas_counter(row) : ""}
        </div>`
    return html;
}

/**
 * @param {object} row 
 * @param {boolean} dynamic 
 * @returns {string}
 * Returns the html for the descriptive text for an atlas. This should only be 
 * visible when the details for the atlas are expanded, which would also make 
 * the list of charts within the atlas visible.
 */
function atlas_description(row, dynamic) {
    var html = `
        <div id="${row['identifier']}${(dynamic) ? "Dynamic" : "Static"}Content>
            <div class="atlasDescription">
                <p>${row['description']}</p>
                <p><a href="https://id.lib.harvard.edu/aleph/${row['hollisNo']}/catalog">View this atlas in the Library Catalog (HOLLIS)</a></p>
                <p class="view-chart-column-label">View chart</p>
            </div>
        </div>`
    return html;
}

/**
 * @param {object} row 
 * @param {boolean} dynamic 
 * @returns {string}
 * Returns the HTML representing an atlas within either the static or dynamic 
 * sidebar lists. The `dynamic` variable indicates which sidebar list is being 
 * generated.
 */
function atlas_skeleton(row, dynamic) {
    var html = `
            ${atlas_icon(row)}
            ${(dynamic) ? atlas_select_all(row) : ""}
            <div id=${row['identifier']}${(dynamic) ? "Dynamic" : "Static"} class="collapsible collapseL1">
                ${atlas_heading(row, dynamic)}
                ${atlas_description(row, dynamic)}
            </div>`
    return html;
}

var dynamic_header = `
<h1><i class=\"fa fa-compass\"></i> Current View</h1>
<p>This list updates based on the portion of the map being displayed. You can 
navigate the map to the right to focus on an area, and use this tab to find 
charts in that area.</p>
<p>For a list of all charts in this exhibit, click the list icon (
<i class=\"fa fa-list\" title=\"list icon example\"></i>) on the tabs above.</p>
<div id=\"allAtlasesCheckboxContainer\">
<input type=\"checkbox\" id=\"allAtlasesCheckbox\" class=\"filterControl\" style=\"margin:0;\" onclick=\"toggle(this)\" checked>
<label for=\"allAtlasesCheckbox\">Select All Atlases</label>
</div>`

var static_header = `
<h1><i class=\"fa fa-list\"></i> Comprehensive List</h1>
<p>This is a list of all of the charts in this exhibition, grouped by atlas. 
It's a great way to explore the charts in the order they were presented in the 
atlas, but within the context of a modern map.</p>
<p>The other way to view this exhibition is through the dynamic list, 
represented by a compass (<i class=\"fa fa-compass\" title=\"compass example\"></i>) 
on the tabs above. The dynamic list updates with the current view, allowing you 
to use the main map to find charts of specific areas.</p>
`

/**
 * @param {object} metadata 
 * @param {boolean} dynamic 
 * @returns {string}
 * Sets up a skeleton structure for either the dynamic sidebar pane (titled 
 * "Current View") or the static sidebar pane (titled "Comprehensive View"). 
 * Set the value of `dynamic` to true for the dynamic view, and to false for 
 * the static view.
 */
export function sidebar_skeleton(dynamic) {
    var content = (dynamic) ? dynamic_header : static_header;
    for (const key in atlas_metadata) {
        if (Object.hasOwnProperty.call(atlas_metadata, key)) {
            const row = atlas_metadata[key];
            content = content.concat(atlas_skeleton(row, dynamic));
        }
    };
    return content;
}
