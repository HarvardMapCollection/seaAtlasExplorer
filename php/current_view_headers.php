<?php
# True if list updates based on visible maps, false if it does not.
$dynamic_list = TRUE;
include("atlas_headers.php");

$header = '';
$header .= "<h1>In current view:</h1>\n";
$header .= "<div>\n";
if (count($active_atlases)>1) {
	$header .= "\t<input type=\"checkbox\" id=\"allAtlasesCheckbox\" class=\"filterControl\" style=\"margin:0;\" onclick=\"toggle(this)\" checked>";
	$header .= "\t<label for=\"allAtlasesCheckbox\">Select All Atlases</label>\n";
}
$header .= "</div>\n";
echo($header);

foreach ($display_list as $key => $value) {
	echo($value['header']);
	echo($value['end']);
}

echo "<script type=\"text/javascript\">var collectionList = [";
foreach ($active_atlases as $key => $value) {
	echo('"'.$value.'",');
}
echo "];</script>";
?>