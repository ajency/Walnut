<?php

function create_content_piece_post_type() {
    register_post_type('content-piece', array(
        'labels' => array(
            'name' => __('Content Piece'),
            'singular_name' => __('Content Piece'),
            'add_new_item' => 'Add New Content Piece',
            'edit_item' => 'Edit Content Piece',
            'new item' => 'New Content Piece',
            'view_item' => 'View Content Pieces',
            'not_found' => 'No Content Piece found',
            'not_found_in_trash' => 'No Content Pieces found in the trash',
            'search_items' => 'Search Content Pieces'
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'comments', 'thumbnail')
            )
    );

    register_taxonomy('textbook', 'content-piece', array('labels' => array(
            'name' => 'Textbook',
            'singular_name' => 'Textbook',
            'add_new_item' => 'Add New Textbook',
            'edit_item' => 'Edit Textbook',
            'new item' => 'New Textbook',
            'view_item' => 'View Textbooks',
            'not_found' => 'No Textbook found',
            'not_found_in_trash' => 'No Textbooks found in the trash',
            'search_items' => 'Search Textbooks'
        ), 'public' => true,
        'hierarchical' => true,
        'show_ui' => true,
        'query_var' => true));

    register_taxonomy('content-piece-tags', 'content-piece', array('labels' => array(
            'name' => 'Content Piece Tags',
            'singular_name' => 'Content Piece Tag',
            'add_new_item' => 'Add New Tag',
            'edit_item' => 'Edit Tag',
            'new item' => 'New Tag',
            'view_item' => 'View Tag',
            'not_found' => 'No Tag found',
            'not_found_in_trash' => 'No Tag found in the trash',
            'search_items' => 'Search Content Piece Tag'
        ), 'public' => true,
        'show_ui' => true,
        'query_var' => true));
}

add_action('init', 'create_content_piece_post_type');

function get_content_pieces($args = array()) {
    
    $current_blog_id= get_current_blog_id();
    
    switch_to_blog(1);
    
    if(isset($args['ids'])){
        $ids = implode(',',$args['ids']);
        $args['post__in'] = $args['ids'];
    }
    
    
    $args['numberposts'] = -1;
    $args['fields'] = 'ids';
    
    $content_items = get_posts($args);
    
    $content_pieces=array();
    
    foreach ($content_items as $id) {
        $content_pieces[]= get_single_content_piece($id);
    }
    
    switch_to_blog($current_blog_id);
    
    return $content_pieces;
    
}

function get_single_content_piece($id){
    
    $current_blog_id= get_current_blog_id();
    
    switch_to_blog(1);
    
    $content_piece= get_post($id);
    
    $subject_ids = array();
    
    $subjects = get_the_terms($id, 'textbook');
    
    //FETCHING LIST OF TEXTBOOKS RELATED TO THE CONTENT PIECE
    foreach ($subjects as $sub) {
        
        $subject_ids[] = $sub->term_id;
        
        while ($sub->parent >0){
            $sub = get_term($sub->parent, 'textbook');
            $subject_ids[] = $sub->term_id;
        }
    }
    //print_r($subject_ids);
    $content_piece->subjects = $subject_ids;
    $authordata = get_userdata($content_piece->post_author);
    $content_piece->creator = $authordata->display_name;
    
    // Content Type is 'teacher question' or 'student question' etc
    $content_type = get_post_meta($id, 'content_type', true);
    $content_piece->content_type = ($content_type) ? $content_type : '--';
    
    // Question Type can be individual or chorus
    $content_piece->question_type = 'individual'; 
    
    switch_to_blog($current_blog_id);
    
    return $content_piece;
}

function save_content_group($data = array()) {
    global $wpdb;
    
    $duration= (int) $data['duration'];
    
    if($data['minshours']=='hrs')
        $duration = $duration * 60;
    
    $content_data = array(
        'name'              => $data['name'],
        'term_ids'          => $data['term_ids'],
        'last_modified_on'  => date('y-m-d H:i:s'),
        'last_modified_by'  => get_current_user_id(),
        'duration'          => $duration
    );
    

    if (isset($data['id'])) {
        $content_group = $wpdb->update($wpdb->prefix . 'content_collection', $content_data, array('id' => $data['id']));
        $group_id = $data['id'];
    } else {
        $content_data['created_on'] = date('y-m-d H:i:s');
        $content_data['created_by'] = get_current_user_id();
        $content_group = $wpdb->insert($wpdb->prefix . 'content_collection', $content_data);
        $group_id = $wpdb->insert_id;
    }
    if ($content_group) {

        $meta_data = array(
            'collection_id' => $group_id,
            'meta_key' => 'description',
            'meta_value' => $data['description']
        );

        if (isset($data['id']))
            $content_meta = $wpdb->update($wpdb->prefix . 'collection_meta', $meta_data, array('collection_id' => $data['id'], 'meta_key'=>'description'));
        else
            $content_meta = $wpdb->insert($wpdb->prefix . 'collection_meta', $meta_data);
    }

    return $group_id;
}

