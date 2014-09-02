<?php

require_once( '../../../../wp-load.php');
require_once('../../../../wp-admin/includes/plugin.php');

//currently terms_ids of content-pieces are stored in content_piece_meta key of postmeta table along with other data of content-piece
//this function makes a separate meta_field for each content_piece for term_ids
//need for server side search of content pieces based on textbook/chapter/section id.

function add_term_ids_to_postmeta(){
    $args = array(
        'post_type'=>'content-piece',
        'fields' => 'ids',
        'numberposts' => -1,
        'post_status' => 'any'
    );

    $content_pieces = get_posts($args);

    foreach($content_pieces as $id){
        $additional_content = get_post_meta($id,'content_piece_meta',true);
        if($additional_content){
            $additional_content = maybe_unserialize($additional_content);
            if($additional_content['term_ids']){
                update_post_meta($id, 'term_ids', $additional_content['term_ids']);
                echo "<br><br>updated for post id ".  $id;
            }
        }
    }
}

add_term_ids_to_postmeta(); 