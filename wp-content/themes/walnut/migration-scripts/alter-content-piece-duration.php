<?php

require_once( '../../../../wp-load.php');
require_once('../../../../wp-admin/includes/plugin.php');

//currently terms_ids of content-pieces are stored in content_piece_meta key of postmeta table along with other data of content-piece
//this function makes a separate meta_field for each content_piece for term_ids
//need for server side search of content pieces based on textbook/chapter/section id.

function alter_content_piece_duration(){
    $args = array(
        'post_type'=>'content-piece',
        'fields' => 'ids',
        'numberposts' => -1,
        'post_status' => 'any',
        'orderby'   => 'ID',
        'order'     => 'asc'
    );
    
    echo "<h4 style='border:1px solid #ccc; display:inline-block; padding:10px; background:#ddd;'>If update stops somewhere in between before the message 'Completed successfully' then click the last link to continue update</h4><br>";
    
    $resume_from = (isset($_GET['resume_from']))?$_GET['resume_from']:0;
    $content_pieces = get_posts($args);
    
    $completed_upto_id=$resume_from;
    
    $total= sizeof($content_pieces);
    $last_item = $content_pieces[$total-1];
    
    foreach($content_pieces as $id){
        
        if($id > $resume_from){
            
            $additional_content = get_post_meta($id,'content_piece_meta',true);
            
            if($additional_content){
                
                $additional_content = maybe_unserialize($additional_content);
                $additional_content['duration']=1;
                
                update_post_meta($id,'content_piece_meta',$additional_content);
                
            }
            
            $completed_upto_id= $id;
            
            if($completed_upto_id !== $last_item)
                echo "Current ID= $id. "
                    . "To resume <a href=\"?resume_from=$completed_upto_id\">click here </a><br><br>";

            else echo "<h4 style='border:1px solid #ccc; display:inline-block; padding:10px; background:#ddd;'>Completed successfully. Last ID = $completed_upto_id</h4>";
            
        }
    }
    
}

alter_content_piece_duration();