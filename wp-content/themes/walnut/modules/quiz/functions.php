<?php
/**
 * Created by PhpStorm.
 * User: Asus-Elroy
 * Date: 7/9/14
 * Time: 6:47 PM
 */

function save_quiz_module ($data = array()) {

    global $wpdb;

    $duration = $data['duration'];

    if ($data['minshours'] == 'hrs')
        $duration = $duration * 60;

    $content_data = array(
        'name' => $data['name'],
        'term_ids' => maybe_serialize($data['term_ids']),
        'last_modified_on' => date ('y-m-d H:i:s'),
        'last_modified_by' => get_current_user_id (),
        'duration' => $duration,
        'post_status' => $data['post_status'],
        'type' => $data['type']
    );

    if (isset($data['id'])) {
        $content_module = $wpdb->update ($wpdb->base_prefix . 'content_collection', $content_data, array('id' => $data['id']));
        $module_id = (int)$data['id'];
    } else {
        $content_data['created_on'] = date ('y-m-d H:i:s');
        $content_data['created_by'] = get_current_blog_id ();

        $content_module = $wpdb->insert ($wpdb->base_prefix . 'content_collection', $content_data);
        $module_id = $wpdb->insert_id;

        //        print_r($content_data) ; exit;
    }

    if ($content_module) {
        $meta_description = array(
            'collection_id' => $module_id,
            'meta_key' => 'description',
            'meta_value' => maybe_serialize ($data['description'])
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_description, array('collection_id' => $data['id'], 'meta_key' => 'description'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_description);

        $meta_permission = array(
            'collection_id' => $module_id,
            'meta_key' => 'permissions',
            'meta_value' => maybe_serialize ($data['permissions'])
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_permission, array('collection_id' => $data['id'], 'meta_key' => 'permissions'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_permission);

        $meta_quiz_type = array(
            'collection_id' => $module_id,
            'meta_key' => 'quiz_type',
            'meta_value' => $data['quiz_type']
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_quiz_type, array('collection_id' => $data['id'], 'meta_key' => 'quiz_type'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_quiz_type);

        $quiz_meta = array(
            'marks' => $data['marks'],
            'negMarksEnable' => $data['negMarksEnable'],
            'negMarks' => $data['negMarks'],
            'message' => $data['message']
        );
        $meta_quiz_meta = array(
            'collection_id' => $module_id,
            'meta_key' => 'quiz_meta',
            'meta_value' => maybe_serialize ($quiz_meta)
        );
        if (isset($data['id']))
            $content_meta = $wpdb->update ($wpdb->prefix . 'collection_meta', $meta_quiz_meta, array('collection_id' => $data['id'], 'meta_key' => 'quiz_meta'));
        else
            $content_meta = $wpdb->insert ($wpdb->prefix . 'collection_meta', $meta_quiz_meta);

    }

    return $module_id;
}


function get_single_quiz_module ($id) {
    global $wpdb;

    $select_query = $wpdb->prepare ("SELECT * FROM {$wpdb->base_prefix}content_collection WHERE id = %d", $id);
    $data = $wpdb->get_row ($select_query);
    $data->id = (int)$data->id;

    $duration = (int)$data->duration;
    $data->term_ids = maybe_unserialize($data->term_ids);
    $data->duration = $duration;
    $data->minshours = 'mins';
    $data->total_minutes = (int)$data->duration;
    if ($duration >= 60) {
        $data->minshours = 'hrs';
        $data->duration = $duration/60;
    }

    $query_meta = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}collection_meta WHERE collection_id = %d",$id);
    $quiz_details = $wpdb->get_results($query_meta);

    $data->permissions = $data->description = array();

//    print_r $quiz_details; exit;

    foreach ($quiz_details as $key=>$value){

        if ($value->meta_key == 'permissions')
            $permissions = maybe_unserialize($value->meta_value);
            if ($permissions)
                foreach ($permissions as $k=>$v){
                    $permissions[$k] = filter_var($permissions[$k], FILTER_VALIDATE_BOOLEAN);
                }
            $data->permissions = $permissions;

        if ($value->meta_key == 'description')
            $data->description = maybe_unserialize($value->meta_value);

        if ($value->meta_key == 'quiz_type')
            $data->quiz_type = $value->meta_value;

        if ($value->meta_key == 'content_pieces')
            $data->content_pieces = maybe_unserialize($value->meta_value);

        if ($value->meta_key == 'quiz_meta'){
            $quiz_meta = maybe_unserialize($value->meta_value);
            $data->marks = (int)$quiz_meta['marks'];
            $data->negMarksEnable = $quiz_meta['negMarksEnable'];
            $data->negMarks = (int)$quiz_meta['negMarks'];
            $data->message = $quiz_meta['message'];
        }
    }
//    print_r($data); exit;

    return $data;
}

function update_quiz_content_pieces($data= array()){
    global $wpdb;
    $content_pieces = maybe_serialize($data['content_pieces']);

    $exists_qry = $wpdb->prepare("SELECT id FROM {$wpdb->prefix}collection_meta WHERE
        collection_id=%d AND meta_key=%s", $data['id'], 'content_pieces');

    $exists = $wpdb->get_results($exists_qry);

    if($exists){
        $content_pieces_qry = $wpdb->prepare("UPDATE {$wpdb->prefix}collection_meta SET
            meta_value=%s WHERE collection_id=%d AND meta_key=%s",
            $content_pieces,$data['id'],'content_pieces' );
    }

    else{
        $content_pieces_qry = $wpdb->prepare("INSERT into {$wpdb->prefix}collection_meta
            (collection_id, meta_key, meta_value) VALUES (%d,%s,%s)",
            $data['id'],'content_pieces',$content_pieces );
    }

    $wpdb->query($content_pieces_qry);
}