<?php

require_once( '../../../../wp-load.php');
require_once('../../../../wp-admin/includes/plugin.php');


function collection_status_field_in_db_changed_to_post_status(){
    global $wpdb;

    $alter_query = $wpdb->query("ALTER TABLE  `{$wpdb->base_prefix}content_collection` CHANGE  `status`  `post_status` VARCHAR( 255 )");

    echo "Status field changed to post_status in `{$wpdb->base_prefix}content_collection`<br><br>";

}
collection_status_field_in_db_changed_to_post_status();