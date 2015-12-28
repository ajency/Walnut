<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 28/06/14
 * Time: 2:07 PM
 */

function get_all_content_modules($args=array(),$type= 'teaching-module'){

    global $wpdb;

    $post_status= 'publish';

    if(isset($args['post_status']))
        $post_status = $args['post_status'];

    $content_modules_ids_array = get_modules_by_post_status($post_status,$type);

    if(isset($args['search_str']) && trim($args['search_str']) !=''){
        $content_modules_ids_array = get_modules_by_search_string($args['search_str'],$content_modules_ids_array);
    }

    $content_module_ids = join(',',__u::flatten($content_modules_ids_array));

    if(isset($args['textbook'])){

        $modules_query = $wpdb->prepare(
            "SELECT id FROM {$wpdb->base_prefix}content_collection WHERE
                term_ids LIKE %s AND id in ($content_module_ids)",
            array('%\"'.$args['textbook'].'\";%')
        );
        $content_modules = $wpdb->get_results($modules_query, ARRAY_A);
        
        if(!$content_modules)
            return array();

        $content_modules_ids_array = __u::flatten($content_modules);

    }

    elseif(isset($args['class_id'])){

        $textbooks=get_textbooks_for_class($args['class_id']);
        $textbook_ids=array();
        foreach($textbooks as $book)
            $textbook_ids[]=$book->term_id;

        $textbook_ids = join(',',$textbook_ids);
        $modules_query = $wpdb->prepare(
            "SELECT collection_id FROM {$wpdb->base_prefix}collection_meta
                WHERE meta_key like %s
                AND meta_value in ($textbook_ids)
                AND collection_id in ($content_module_ids)", 'textbook');
        $content_modules = $wpdb->get_results($modules_query, ARRAY_A);
        $content_modules_ids_array = __u::flatten($content_modules);

    }


    $division = '';
    if(isset($args['division'])){

       $division = $args['division'];

       $archive_ids = get_modules_by_post_status('archive');

        foreach($archive_ids as $id){
            $taken_status= get_content_module_status($id, $division);
            if($taken_status['status']!='not started')
                $content_modules_ids_array[] = $id;
        }

    }

    $content_data=array();
    
    $content_modules_ids_array = __u::flatten($content_modules_ids_array);
    
    foreach($content_modules_ids_array as $id){
        $m=  get_single_content_module($id, $division);
        if(!is_wp_error($m))
            $content_data[]=$m;

    }
    
    $content_data= __u::sortBy($content_data, function($item){
                        return $item->last_modified_on;
                    });

    return $content_data;
}

function get_modules_by_search_string($search_string, $all_module_ids){

    global $wpdb;

    $module_ids= array();

    //search where module_name like search string
    $module_ids[]= search_modules_by_module_name($search_string, $all_module_ids);

    //search where module_name like search string
    $module_ids[]= search_modules_by_description($search_string, $all_module_ids);

    if(sizeof($module_ids)>0)
        $other_modules= __u::difference($all_module_ids, __u::flatten($module_ids));

    else
        $other_modules = $all_module_ids;

    //select collection_id, meta_value from collection_meta where meta_key content_pieces

    $other_module_ids= join(',',$other_modules);

    $content_modules_query= $wpdb->prepare("SELECT c.id, c.type, cm.meta_value
                                FROM {$wpdb->base_prefix}content_collection c, {$wpdb->base_prefix}collection_meta cm
                                WHERE c.id=cm.collection_id AND meta_key like %s
                                AND collection_id in ($other_module_ids)",
        'content_pieces'
    );

    $content_modules = $wpdb->get_results($content_modules_query);

    if($content_modules){

        foreach($content_modules as $module){

            $content_pieces= maybe_unserialize($module->meta_value);

            if($content_pieces && $module->type == 'quiz')
                $content_pieces =__u::pluck($content_pieces, 'id');

            if(sizeof($content_pieces)>0){

                $string_exists= get_content_pieces_by_search_string($search_string,$content_pieces);


                if(is_array($string_exists) && sizeof($string_exists)>0)
                    $module_ids[]=$module->id;

            }
        }
        $module_ids = __u::flatten($module_ids);
    }

    $module_ids = __u::compact($module_ids);
    
    return $module_ids;


}

function search_modules_by_module_name($search_string, $search_module_ids){

    global $wpdb;

    if(!$search_module_ids)
        return false;

    $search_module_ids= join(',',__u::flatten($search_module_ids));

    $module_ids = array();

    $modules_by_module_name_query = $wpdb->prepare("SELECT id FROM {$wpdb->base_prefix}content_collection
            WHERE name LIKE %s AND id in ($search_module_ids)", "%$search_string%");

    $modules_by_module_name = $wpdb->get_results($modules_by_module_name_query, ARRAY_A);


    if($modules_by_module_name)
        $module_ids = __u::flatten($modules_by_module_name);

    return $module_ids;

}

function search_modules_by_description($search_string, $search_module_ids){

    global $wpdb;

    if(!$search_module_ids)
        return false;

    $search_module_ids= join(',',__u::flatten($search_module_ids));
    
    $module_ids = array();

    $modules_by_description_query = $wpdb->prepare('SELECT collection_id FROM '.$wpdb->base_prefix.'collection_meta
            WHERE meta_value LIKE %s AND collection_id in ($search_module_ids)', "%$search_string%");

    $modules_by_description = $wpdb->get_results($modules_by_description_query, ARRAY_A);

    if($modules_by_description)
        $module_ids = __u::flatten($modules_by_description);

    return $module_ids;

}

function get_modules_by_post_status($post_status='publish',$module_type='teaching-module'){

    global $wpdb;

    if ($post_status=='any')
        $post_status='%%';

    $module_ids = array();

    $modules_by_status_query = $wpdb->prepare('SELECT id FROM '.$wpdb->base_prefix.'content_collection
            WHERE post_status LIKE %s AND type like %s', 
            array($post_status,$module_type)
            );

    $modules_by_status = $wpdb->get_results($modules_by_status_query, ARRAY_A);

    if($modules_by_status)
        $module_ids = __u::flatten($modules_by_status);

    return $module_ids;

}

function get_single_content_module($id, $division='', $user_id=0){

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

            if ($value->meta_key=='content_layout' )
                $data->content_layout= $meta_val;

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

function get_content_module_status($id, $division, $content_pieces=array()){

    global $wpdb;
    $start_date='';

    if(sizeof($content_pieces==0))
        $content_pieces = get_content_piece_ids_by_module_id($id);

    $check_responses_query= $wpdb->prepare("SELECT content_piece_id, status, start_date  FROM
            {$wpdb->prefix}question_response WHERE collection_id=%d AND
                division=%d",
        $id, $division);

    $module_responses  = $wpdb->get_results($check_responses_query);

    if(!$module_responses)
        $status='not started';

    if($module_responses){

        $status=($module_responses[0]->status === 'scheduled')?'scheduled':'started';

        $start_date= __u::last($module_responses)->start_date;
        $response_content_ids=array();

        foreach($module_responses as $response){
            if($response->status=='completed')
                $response_content_ids[]= $response->content_piece_id;
        }

        if(__u::difference($content_pieces,$response_content_ids) == null)
            $status='completed';
    }
    $status_data=array(
        'status'     => $status,
        'start_date' => $start_date,
        'end_date'   => get_module_end_date($id)
    );

    return $status_data;
}

function get_content_piece_ids_by_module_id($id){

    global $wpdb;

    $content_pieces_query= $wpdb->prepare("SELECT meta_value FROM {$wpdb->base_prefix}collection_meta
            WHERE collection_id = %d AND meta_key like %s",
        array($id, 'content_pieces')
    );

    $content_pieces  = $wpdb->get_var($content_pieces_query);
    $content_pieces = __u::flatten(maybe_unserialize($content_pieces));

    return $content_pieces;

}

function get_module_taken_by($module_id, $division, $blog_id=0){

    global $wpdb;

    $teachers = '';
    $teacher_names= array();
    
    if($blog_id) switch_to_blog ($blog_id);

    $question_response_table = $wpdb->prefix . "question_response";
    
    $taken_by_query = $wpdb->prepare(
        "SELECT teacher_id FROM $question_response_table
        WHERE collection_id = %d AND division = %s",
        array($module_id, $division)
    );

    $taken_by_result=$wpdb->get_results($taken_by_query, ARRAY_A);

    if(sizeof($taken_by_result>0)){
        $taken_by= (__u::unique(__u::flatten($taken_by_result)));

        foreach($taken_by as $teacher){
            $teacher_data = get_userdata($teacher);
            $teacher_names[]= $teacher_data->display_name;
        }
        if($teacher_names)
            $teachers= join(',', $teacher_names);
    }
    if($blog_id) restore_current_blog();
    return $teachers;
}


function get_module_end_date($module_id, $blog_id=0){

    global $wpdb;

    if($blog_id>0)
        switch_to_blog($blog_id);

    $question_response_table = $wpdb->prefix . "question_response";

    $completed_date_query = $wpdb->prepare(
        "SELECT max(end_date) FROM $question_response_table
                WHERE collection_id = %d",
        array($module_id)
    );

    $end_date=$wpdb->get_var($completed_date_query);

    $end_date = date('d M Y', strtotime($end_date));

    restore_current_blog();

    return $end_date;

}

function get_module_textbook($module_id){

    global $wpdb;

    $collection_meta_table = $wpdb->base_prefix . "collection_meta";

    $module_textbook_query = $wpdb->prepare(
        "SELECT meta_value FROM $collection_meta_table
                WHERE collection_id = %d
                AND meta_key LIKE %s",
        array($module_id, 'textbook')
    );

    $textbook_id=$wpdb->get_var($module_textbook_query);

    return $textbook_id;

}

function get_module_name($module_id){

    global $wpdb;

    $content_collection_table = $wpdb->base_prefix . "content_collection";

    $module_name_query = $wpdb->prepare(
        "SELECT name FROM $content_collection_table
                WHERE id=%d",
        $module_id
    );

    $module_name=$wpdb->get_var($module_name_query);

    return wp_unslash($module_name);

}

//get any meta value from table wp_collection_meta giving the module id and meta key

function get_module_meta($module_id, $meta_key=''){

    if(!$module_id || !trim($meta_key))
        return false;

    global $wpdb;
    
    $query = $wpdb->prepare(
        "SELECT meta_value from {$wpdb->base_prefix}collection_meta 
        WHERE collection_id = %d AND meta_key LIKE %s",
        array($module_id,$meta_key)
        );
    $meta = $wpdb->get_var($query);
    

    return $meta;
}
