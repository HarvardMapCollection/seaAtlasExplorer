<?php
# True if list updates based on visible maps, false if it does not.
$dynamic_list = TRUE;
include("atlas_headers.php");

$header = '';
$header .= "<h1>Charts in the current view:</h1>\n";
$header .= "<p>This list updates based on the portion of the map being displayed. For a list of everything in the entire exhibit, click the list icon to the left.</p>\n";
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
echo "];\n";
echo "collectionInfo = {";
foreach ($csv_array as $index => $row) {
	echo("\"".$row["IDENTIFIER"]."\":{
		\"prettyTitle\":\"".$row["TITLE"]."\",
		\"authorFirstName\":\"".$row["AUTHOR_FIRST_NAME"]."\",
		\"authorMiddleName\":\"".$row["AUTHOR_MIDDLE_NAME"]."\",
		\"authorLastName\":\"".$row["AUTHOR_LAST_NAME"]."\",
		\"pubYear\":\"".$row["PUB_YEAR"]."\"},");
}
echo "};";
echo "</script>";
?>