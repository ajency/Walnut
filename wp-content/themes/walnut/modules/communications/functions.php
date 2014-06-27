<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 25/06/14
 * Time: 3:36 PM
 */

function save_communication($data){

    $message_type = $data['message_type'];

    switch($message_type){

        case 'modules_completed':
            $communication_id= save_modules_completed_communications($data);

    }

    return $communication_id;

}

function save_modules_completed_communications($data){

    global $wpdb;

    $communication_id=0;

    $message_type       = $data['message_type'];
    $communication_mode = $data['communication_mode'];
    $moduleids         = $data['additional_data']['module_ids'];
    $division           = $data['additional_data']['division'];

    //make sure the ids are entered in db as integers
    $module_ids= array();
    foreach($moduleids as $id)
        $module_ids[]= (int) $id;

    $student_ids= get_students_by_division($division);
    $parent_ids= get_parents_by_student_ids($student_ids);

    $recipients= array_merge($student_ids,$parent_ids );

    //$parent_emails= get_parent_emails_by_division($division);

    $content_data=array(
        message_type    => $message_type,
        recipients      => maybe_serialize($recipients),
        blog            => get_current_blog_id(),
        mode            => $communication_mode
    );

    $communication= $wpdb->insert($wpdb->base_prefix . 'comm_module', $content_data);

    if($communication){
        $communication_id = $wpdb->insert_id;

        $mdata= array(
            comm_module_id=> $communication_id,
            meta_key=> 'module_ids',
            meta_value=> maybe_serialize($module_ids)
        );

        $wpdb->insert($wpdb->base_prefix . 'comm_module_meta', $mdata);
    }

    return $communication_id;

}
