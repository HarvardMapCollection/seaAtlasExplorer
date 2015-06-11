<?php
# The following creates an array from the all_atlases geojson file
$jsonFile = file_get_contents("../geoJson/all_atlases.geojson");
$json = json_decode($jsonFile, TRUE);
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
foreach ($json['features'] as $ind => $feature) {
	if ($feature['properties']['UNIQUE_ID']==$chart_id) {
		$active_feature = $feature;
	}
}
foreach ($csv_array as $ind => $row) {
	if ($row['IDENTIFIER'] == $active_feature['properties']['collection']) {
		$active_atlas = $row;
	}
}
$title = $active_atlas['TITLE']." | ".$active_feature['properties']['geographic_scope'];
$geojson_file = "<link rel=\"polygon\" type=\"application/json\" href=\"../geoJson/".$active_feature['properties']['UNIQUE_ID'].".geojson\">";
$pretty_collection = $active_atlas['TITLE'];
$author_name = $active_atlas['AUTHOR_FIRST_NAME'];
if ($active_atlas['AUTHOR_MIDDLE_NAME']!="") {
	$author_name.= " ".$active_atlas['AUTHOR_MIDDLE_NAME'];
}
$author_name .= " ".$active_atlas['AUTHOR_LAST_NAME'];
$geographic_scope = $active_feature['properties']['geographic_scope'];
if ($active_feature['properties']['SEQUENCE']!="") {
	$pds_link = "<p><a href=\"http://pds.lib.harvard.edu/pds/view/".$active_feature['properties']['DRS_ID']."?n=".$active_feature['properties']['SEQUENCE']."\">View chart in atlas</a></p>";
} else {$pds_link = "";}
$hollis_link = "<p><a href=\"http://id.lib.harvard.edu/aleph/".$active_feature['properties']['HOLLIS']."/catalog\">Library catalog (Hollis) record</a></p>";
$urn_link = "<p><a href=\"http://nrs.harvard.edu/".$active_feature['properties']['URN']."\">Stable link to image</a></p>";
$tile_layer = "<script type=\"text/javascript\">var rasterLayer = L.tileLayer('".$active_feature['properties']['UNIQUE_ID']."/{z}/{x}/{y}.png', {
		opacity: 0.7,
		bounds: [[".$active_feature['properties']['minLat'].", ".$active_feature['properties']['minLong']."],[".$active_feature['properties']['maxLat'].", ".$active_feature['properties']['maxLong']."]],
		minZoom: ".$active_feature['properties']['minZoom'].",
		maxZoom: ".$active_feature['properties']['maxZoom'].",
		tms: true
	});</script>"
?>