<?php
# True if list updates based on visible maps, false if it does not.
$dynamic_list = FALSE;
include("atlas_headers.php");

$header = "";
if ($_GET['atlas'] == 'all') {
	$header .= "<h1><i class=\"fa fa-list\"></i> Comprehensive List</h1>";
	$header .= "<p>This is a list of all of the charts in this exhibition, grouped by atlas. It's a great way to explore the charts in the order they were presented in the atlas, but within the context of a modern map.</p>";
	$header .= "<p>The other way to view this exhibition is through the dynamic list, represented by a compass (<i class=\"fa fa-compass\" title=\"compass example\"></i>) on the tabs above. The dynamic list updates with the current view, allowing you to use the main map to find charts of specific areas.</p>";
} else {
	$header .= "<h1><i class=\"fa fa-list\"></i> Comprehensive List</h1>";
	$header .= "<p>This is a list of all of the charts in this atlas. It's a great way to explore the charts in the order they were presented in the atlas, but within the context of a modern map.</p>";
	$header .= "<p>The other way to view this exhibition is through the dynamic list, represented by a compass (<i class=\"fa fa-compass\" title=\"compass example\"></i>) on the tabs above. The dynamic list updates with the current view, allowing you to use the main map to find charts of specific areas.</p>";
}
echo($header);

$jsonFile = file_get_contents("geoJson/all_atlases.geojson");
$json = json_decode($jsonFile, TRUE);

$properties = array();

foreach ($json['features'] as $ind => $feature) {
	$properties[]= $feature['properties'];
}
$uid_sorter = array();
foreach ($properties as $key => $value) {
	$drs_sorter[$key] = $value['UNIQUE_ID'];
}
array_multisort($properties,SORT_ASC,$uid_sorter);
foreach ($properties as $ind => $prop) {
	if (in_array($prop["collection"],$active_atlases)) {
		$entry = "";
		$entry .= "<h3 class=\"chart-scope\">";
		$entry .= "<span  class=\"".$prop["UNIQUE_ID"]." id-link\">";
		$entry .= "<i class=\"fa fa-map-marker\" title=\"Zoom to this sea chart\"></i>  ";
		$entry .= $prop['geographic_scope'];
		$entry .= "</span>";
		$entry .= "<input type=\"checkbox\" id=\"static_list_add_".$prop['UNIQUE_ID']."_to_map\" class=\"add-to-map ".$prop["UNIQUE_ID"]."\"><label for=\"static_list_add_".$prop['UNIQUE_ID']."_to_map\"></label>";
		$entry .= "</h3>";
		# $entry .= "<div class=\"bigListCollapsible collapseL2\">";
		/*$entry .= "<div class=\"".$prop["UNIQUE_ID"]."_details\">\n<ul>\n";
		$entry .= "<li><input type=\"checkbox\" class=\"add-to-map\" id=\"add|".$prop["UNIQUE_ID"]."\">";
		$entry .= "<label for=\"add_".$prop["UNIQUE_ID"]."\">View chart on top of current map</label></li>\n";
		$entry .= "<li><a href=\"tiles/?chart_id=".$prop["UNIQUE_ID"]."\">View chart on top of new map</a></li>\n";
		if (is_null($prop['SEQUENCE'])==FALSE) {
			$entry .= "<li><a href=\"http://pds.lib.harvard.edu/pds/view/".$prop["DRS_ID"]."?n=".$prop["SEQUENCE"]."\">View chart in atlas</a></li>\n";
		}
		$entry .= "<li><a href=\"http://id.lib.harvard.edu/aleph/".$prop["HOLLIS"]."/catalog\">Library Catalog (HOLLIS) record</a></li>\n";
		$entry .= "<li><a href=\"http://nrs.harvard.edu/".$prop["URN"]."\">Permalink</a></li>\n";
		$entry .= "</ul>\n</div>\n";
		$entry .= "</div>";*/
		#$entry .= "<li><a href=\"#\" class=\"".$prop['UNIQUE_ID']." id-link\">".$prop['UNIQUE_ID']." (".$prop['geographic_scope'].")</a></li>";
		$display_list[$prop['collection']]['entries'][] = $entry;
	}
}
foreach ($display_list as $key => $value) {
	echo($value['header']);
	foreach ($value['entries'] as $item) {
		echo($item);
	}
	echo($value['end']);
}
?>