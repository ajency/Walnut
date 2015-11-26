<?php

require_once( '../../../../wp-load.php');
require_once('../../../../wp-admin/includes/plugin.php');

//finds which post-meta of meta-key content_element has slashes in it and unslashes them

function unslash_post_meta(){

    global $wpdb;
    $query = $wpdb->prepare(
        "SELECT * from {$wpdb->prefix}postmeta 
            WHERE meta_key LIKE %s",
        "content_element");

    $metas=$wpdb->get_results($query);
    
    foreach($metas as $item){
        if(strpos($item->meta_value,'\\') !== false){

            $meta_val= maybe_unserialize($item->meta_value);

            $meta_val= wp_unslash($meta_val);

            foreach($meta_val as $key=>$val)
                $meta_val[$key]= wp_unslash($val);

            update_metadata_by_mid('post', $item->meta_id, $meta_val, 'content_element');

            echo "<br><br>UPDATED METAID: " . $item->meta_id;

        }
    }
}

unslash_post_meta(); 