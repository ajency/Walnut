<?php
function student_change_password_form() {
	global $post;	
 
   	if (is_singular()) :
   		$current_url = get_permalink($post->ID);
   	else :
   		$pageURL = 'http';
   		if ($_SERVER["HTTPS"] == "on") $pageURL .= "s";
   		$pageURL .= "://";
   		if ($_SERVER["SERVER_PORT"] != "80") $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
   		else $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
   		$current_url = $pageURL;
   	endif;		
	$redirect = $current_url;
 
		ob_start();
		?>
		<div class="container-fluid">
		<div class="row">
		<div class="col-sm-6 col-sm-offset-3 col-lg-6 col-lg-offset-3">
		<?php
		student_show_error_messages();
		?>
		<?php if(isset($_GET['password-reset']) && $_GET['password-reset'] == 'true') { ?>
			<div class="alert alert-success">
				<span><strong>Success</strong>: <?php _e('Password changed successfully', 'rcp'); ?></span>
			</div>
			
		<?php } ?>
		<form id="student_password_form" method="POST" action="<?php echo $current_url; ?>">
                                <div class="change-password">
                                    <h4>Change your password</h4>
                                    <hr>
                                    <div class="current-password">
                                        <h5>Verify current password</h5>
                                        <div class="mat-holder">
                                            <label for="first-name" class="mat-label">Current Password</label>
                                            <input type="password" class="mat-input" required>
                                        </div>
                                    </div>
                                    <div class="new-password">
                                        <h5>New password</h5>
                                        <div class="mat-holder">
                                            <label for="first-name" class="mat-label">New Password</label>
                                            <input name="student_user_pass" id="student_user_pass" type="password" class="mat-input" required>
                                        </div>
                                    </div>
                                    <div class="confirm-password">
                                        <h5>Confirm new password</h5>
                                        <div class="mat-holder">
                                            <label for="first-name" class="mat-label">Confirm Password</label>
                                            <input name="student_user_pass_confirm" id="student_user_pass_confirm"  type="password" class="mat-input" required>
                                        </div>
                                    </div>
                                    <div class="update">
                                        <button type="submit" class="btn">
                                        Update
                                        </button>
                                    </div>
                                </div>
					<input type="hidden" name="student_action" value="reset-password"/>
					<input type="hidden" name="student_redirect" value="<?php echo $redirect; ?>"/>
					<input type="hidden" name="student_password_nonce" value="<?php echo wp_create_nonce('rcp-password-nonce'); ?>"/>
		</form>
		</div>
		</div>
		</div>
	<?php
	return ob_get_clean();	
}
 
// password reset form
function student_reset_password_form() {
	if(is_user_logged_in()) {
		return student_change_password_form();
	}
}
add_shortcode('password_form', 'student_reset_password_form');
 
 
function student_reset_password() {
	// reset a users password
	if(isset($_POST['student_action']) && $_POST['student_action'] == 'reset-password') {
 
		global $user_ID;
 
		if(!is_user_logged_in())
			return;
 
		if(wp_verify_nonce($_POST['student_password_nonce'], 'rcp-password-nonce')) {
 
			if($_POST['student_user_pass'] == '' || $_POST['student_user_pass_confirm'] == '') {
				// password(s) field empty
				student_errors()->add('password_empty', __('Please enter a password, and confirm it', 'student'));
			}
			if($_POST['student_user_pass'] != $_POST['student_user_pass_confirm']) {
				// passwords do not match
				student_errors()->add('password_mismatch', __('Passwords do not match', 'student'));
			}
 
			// retrieve all error messages, if any
			$errors = student_errors()->get_error_messages();
 
			if(empty($errors)) {
				// change the password here
				$user_data = array(
					'ID' => $user_ID,
					'user_pass' => $_POST['student_user_pass']
				);
				wp_update_user($user_data);
				// send password change email here (if WP doesn't)
				wp_redirect(add_query_arg('password-reset', 'true', $_POST['student_redirect']));
				exit;
			}
		}
	}	
}
add_action('init', 'student_reset_password');
 
if(!function_exists('student_show_error_messages')) {
	// displays error messages from form submissions
	function student_show_error_messages() {
		if($codes = student_errors()->get_error_codes()) {
			echo '<div class="alert alert-danger">';
			    // Loop error codes and display errors
			   foreach($codes as $code){
			        $message = student_errors()->get_error_message($code);
			        echo '<span class="student_error"><strong>' . __('Error', 'rcp') . '</strong>: ' . $message . '</span><br/>';
			    }
			echo '</div>';
		}	
	}
}
 
if(!function_exists('student_errors')) { 
	// used for tracking error messages
	function student_errors(){
	    static $wp_error; // Will hold global variable safely
	    return isset($wp_error) ? $wp_error : ($wp_error = new WP_Error(null, null, null));
	}
}
?>