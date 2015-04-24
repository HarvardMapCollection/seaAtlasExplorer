<?php
$jsonFile = file_get_contents("geoJson/all_atlases.geojson");
$json = json_decode($jsonFile, TRUE);

foreach ($json['features'] as $ind => $feature) {
	foreach ($feature['properties'] as $key => $value) {
		if ($key=="fname") {
			echo("<li>".substr($value,0,8)."</li>");
		}
	}
}
?>