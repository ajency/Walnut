<?php 

function getvars_reset_password($recipients_email,$comm_data){

	global $aj_comm;

    $activation_key = get_reset_password_activation_key($comm_data['user_id']);

    $template_data['name'] 		= 'reset-password'; 

    $blog_data= get_blog_details($comm_data['blog_id'], true);

	$template_data['subject'] 	= $blog_data->blogname.': Reset your password';

	$template_data['from_email'] = 'no-reply@synapselearning.net';
	$template_data['from_name'] = 'Synapse';
    
	$template_data['global_merge_vars'][]=array(
		'name' 		=> 'RESET_LINK',
		'content' 	=> '<a href="'.$activation_key.'">Click Here</a>'
	);

	$user= get_userdata($comm_data['user_id']);

	$template_data['global_merge_vars'][]=array(
		'name' 		=> 'EMAIL',
		'content' 	=> '<a href="mailto:'.$user->user_email.'">'.$user->user_email.'</a>'
	);

	$template_data['global_merge_vars'][] = get_mail_header($comm_data['blog_id']);
	$template_data['global_merge_vars'][] = get_mail_footer($comm_data['blog_id']);

    return $template_data;
}


function get_reset_password_activation_key($user_id){

	global $wpdb;

	$user_data = get_userdata($user_id);

    do_action('lostpassword_post');

    if ( !$user_data ) return false;

    // redefining user_login ensures we return the right case in the email
    $user_login = $user_data->user_login;
    $user_email = $user_data->user_email;

    do_action('retreive_password', $user_login);  // Misspelled and deprecated
    do_action('retrieve_password', $user_login);

    $allow = apply_filters('allow_password_reset', true, $user_data->ID);

    if ( ! $allow )
        return false;
    else if ( is_wp_error($allow) )
        return false;

    $key = $wpdb->get_var($wpdb->prepare("SELECT user_activation_key FROM {$wpdb->prefix}users WHERE user_login = %s", $user_login));
    if ( empty($key) ) {
        // Generate something random for a key...
        $key = wp_generate_password(20, false);
        do_action('retrieve_password_key', $user_login, $key);
        // Now insert the new md5 key into the db
        $wpdb->update($wpdb->users, array('user_activation_key' => $key), array('user_login' => $user_login));
    }

    //$activation_key = network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login');
    //$activation_key = site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login');
    
    $activation_key =  wp_lostpassword_url( site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user_login), 'login') );

    return $activation_key; 
}