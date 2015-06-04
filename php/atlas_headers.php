<?php
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
if (function_exists("get_identifier") == FALSE) {
	function get_identifier($x) {return $x['IDENTIFIER'];}
}
$active_atlases = explode(",",$_GET['atlas']);
if (in_array("all",$active_atlases)) {
	$active_atlases = array_map('get_identifier',$csv_array);
}
$display_list = array();
foreach ($csv_array as $index => $row) {
	if (in_array($row["IDENTIFIER"],$active_atlases)) {
		$header = "";
		$end = "";
		if ($dynamic_list and count($active_atlases)>1) {
			$header .= "<input id=\"".$row["IDENTIFIER"]."_checkbox\" type=\"checkbox\" class=\"filterControl\" value=\"".$row["IDENTIFIER"]."\" checked/>\n";
		}
		if ($dynamic_list) {
			$header .= "\t\t\t\t\t<div id=\"".$row["IDENTIFIER"]."CurrentHeading\" class=\"collapsible collapseL1\">\n";
		} else {
			$header .= "\t\t\t\t\t<div id=\"".$row["IDENTIFIER"]."BigListHeading\" class=\"collapsible collapseL1\">\n";
		}
		$header .= "<div>";
		if (count($active_atlases)>1) {
			$header .= "\t\t\t\t\t\t\t<span class=\"arrow arrow-r\"></span>\n";
			$header .= "\t\t\t\t\t\t<h2>";
		} else {
			$header .= "\t\t\t\t\t\t\t<span class=\"arrow arrow-d\"></span>\n";
			$header .= "\t\t\t\t\t\t<h1>";
		}
		$header .= $row["TITLE"];
		if (count($active_atlases)>1) {
			$header .= "</h2>\n\t\t\t\t\t\t<h3>";
		} else {
			$header .= "</h1>\n\t\t\t\t\t\t<h2>";
		}
		if (count($active_atlases)==1) {
			$header .= $row["AUTHOR_FIRST_NAME"]." ";
			if ($row["AUTHOR_MIDDLE_NAME"] != "") {
				$header .= $row["AUTHOR_MIDDLE_NAME"]." ";
			}
		}
		$header .= $row["AUTHOR_LAST_NAME"].", ".$row["PUB_YEAR"];
		if (count($active_atlases)>1) {
			$header .= "</h2>\n";
		} else {
			$header .= "</h1>\n";
		}
		if ($dynamic_list) {
			$header .= "\t\t\t\t\t\t\t<span id=\"".$row["IDENTIFIER"]."Counter\" class=\"counter\"></span>\n";
		}
		$header .= "</div>";
		if ($dynamic_list) {
			$divID = "CurrentContent";
		} else {
			$divID = "MainContent";
		}
		if (count($active_atlases)>1) {
			$header .= "\t\t\t\t\t\t<div id=\"".$row["IDENTIFIER"].$divID."\">\n";
		} else {
			$header .= "\t\t\t\t\t\t<div id=\"".$row["IDENTIFIER"].$divID."\" style=\"display:block;\">\n";
		}
		$header .= "\t\t\t\t\t\t\t<div class=\"atlasDescription\">\n";
		$header .= "\t\t\t\t\t\t\t\t<p>".$row["DESCRIPTION"]."</p>\n";
		$header .= "\t\t\t\t\t\t\t</div>\n";
		$end .= "\t\t\t\t\t\t</div>\n";
		$end .= "\t\t\t\t\t</div>\n";
		$display_list[$row["IDENTIFIER"]] = array();
		$display_list[$row["IDENTIFIER"]]['header'] = $header;
		$display_list[$row["IDENTIFIER"]]['end'] = $end;
		$display_list[$row["IDENTIFIER"]]['entries'] = array();
	}
}
?>