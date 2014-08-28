<?php

require_once( '../../../../wp-load.php');
require_once('../../../../wp-admin/includes/plugin.php');

//currently terms_ids of content-pieces are stored in content_piece_meta key of postmeta table along with other data of content-piece
//this function makes a separate meta_field for each content_piece for term_ids
//need for server side search of content pieces based on textbook/chapter/section id.

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