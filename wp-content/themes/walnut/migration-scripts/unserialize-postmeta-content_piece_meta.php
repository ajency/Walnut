<?php

require_once( '../../../../wp-load.php');
require_once('../../../../wp-admin/includes/plugin.php');

function unserialize_post_meta(){
    global $wpdb;
    $query = $wpdb->prepare(
        "SELECT * from {$wpdb->prefix}postmeta 
            WHERE meta_key LIKE %s",
        "content_piece_meta");

    $metas=$wpdb->get_results($query);

    foreach($metas as $item){

            $meta_val= maybe_unserialize($item->meta_value);
            $meta_val= maybe_unserialize($meta_val);

            update_metadata_by_mid('post', $item->meta_id, $meta_val, 'content_piece_meta');

            echo "<br><br>UPDATED METAID: " . $item->meta_id;

        }
}

unserialize_post_meta(); 