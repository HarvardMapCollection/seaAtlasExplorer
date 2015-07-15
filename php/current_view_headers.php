<?php
# True if list updates based on visible maps, false if it does not.
$dynamic_list = TRUE;
include("atlas_headers.php");

$header = '';
$header .= "<h1><i class=\"fa fa-compass\"></i> Current View</h1>\n";
$header .= "<p>This list updates based on the portion of the map being displayed. You can navigate the map to the right to focus on an area, and use this tab to find charts in that area.</p>";
$header .= "<p>For a list of all charts in this exhibit, click the list icon (<i class=\"fa fa-list\" title=\"list icon example\"></i>) on the tabs above.</p>\n";
$header .= "<div id=\"allAtlasesCheckboxContainer\">\n";
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
echo "];\n";
echo "collectionInfo = {";
foreach ($csv_array as $index => $row) {
	echo("\"".$row["IDENTIFIER"]."\":{
		\"prettyTitle\":\"".$row["TITLE"]."\",
		\"authorFirstName\":\"".$row["AUTHOR_FIRST_NAME"]."\",
		\"authorMiddleName\":\"".$row["AUTHOR_MIDDLE_NAME"]."\",
		\"authorLastName\":\"".$row["AUTHOR_LAST_NAME"]."\",
		\"atlasIcon\":\"".$row["ICON"]."\",
		\"pubYear\":\"".$row["PUB_YEAR"]."\"},");
}
echo "};";
echo "</script>";
?>