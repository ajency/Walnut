<?php

function fetch_single_division($id, $blog_id=0){
    
    global $wpdb;
    global $classids;

    if($blog_id)
        switch_to_blog($blog_id);
      
    $divisions_qry="select * from {$wpdb->prefix}class_divisions where id=".$id;

    $division_data = $wpdb->get_results($divisions_qry);

    foreach($division_data as $division){
        $data['id']             = $division->id;
        $data['division']       = $division->division;
        $data['class_id']       = (int) $division->class_id;
        $data['class_label']    = $classids[$division->class_id]['label'];
        $data['students_count'] = get_student_count_in_division($id);
    }

    restore_current_blog();
    
    return $data;
}

function get_student_count_in_division($division){

    global $wpdb;
    
    $args = array(
        'role' => 'student',
        'meta_key' => 'student_division',
        'meta_value' => $division,
        );

    $students = get_users($args);

    return sizeof($students);
}

function get_all_divisions($user_id=''){
    
    global $wpdb;
    global $wp_roles;

    $admin=false;

    if($user_id=='')
        $user_id= get_current_user_id();
    
    $division_data = get_user_meta($user_id, 'divisions', true);

    $division_ids= maybe_unserialize($division_data);

    $division_ids= __u::compact($division_ids);

    if($division_ids)
        $division_str = implode(',',$division_ids);
    
    foreach ( $wp_roles->role_names as $role => $name ) :

        if ( user_can( $user_id,'school-admin' ) || user_can($user_id, 'administrator' )  )
            $admin=true;

    endforeach;

    $search_str ='';
    if(!$admin)
        $search_str= "where id in (".$division_str.")";

    $divisions_qry="select id from {$wpdb->prefix}class_divisions ".$search_str;
    $divisions = $wpdb->get_results($divisions_qry);

    foreach($divisions as $div)
        $data[]=  fetch_single_division($div->id);
    
    return $data;
    
}