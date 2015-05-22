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
function get_identifier($x) {return $x['IDENTIFIER'];}
$active_atlases = explode(",",$_GET['atlas']);
if (in_array("all",$active_atlases)) {
	$active_atlases = array_map('get_identifier',$csv_array);
}

$header = '';
$header .= "<h1>In current view:</h1>\n";
$header .= "<div>\n";
if (count($active_atlases)>1) {
	$header .= "\t<input type=\"checkbox\" id=\"allAtlasesCheckbox\" class=\"filterControl\" style=\"margin:0;\" onclick=\"toggle(this)\" checked>";
	$header .= "\t<label for=\"allAtlasesCheckbox\">Select All Atlases</label>\n";
}
$header .= "</div>\n";
echo($header);

foreach ($csv_array as $index => $row) {
	if (in_array($row['IDENTIFIER'],$active_atlases)) {
		if (count($active_atlases)>1) {
			echo("<input id=\"".$row["IDENTIFIER"]."_checkbox\" type=\"checkbox\" class=\"filterControl\" value=\"".$row["IDENTIFIER"]."\" checked/>\n");
		}
		echo("\t\t\t\t\t<div id=\"currentViewContent\" class=\"collapsible collapseL1\">\n");
		echo("\t\t\t\t\t\t<h2 id=\"".$row["IDENTIFIER"]."CurrentHeading\">\n");
		if (count($active_atlases)>1) {
			echo("\t\t\t\t\t\t\t<span class=\"arrow arrow-r\"></span>\n");
		} else {
			echo("\t\t\t\t\t\t\t<span class=\"arrow arrow-d\"></span>\n");
		}
		echo("\t\t\t\t\t\t\t<span>".$row["TITLE"]." (".$row["AUTHOR_LAST_NAME"].", ".$row["PUB_YEAR"].") </span>\n");
		echo("\t\t\t\t\t\t\t<span id=\"".$row["IDENTIFIER"]."Counter\" class=\"counter\"></span>\n");
		echo("\t\t\t\t\t\t</h2>\n");
		if (count($active_atlases)>1) {
			echo("\t\t\t\t\t\t<div id=\"".$row["IDENTIFIER"]."CurrentContent\">\n");
		} else {
			echo("\t\t\t\t\t\t<div id=\"".$row["IDENTIFIER"]."CurrentContent\" style=\"display:block;\">\n");
		}
		echo("\t\t\t\t\t\t\t<div class=\"atlasDescription\">\n");
		echo("\t\t\t\t\t\t\t\t<p>".$row["DESCRIPTION"]."</p>\n");
		echo("\t\t\t\t\t\t\t</div>\n");
		echo("\t\t\t\t\t\t</div>\n");
		echo("\t\t\t\t\t</div>\n");
	}
}
echo "<script type=\"text/javascript\">var collectionList = [";
foreach ($active_atlases as $key => $value) {
	echo('"'.$value.'",');
}
echo "];</script>";
?>