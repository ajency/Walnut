<?php
/**
 * Plugin Name: School Data Sync
 * Plugin URI: http://www.ajency.in
 * Description: This plugin is for school data sync with the server.
 * Version: 0.1 Alpha
 * Author: Supresh Colaco
 * Author URI: http://www.ajency.in
 */
//ini_set('display_errors',1);
//"http:\/\/synapsedu.info\/wp-content\/uploads\/sites\/14\/tmp\/downsync\/csvs-7365920140710064728.zip
//http://subinsb.com/php-download-extract-zip-archives

require_once( plugin_dir_path( __FILE__ ) . 'includes/functions.php');
require_once( plugin_dir_path( __FILE__ ) . 'includes/ajax.php');
require_once( plugin_dir_path( __FILE__ ) . 'includes/csv_parse_functions.php');

function set_sds_plugin_options() {
	global $wpdb;
	
	//add_option("sds_syncsite","");
	//add_option("sds_syncblog_id","");
	
	//create tables logic on plugin activation
	$sync_status_table = "
            CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}sync_local_data` (
			   `id` int(11) NOT NULL primary key AUTO_INCREMENT,
              `file_path` varchar(455) NOT NULL,
			  `last_sync` datetime NOT NULL,
              `meta` TEXT NOT NULL,
              `status` VARCHAR(30) NOT NULL
            )";

    $wpdb->query( $sync_status_table );
	
}

function unset_sds_plugin_options () {
	//delete_option("sds_syncsite");
	//delete_option("sds_syncblog_id");
	//delete tables logic on plugin deactivation
}

register_activation_hook(__FILE__,"set_sds_plugin_options");
register_deactivation_hook(__FILE__,"unset_sds_plugin_options");

function school_data_sync_menu() {
    add_options_page( 'School Sync', 'School Sync', 'manage_options', 'school_data_sync', 
            'school_data_sync_screen' );
}
add_action( 'admin_menu', 'school_data_sync_menu' );

?>