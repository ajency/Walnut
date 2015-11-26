<?php

require_once( '../../../../wp-load.php');
require_once('../../../../wp-admin/includes/plugin.php');

//update mcq individual option css column class as per column count
//set mcq question as complete if marks are set for question element (done as per content creator)

function modify_mcq_layout(){

    echo "<h4 style='border:1px solid #ccc; display:inline-block; padding:10px; background:#ddd;'>
        Updates 400 records at a time.
    </h4><br>";

    $resume_from = (isset($_GET['resume_from']))?$_GET['resume_from']:0;
    $completed_upto_id=$resume_from;

    global $wpdb;

    $query= $wpdb->prepare("SELECT * FROM `wp_postmeta`
            WHERE `meta_key` LIKE %s
            AND `meta_value` LIKE %s
            AND `meta_id` > %d
            ORDER BY `meta_id` asc
            LIMIT 400",
            array('content_element', '%"element";s:3:"Mcq"%', $resume_from)
        );

    $mcq_els = $wpdb->get_results($query);

    $current_id= 0;

    foreach($mcq_els as $ele){

        $meta_value= maybe_unserialize($ele->meta_value);
        $colcount = $meta_value['columncount'];

        if(isset($meta_value['marks']) && $meta_value['marks']>0)
            $meta_value['complete']="true";

        if(isset($meta_value['elements']))
            foreach($meta_value['elements'] as $key=>$element)
                $meta_value['elements'][$key]['class'] =  12/$colcount;

        if(isset($meta_value['options']))
            foreach($meta_value['options'] as $key=>$option)
                $meta_value['options'][$key]['class'] = 12/$colcount;

        update_metadata_by_mid( 'post', $ele->meta_id, $meta_value );

        echo "Updated meta_id {$ele->meta_id}: <br><br>";
        $current_id= $ele->meta_id;
    }

    echo "Current ID= $current_id. "
        . "To resume <a href=\"?resume_from=$current_id\">click here </a><br><br>";
}

modify_mcq_layout();
