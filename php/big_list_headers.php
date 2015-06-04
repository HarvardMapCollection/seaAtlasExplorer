<?php
# True if list updates based on visible maps, false if it does not.
$dynamic_list = FALSE;
include("atlas_headers.php");

$header = "";
if ($_GET['atlas'] == 'all') {
	$header .= "<h1>The Entire Collection</h1>";
	$header .= "<p>The following is a complete list of our collection of Sea Atlases.</p>";
} else {
	$header .= "<h1>Static List</h1>";
	$header .= "<p>This list of charts will not change based on the map view</p>";
}
echo($header);

$jsonFile = file_get_contents("geoJson/all_atlases.geojson");
$json = json_decode($jsonFile, TRUE);

$properties = array();

foreach ($json['features'] as $ind => $feature) {
	$properties[]= $feature['properties'];
}
$drs_sorter = array();
foreach ($properties as $key => $value) {
	$drs_sorter[$key] = $value['DRS_ID'];
}
array_multisort($properties,SORT_ASC,$drs_sorter);
foreach ($properties as $ind => $prop) {
	if (in_array($prop["collection"],$active_atlases)) {
		$entry = "";
		$entry .=" <a href=\"#\" class=\"".$prop["UNIQUE_ID"]." idLink\"><i class=\"fa fa-map-marker\"></i></a>";
		$entry .= "<div class=\"bigListCollapsible collapseL2\">";
		$entry .= "<h3 class=\"".$prop["UNIQUE_ID"]."\"><span class=\"arrow arrow-r\"></span>".$prop["geographic_scope"];
		$entry .= "</h3>\n";
		$entry .= "<div class=\"".$prop["UNIQUE_ID"]."_details\">\n<ul>\n";
		$entry .= "<li><a href=\"".$prop["UNIQUE_ID"]."\">Georeferenced map</a></li>\n";
		$entry .= "<li><a href=\"http://pds.lib.harvard.edu/pds/view/".$prop["DRS_ID"]."?n=".$prop["SEQUENCE"]."\">View original image in Harvard Page Delivery Service</a></li>\n";
		$entry .= "<li><a href=\"http://id.lib.harvard.edu/aleph/".$prop["HOLLIS"]."/catalog\">Library Catalog (HOLLIS) record</a></li>\n";
		$entry .= "<li><a href=\"http://nrs.harvard.edu/".$prop["URN"]."\">Stable link</a></li>\n";
		$entry .= "<li><input type=\"checkbox\" class=\"add_to_map\" id=\"add|".$prop["UNIQUE_ID"]."\">";
		$entry .= "<label for=\"add_".$prop["UNIQUE_ID"]."\">Include in current view?</label></li>\n";
		$entry .= "</ul>\n</div>\n";
		$entry .= "</div>";
		#$entry .= "<li><a href=\"#\" class=\"".$prop['UNIQUE_ID']." idLink\">".$prop['UNIQUE_ID']." (".$prop['geographic_scope'].")</a></li>";
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