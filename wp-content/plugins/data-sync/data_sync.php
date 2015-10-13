<?php
/**
 * Plugin Name: Data Sync
 * Plugin URI: http://www.ajency.in
 * Description: This plugin is for school data sync with the server.
 * Version: 0.1 Alpha
 * Author: Robiul Hoque
 * Author URI: http://www.ajency.in
 */
//ini_set('display_errors',1);
//"http:\/\/synapsedu.info\/wp-content\/uploads\/sites\/14\/tmp\/downsync\/csvs-7365920140710064728.zip
//http://subinsb.com/php-download-extract-zip-archives

//define('NETWORK_SERVER_URL','http://localhost/walnut');

define('NETWORK_SERVER_URL','http://synapselearning.net');

//define('NETWORK_SERVER_URL','http://synapsedu.info');

require_once( plugin_dir_path( __FILE__ ) . 'includes/functions.php');

function set_ds_plugin_options() {
	global $wpdb;
	
	//add_option("sds_syncsite","");
	//add_option("sds_syncblog_id","");
	
	//create tables logic on plugin activation
	$sync_status_table = "
            CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}sync_data` (
			   `id` int(11) NOT NULL primary key AUTO_INCREMENT,
               `last_sync` timestamp NOT NULL,
               `status` VARCHAR(30) NOT NULL
            )";

    $wpdb->query( $sync_status_table );
	
}

function unset_ds_plugin_options () {
	//delete_option("sds_syncsite");
	//delete_option("sds_syncblog_id");
	//delete tables logic on plugin deactivation
}

register_activation_hook(__FILE__,"set_ds_plugin_options");
register_deactivation_hook(__FILE__,"unset_ds_plugin_options");

function data_sync_menu() {
    add_options_page( 'Data Update', 'Data Update', 'manage_options', 'data_update', 
            'school_data_sync_screen_new' );
}
add_action( 'admin_menu', 'data_sync_menu' );

/*function new_check_data_sync($redirect_to, $request, $user) {
    global $wpdb;
    $sync_count = $wpdb->get_col( "SELECT count(*) FROM {$wpdb->prefix}sync_data where status='imported'" );
    
    if($sync_count[0] == 0){
        $redirect_to = site_url().'/wp-admin/options-general.php?page=data_sync';
		
    }
	
	return $redirect_to;

}*/
//add_action( 'login_redirect', 'new_check_data_sync', 10,3 );
?>