<div id="breadcrumb-wrapper">
	<div id="breadcrumb" class="container">
		<a href="http://hcl.harvard.edu/maps/">Harvard Map Collection</a> 
		&nbsp;»&nbsp;
		<a href="http://sea-atlases.org/">Sea Atlases</a> 
		&nbsp;»&nbsp;
		<?php 
		if ($_GET['atlas']=='all') {
			echo("Sea Atlas Explorer");
		} elseif (array_key_exists("chart_id", $_GET)) {
			echo "<a href=\"../?atlas=all\">Sea Atlas Explorer</a>";
			echo "&nbsp;»&nbsp;";
			echo "Single Chart";
		} else {
			echo "<a href=\"./?atlas=all\">Sea Atlas Explorer</a>";
			echo "&nbsp;»&nbsp;";
			$active_atlases_pretty = array();
			foreach ($csv_array as $index => $row) {
				if (in_array($row["IDENTIFIER"],$active_atlases)) {
					array_push($active_atlases_pretty,$row['TITLE']);
				}
			}
			echo(implode(" | ", $active_atlases_pretty));
		}
		?>
	</div>
</div>