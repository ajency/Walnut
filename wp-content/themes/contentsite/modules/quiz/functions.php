<?php

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