<html>
	<head>
		<title>Sea Atlas Explorer</title>
		<meta charset="utf-8">

		<!-- Stylesheets -->
		<!-- Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
		<!-- Leaflet Sidebar Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/leaflet-sidebar.css">
		<!-- Leaflet Awesome Markers -->
		<link rel="stylesheet" type="text/css" href="css/leaflet.awesome-markers.css">
		<!-- Font Awesome by Dave Gandy - http://fontawesome.io -->
		<link rel="stylesheet" type="text/css" href="http://maxcdn.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">
		<!-- collapsible.js css -->
		<link rel="stylesheet" type="text/css" href="css/collapse.css">
		<!-- Tour CSS -->
		<link rel="stylesheet" type="text/css" href="css/hopscotch.css">
		<!-- Custom Leaflet Stylesheet -->
		<link rel="stylesheet" type="text/css" href="css/sea_atlas_explorer.css">
		<!-- Custom Markers -->
		<link rel="stylesheet" type="text/css" href="css/custom_markers.css">

		<!-- Javascript -->
		<!-- Leaflet -->
		<script type="text/javascript" src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>
		<!-- Leaflet Sidebar -->
		<script type="text/javascript" src="js/leaflet-sidebar.js"></script>
		<!-- Leaflet Awesome Markers -->
		<script type="text/javascript" src="js/leaflet.awesome-markers.js"></script>
		<!-- jQuery -->
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<!-- jQuery collapsible lists -->
		<script type="text/javascript" src="js/jquery.collapsible.js"></script>
		<!-- Javascript big integer library -->
		<script src="http://peterolson.github.com/BigInteger.js/BigInteger.min.js"></script>
		<!-- Tour js -->
		<script type="text/javascript" src="js/hopscotch.js"></script>
		<!-- bbox mapping script -->
		<script type="text/javascript" src="js/sea_atlas_explorer.js"></script>

		<!-- GeoJSON Data -->
		<link rel="polygons" type="application/json" href="geoJson/all_atlases.geojson">

	</head>
	<body>
		<div id="sidebar" class="sidebar" style="background-image:url(bg-test.png)">
			<ul class="sidebar-tabs" role="tablist">
				<li id="bigListTab"><a href="#bigList" role="tab" title="List of all sea charts available for display"><i class="fa fa-list"></i><span class="tab-description">Comprehensive List</span></a></li>
				<li id="currentViewTab" class="active"><a href="#currentView" role="tab" title="List of sea charts in current view"><i class="fa fa-compass"></i><span class="tab-description">Current View</span></a></li>
				<li id="selectionsTab"><a href="#selections" role="tab" title="List of charts that you've added to the current view"><i class="fa fa-check-square-o"></i><span class="tab-description">Charts Displayed</span></a><div id="chartAddedNotification"><p>Chart Added!</p><p>If you don't see it, try zooming to its location on the map.</p></div></li>
				<li id="helpTab"><a href="#help" role="tab" title="Help with using this interface"><i class="fa fa-question"></i><span class="tab-description">How to use this site</span></a></li>
				<li id="contactTab"><a href="#contact" role="tab" title="Contact us"><i class="fa fa-envelope-o"></i><span class="tab-description">Contact us</span></a></li>
			</ul>
			<div class="sidebar-content">
				<div id="bigList" class="sidebar-pane">
					<?php include("php/big_list_headers.php"); ?>
				</div>
				<div id="currentView" class="sidebar-pane active">
					<?php include("php/current_view_headers.php"); ?>
				</div>
				<div id="selections" class="sidebar-pane">
					<h1><i class="fa fa-check-square-o"></i> Charts Displayed</h1>
					<p>If you include a georeferenced chart in the current view, it will appear here.</p>
					<p>
						<span id="reset_tile_layers" class="button"><i class="fa fa-times-circle"></i>&nbsp;Reset Charts Displayed</span>&nbsp;
						<span id="undo_reset_tile_layers" class="button disabled"><i class="fa fa-undo"></i>&nbsp;Undo Reset</span>
					</p>
				</div>
				<div id="help" class="sidebar-pane">
					<h1><i class="fa fa-question"></i> How to use this site</h1>
					<div id="start-tour"><span class="button active">Tour the site</span></div>
					<p>There's a lot that you can do with these charts, so here's a rundown of what everything means, and how to use all of the features of this exhibition</p>
					<h3>The Basics</h3>
					<p><strong>If you just want to explore the collection</strong>, use the map to the right. As you zoom in to different locations, icons representing charts at similar scales will appear. You can hover over these icons to see the extent of the charts they represent, or click on them to highlight them.</p>
					<p><strong>If you want to find a specific chart</strong>, use this sidebar. The <i class="fa fa-list" title="list icon"></i> Comprehensive List tab will show a static list of all available charts. The <i class="fa fa-compass"></i> Current View tab displays a dynamic list of charts. It includes every chart inside the current map view, even the ones that are too small to currently have icons displayed. If you move the map to an area you're interested in, you can use this list to discover charts in that area.</p>
					<h3>How do I...?</h3>
					<p><strong>How do I look at a sea chart on the map?</strong><br/>That depends on how you found it. If you're looking at the map, click on a marker for the chart you want, and then check the box to "View chart on top of current map". If you found the chart by name in the sidebar, just check the box to the right of its name. If you don't see the chart come up, click on the name and the map will zoom to its location.</p>
					<p><strong>How do I adjust the transparency of a chart on the map?</strong><br/>To adjust the transparency, go to the "<i class="fa fa-check-square-o"></i> Charts Displayed" tab. There you'll see a list of all of the charts that you've added, and transparency sliders for each.</p>
					<p><strong>How do I save what I'm looking at?</strong><br/>You can save a link to the current view, including map boundaries and selected charts, with the <i class="fa fa-link"></i> link icon next to the sidebar. When you click it, it will display a link you can copy into your bookmarks, an email, or wherever else you'd like to reference the view from.</p>
					<p><strong>How do I minimize the sidebar?</strong><br/>To minimize the sidebar, just click the currently active tab title. To bring it back, click one of the sidebar icons.</p>
					<p><strong>How do I change the base map?</strong><br/>There is a layer control in the top right corner of the map. When you hover over it with your mouse, you'll see a list of base layers that you can switch to.</p>
					<h3>Can I use images from this site?</h3>
					<p>We follow the <a href="https://osc.hul.harvard.edu/pdpolicy">Harvard Library Policy on Access to Digital Reproductions of Works in the Public Domain</a>. The full policy is available through the link, but a portion has been exerpted here for convenience:</p>
					<p><em>"Harvard Library asserts no copyright over digital reproductions of works in its collections which are in the public domain, where those digital reproductions are made openly available on Harvard Library websites. To the extent that some jurisdictions grant an additional copyright in digital reproductions of such works, Harvard Library relinquishes that copyright. When digital reproductions of public domain works are made openly available on its websites, Harvard Library does not charge for permission to use those reproductions, and it does not grant or deny permission to publish or otherwise distribute them. As a matter of good scholarly practice, Harvard Library requests that patrons using Library-provided reproductions provide appropriate citation to the source of reproductions. This policy is subject to the explanation and exclusions below."</em></p>
				</div>
				<div id="contact" class="sidebar-pane">
					<?php include("php/contact.php"); ?>
				</div>
			</div>
		</div>
		<div id="map" class="sidebar-map"></div>
		<div id="infobox">
			<div id="hoverInfobox" style="display:none;"></div>
			<div id="highlightInfobox" style="display:none;"></div>
			<div id="chartCount"></div>
		</div>
		<?php include("php/breadcrumbs.php"); ?>
	<script type="text/javascript">

	geojson_bbox()

	// collapsible lists
	$(".collapsible").collapsible();
	$(".bigListCollapsible").collapsible();
	</script>
	<script type="text/javascript" src="js/hopscotch-test.js"></script>
	<!-- Google Analytics -->
	<script>
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-63066162-1', 'auto');
		ga('send', 'pageview');
	</script>
	</body>
</html>