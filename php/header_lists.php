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
foreach ($csv_array as $index => $row) {
	echo("<input id=\"".$row["IDENTIFIER"]."_checkbox\" type=\"checkbox\" class=\"filterControl\" value=\"".$row["IDENTIFIER"]."\"/>\n");
	echo("\t\t\t\t\t<div id=\"currentViewContent\" class=\"collapsible collapseL1\">\n");
	echo("\t\t\t\t\t\t<h2 id=\"".$row["IDENTIFIER"]."CurrentHeading\">\n");
	echo("\t\t\t\t\t\t\t<span class=\"arrow arrow-r\"></span>\n");
	echo("\t\t\t\t\t\t\t<span>".$row["TITLE"]." (".$row["AUTHOR_LAST_NAME"].", ".$row["PUB_YEAR"].") </span>\n");
	echo("\t\t\t\t\t\t\t<span id=\"".$row["IDENTIFIER"]."Counter\" class=\"counter\"></span>\n");
	echo("\t\t\t\t\t\t</h2>\n");
	echo("\t\t\t\t\t\t<div id=\"".$row["IDENTIFIER"]."CurrentContent\">\n");
	echo("\t\t\t\t\t\t\t<div class=\"atlasDescription\">\n");
	echo("\t\t\t\t\t\t\t\t<p>".$row["DESCRIPTION"]."</p>\n");
	echo("\t\t\t\t\t\t\t</div>\n");
	echo("\t\t\t\t\t\t</div>\n");
	echo("\t\t\t\t\t</div>\n");
}
?>