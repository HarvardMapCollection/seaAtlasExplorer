<?php

// load the variables
$name = $_REQUEST["name"];
$subject = $_REQUEST["subject"];
$message = $_REQUEST["message"];
$from = $_REQUEST["from"];
$verif_box = $_REQUEST["verif_box"];

// remove the backslashes that normally appears when entering " or '
$name = stripslashes($name); 
$message = stripslashes($message); 
$subject = stripslashes($subject); 
$from = stripslashes($from); 

// check to see if verificaton code was correct
if(md5($verif_box).'a4xn' == $_COOKIE['tntcon']){
	// if verification code was correct send the message and show this page
	$message = "Name: ".$name."\n".$message;
	$message = "From: ".$from."\n".$message;
	mail("jaguillette@gmail.com", 'Online Form: '.$subject, $_SERVER['REMOTE_ADDR']."\n\n".$message, "From: $from\r\nCc: ediaz@fas.harvard.edu");
	// delete the cookie so it cannot sent again by refreshing this page
	setcookie('tntcon','');
} else {
	// if verification code was incorrect then return to contact page and show error
	header("Location:".$_SERVER['HTTP_REFERER']."?subject=$subject&from=$from&message=$message&wrong_code=true");
	exit;
}
?>

<!doctype html>
<html class="no-js" lang="">
    <head>
        <title>Contact Form - Sea Atlases at the Harvard Map Collection</title>
        <link rel="stylesheet" type="text/css" href="../../css/main.css">
    </head>
    <body>
		<script type="text/javascript">
		setTimeout(function () { window.close();}, 5000);
		</script>
		<div id="header-wrapper">
			<header>
				<div id="padder" style="height: 40vh;"></div>
				<div id="masthead-wrapper" class="container">
					<h1>Thank you for your feedback!</h1>
					<p>This window will close automatically.</p>
				</div>
			</header>
		</div>
	</body>
</html>
