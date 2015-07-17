<!doctype html>
<html class="no-js" lang="">
    <head>
        <title>Contact Form - Sea Atlases at the Harvard Map Collection</title>
    </head>
    <body>

		<form action="php/mailer.php" method="post" name="form1" id="form1" target="_blank">

		Your Name:<br>
		<input name="name" type="text" id="name" value="<?php echo $_GET['name'];?>">
		<br>
		<br>

		Your e-mail:<br>
		<input name="from" type="text" id="from" value="<?php echo $_GET['from'];?>">
		<br>
		<br>

		Subject:<br>
		<input name="subject" type="text" id="subject" value="<?php echo $_GET['subject'];?>">
		<br>
		<br>

		Type verification image:<br>
		<input name="verif_box" type="text" id="verif_box">
		<img src="php/verificationimage.php?<?php echo rand(0,9999);?>" alt="verification image, type it in the box" width="50" height="24" align="absbottom"><br>
		<br>

		<!-- if the variable "wrong_code" is sent from previous page then display the error field -->
		<?php if(isset($_GET['wrong_code'])){?>
		<div>Wrong verification code</div><br> 
		<?php ;}?>

		Message:<br>
		<textarea name="message" cols="6" rows="5" id="message"><?php echo $_GET['message'];?></textarea>
		<input name="Submit" type="submit" value="Send Message">
		</form>
	</body>
</html>