function update_group_content_pieces($data= array()){
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

function update_training_module_status($args=array()){
    
    global $wpdb;
    
    extract($args);
    
    if(!isset($teacher_id))
        $teacher_id= get_current_user_id();
    
    $data=array(
        'division_id'=> $division,
        'collection_id'=>$id,
        'teacher_id'=> $teacher_id,
        'date'=>date('Ymd'),
        'status'=>$status
    );
    
    if($status=='completed' || $status=='scheduled'){
        if($status=='scheduled'){
            $date = date('Ymd',strtotime($training_date));
            $data['date']= $date;
        }
        $content_group = $wpdb->insert($wpdb->prefix . 'training_logs', $data);
    }
    
    else { //check if the last status was started/ scheduled and change it appropriately
        $chk_logs_qry = $wpdb->prepare("select id,status from 
            {$wpdb->prefix}training_logs where division_id=%d and 
                collection_id=%d order by id desc limit 1",$division,$id);
            
        $chk_logs= $wpdb->get_results($chk_logs_qry);

        if($chk_logs){
            foreach($chk_logs as $log){
                if($log->status=='started'){
                   $data['status'] = 'resumed';
                   $content_group = $wpdb->insert($wpdb->prefix . 'training_logs', $data);
                }

                if($log->status=='scheduled'){
                   $data['status'] = 'started';
                   $content_group = $wpdb->update($wpdb->prefix . 'training_logs', $data, array('id'=>$log->id));
                }
            }
        }
        else {
            $data['status'] = 'started';
            $content_group = $wpdb->insert($wpdb->prefix . 'training_logs', $data);
        }
    }
    
    return $content_group;
    
}

function get_all_content_groups($args=array()){
    
    $current_blog= get_current_blog_id();
    switch_to_blog(1);
    
    global $wpdb;
    
    $query = $wpdb->prepare("SELECT id FROM {$wpdb->prefix}content_collection", null);
    
    if(isset($args['textbook']))
        $query = $wpdb->prepare('SELECT id FROM '.$wpdb->prefix.'content_collection WHERE term_ids LIKE %s', '%\"'.$args['textbook'].'\";%');
    
    $content_groups = $wpdb->get_results($query);
    
    $content_data=array();
    switch_to_blog($current_blog);
    
    $division = '';
    
    if(isset($args['division']))
        $division = $args['division'];
            
    foreach($content_groups as $item)
        $content_data[]=  get_single_content_group($item->id, $division);
    
    switch_to_blog($current_blog);
    return $content_data;
}

function get_single_content_group($id, $division=''){
    
    global $wpdb;
    
    $current_blog= get_current_blog_id();
    switch_to_blog(1);
    
    $query = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}content_collection WHERE id= %d", $id);

    $data = $wpdb->get_results($query);
    
    foreach ($data as $item){
        $data=$item;
        $data->term_ids         = maybe_unserialize ($data->term_ids);    
        $duration               = $item->duration;
        $data->minshours        ='mins';
        $data->total_minutes    = $data->duration; // only used for sorting accoring to time
        if($duration >= 60){
            $data->duration     = $duration/60;
            $data->minshours    ='hrs';
        }
    }
    
    $query_description = $wpdb->prepare("SELECT * FROM {$wpdb->prefix}collection_meta 
        WHERE collection_id=%d",$id);
    
    $description= $wpdb->get_results($query_description);
    
    $data->description=$data->content_pieces=array();

    foreach($description as $key=>$value){
       $meta_val = maybe_unserialize ($value->meta_value);
       
       if ($value->meta_key=='description')
           $data->description= $meta_val;
           
       if ($value->meta_key=='content_pieces' )
           $data->content_pieces= $meta_val;
       
    }

    switch_to_blog($current_blog);
    
    if($division !=''){
        $training_logs_query = $wpdb->prepare("SELECT * FROM 
            {$wpdb->prefix}training_logs WHERE collection_id=%d AND 
                division_id=%d order by id desc limit 1",
                    $id, $division);

        $training_logs  = $wpdb->get_results($training_logs_query);  

        foreach($training_logs as $logs){
           $data->status= $logs->status;
           $data->training_date= $logs->date;
        }
    }
    
    return $data;
    
}
?>
