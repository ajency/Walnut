<?php

function get_single_student_training_module(){

    global $wpdb;
    
    if(!$user_id)
        $user_id = get_current_user_id();

    $query = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}content_collection WHERE id= %d", $id);

    $data = $wpdb->get_row($query);

    $terms = maybe_unserialize($data->term_ids);
    $textbook = $terms['textbook'];
    
    if (!user_has_access_to_textbook($textbook,$user_id)){
        return new WP_Error('No Access', __('You do not have access to this training module') );
    }

    $data->id               = (int) $data->id;
    $data->name             = wp_unslash($data->name);
    $data->term_ids         = $terms;
    $duration               = $data->duration;
    $data->minshours        ='mins';
    $data->total_minutes    = $data->duration; // only used for sorting accoring to time
    if($duration >= 60){
        $data->duration     = $duration/60;
        $data->minshours    ='hrs';
    }

    $query_description = $wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}collection_meta
        WHERE collection_id=%d",$id);

    $description= $wpdb->get_results($query_description);

    $data->description=$data->content_pieces=array();
    if($description){
        foreach($description as $key=>$value){
            $meta_val = maybe_unserialize ($value->meta_value);

            if ($value->meta_key=='description'){
                foreach($meta_val as $k=>$v)
                    $d[$k]=wp_unslash($v);
                
                $data->description= $d;
            }

            if ($value->meta_key=='content_pieces' )
                $data->content_pieces= $meta_val;

        }
    }

    if($division){
        $status_dets = get_content_module_status($id, $division,$data->content_pieces);
        $data->status= $status_dets['status'];
        $data->training_date= $status_dets['start_date'];
        $data->end_date = $status_dets['end_date'];
    }

    return $data;
}