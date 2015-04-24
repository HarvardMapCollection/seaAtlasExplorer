<?php
$jsonFile = file_get_contents("geoJson/all_atlases.geojson");
$json = json_decode($jsonFile, TRUE);

foreach ($json['features'] as $ind => $feature) {
	echo("<li><a href=\"#\" class=\"idLink\" id=\"".$feature['properties']['fname']."\">".$feature['properties']['collection']."</a></li>");
}
?>