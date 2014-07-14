<?php
/*
 * File name : custom-setup.php
 * Description : Contains a list of function to run at setup as follows:
 * 1) add_menu_to_blog - Function to create menu for chapter.
 * 2) agc_wmpu_university_table - Function to create table to add universities. 
 * 3) agc_wmpu_defaults_table - Function to create table to add default data.
 * 
 */

require_once( '../../../wp-load.php');
require_once('../../../wp-admin/includes/plugin.php');

/**
 * 
 */

function collection_status_field_in_db_changed_to_post_status(){
    global $wpdb;

    $alter_query = $wpdb->query("ALTER TABLE  `{$wpdb->base_prefix}content_collection` CHANGE  `status`  `post_status` VARCHAR( 255 )");

    echo "Status field changed to post_status in `{$wpdb->base_prefix}content_collection`<br><br>";

}
collection_status_field_in_db_changed_to_post_status();
