<?php
error_reporting(E_ALL);
# The following creates an array called $csv_array based on an input csv.
# The resulting array can be accessed by row and column name like so:
# $csv_array[`row_number`][`column_name`]
$input_csv = __DIR__."/atlas_metadata.csv";
$csv_array = $fields = array(); $i = 0;
$handle = @fopen($input_csv, "r");
if ($handle) {
	while (($row = fgetcsv($handle, 4096)) !== false) {
		# $fields holds the row names, and uses the first row of the CSV
		if (empty($fields)) {
			$fields = $row;
			continue;
		}
		foreach ($row as $k=>$value) {
			# This is where the array values get set
			$csv_array[$i][$fields[$k]] = $value;
		}
		$i++;
	}
	if (!feof($handle)) {
		echo "Error: unexpected fgets() fail\n";
	}
	fclose($handle);
}
$display_list = array();
foreach ($csv_array as $index => $row) {
	$display_list[$row["IDENTIFIER"]] = array();
	$display_list[$row["IDENTIFIER"]]['header'] = "";
	$display_list[$row["IDENTIFIER"]]['end'] = "";
	$display_list[$row["IDENTIFIER"]]['entries'] = array();
	#$display_list[$row["IDENTIFIER"]]['header'] .= "<input id=\"".$row["IDENTIFIER"]."_checkbox\" type=\"checkbox\" class=\"filterControl\" value=\"".$row["IDENTIFIER"]."\"/>\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t<div class=\"collapsible collapseL1\">\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t<h2>\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t\t<span class=\"arrow arrow-r\"></span>\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t\t<span>".$row["TITLE"]." (".$row["AUTHOR_LAST_NAME"].", ".$row["PUB_YEAR"].") </span>\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t\t<span id=\"".$row["IDENTIFIER"]."Counter\" class=\"counter\"></span>\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t</h2>\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t<div id=\"".$row["IDENTIFIER"]."CurrentContent\">\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t\t<div class=\"atlasDescription\">\n";
	$display_list[$row["IDENTIFIER"]]['header'] .= "\t\t\t\t\t\t\t\t<p>".$row["DESCRIPTION"]."</p>\n";
	$display_list[$row["IDENTIFIER"]]['end'] .= "\t\t\t\t\t\t\t</div>\n";
	$display_list[$row["IDENTIFIER"]]['end'] .= "\t\t\t\t\t\t</div>\n";
	$display_list[$row["IDENTIFIER"]]['end'] .= "\t\t\t\t\t</div>\n";
}
$jsonFile = file_get_contents("geoJson/all_atlases.geojson");
$json = json_decode($jsonFile, TRUE);

$properties = array();

foreach ($json['features'] as $ind => $feature) {
	$properties[]= $feature['properties'];
	#echo("<li><a href=\"#\" class=\"idLink\" id=\"".$feature['properties']['fname']."\">".$feature['properties']['collection']."</a></li>");
}
$drs_sorter = array();
foreach ($properties as $key => $value) {
	$drs_sorter[$key] = $value['DRS_ID'];
}
array_multisort($properties,SORT_ASC,$drs_sorter);
foreach ($properties as $ind => $prop) {
	$entry = "";
	$entry .= "<div class=\"bigListCollapsible collapseL2\">";
	$entry .= "<h3 class=\"".$prop["UNIQUE_ID"]."\"><span class=\"arrow arrow-r\"></span>".$prop["geographic_scope"];
	$entry .=" <a href=\"#\" class=\"".$prop["UNIQUE_ID"]." idLink\"><i class=\"fa fa-map-marker\"></i></a>";
	$entry .= "</h3>\n";
	$entry .= "<div id=\"".$prop["UNIQUE_ID"]."_details\">\n<ul>\n";
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
foreach ($display_list as $key => $value) {
	echo($value['header']);
	foreach ($value['entries'] as $item) {
		echo($item);
	}
	echo($value['end']);
}
?>