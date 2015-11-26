<?php

function save_content_module($data = array()) {
    global $wpdb;

    $duration = (int)$data['duration'];

    if($data['minshours']=='hrs')
        $duration = $duration * 60;

    $content_data = array(
        'name'              => $data['name'],
        'term_ids'          => maybe_serialize($data['term_ids']),
        'last_modified_on'  => date('y-m-d H:i:s'),
        'last_modified_by'  => get_current_user_id(),
        'duration'          => $duration,
        'post_status'       => $data['post_status'],
        'type'              => $data['type']
    );

    if (isset($data['id'])) {
        $content_module = $wpdb->update($wpdb->prefix . 'content_collection', $content_data, array('id' => $data['id']));
        $module_id = (int) $data['id'];
    } else {
        $content_data['created_on'] = date('y-m-d H:i:s');
        $content_data['created_by'] = get_current_user_id();
        $content_module = $wpdb->insert($wpdb->prefix . 'content_collection', $content_data);
        $module_id = $wpdb->insert_id;
    }
    if ($content_module) {

        $meta_description = array(
            'collection_id' => $module_id,
            'meta_key' => 'description',
            'meta_value' => maybe_serialize($data['description'])
        );

        if (isset($data['id']))
            $content_meta = $wpdb->update($wpdb->prefix . 'collection_meta', $meta_description, array('collection_id' => $data['id'], 'meta_key'=>'description'));
        else
            $content_meta = $wpdb->insert($wpdb->prefix . 'collection_meta', $meta_description);

        $meta_textbook = array(
            'collection_id' => $module_id,
            'meta_key' => 'textbook',
            'meta_value' => $data['term_ids']['textbook']
        );
        if (isset($data['id']))
            $textbook_meta = $wpdb->update($wpdb->prefix . 'collection_meta', $meta_textbook, array('collection_id' => $data['id'], 'meta_key'=>'textbook'));
        else
            $textbook_meta = $wpdb->insert($wpdb->prefix . 'collection_meta', $meta_textbook);
    }

    return $module_id;
}

function update_module_content_pieces($data= array()){
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
