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
//collection_status_field_in_db_changed_to_post_status();

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
            if($additional_content['term_ids'])
                update_post_meta($id, 'term_ids', $additional_content['term_ids']);
        }
    }
}

add_term_ids_to_postmeta(); 

exit;