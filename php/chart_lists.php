<?php
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
	echo("<li><a href=\"#\" class=\"".$prop['UNIQUE_ID']." idLink\">".$prop['UNIQUE_ID']." (".$prop['geographic_scope'].")</a></li>");
}
?>