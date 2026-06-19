<?php
function sae_h($key) {
	return htmlspecialchars(isset($_GET[$key]) ? $_GET[$key] : '', ENT_QUOTES, 'UTF-8');
}
?><!doctype html>
<html class="no-js" lang="">
    <head>
        <title>Contact Form - Sea Atlases at the Harvard Map Collection</title>
    </head>
    <body>

    	<p>The Harvard Map Collection welcomes your comments and inquiries about this exhibition. Please take a moment to share them through the form below, and know that all fields are required.</p>

		<form action="php/mailer.php" method="post" name="form1" id="form1" target="_blank">

		<label for="name">Your Name:</label><br>
		<input name="name" type="text" id="name" autocomplete="name" value="<?php echo sae_h('name');?>">
		<br>
		<br>

		<label for="from">Your e-mail:</label><br>
		<input name="from" type="email" id="from" autocomplete="email" value="<?php echo sae_h('from');?>">
		<br>
		<br>

		<label for="subject">Subject:</label><br>
		<input name="subject" type="text" id="subject" autocomplete="off" value="<?php echo sae_h('subject');?>">
		<br>
		<br>

		<label for="verif_box">Type verification image:</label><br>
		<input name="verif_box" type="text" id="verif_box" autocomplete="off">
		<img src="php/verificationimage.php?<?php echo rand(0,9999);?>" alt="verification image, type it in the box" width="50" height="24" align="absbottom"><br>
		<br>

		<!-- if the variable "wrong_code" is sent from previous page then display the error field -->
		<?php if(isset($_GET['wrong_code'])){?>
		<div>Wrong verification code</div><br>
		<?php ;}?>

		<label for="message">Message:</label><br>
		<textarea name="message" cols="6" rows="5" id="message" autocomplete="off"><?php echo sae_h('message');?></textarea>
		<input name="Submit" id="Submit" type="submit" value="Send Message">
		</form>
	</body>
</html>
