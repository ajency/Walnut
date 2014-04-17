<?php

function get_single_division($id){
    
    global $wpdb;
    global $classids;

    $divisions_qry="select * from {$wpdb->prefix}class_divisions where id=".$id;

    $division_data = $wpdb->get_results($divisions_qry);

    foreach($division_data as $division){
        
        $student_count_qry="select count(umeta_id) from {$wpdb->base_prefix}usermeta 
            where meta_key='student_division' and meta_value='".$id."'";
        //echo $student_count_qry;
        $student_count=$wpdb->get_var($student_count_qry);
        
        $data['id']             = $division->id;
        $data['division']       = $division->division;
        $data['class_id']       = $division->class_id;
        $data['class_label']    = $classids[$division->class_id]['label'];
        $data['students_count'] = $student_count;
    }
    
    return $data;
}

function get_all_divisions($user_id=''){
    
    global $wpdb;
    global $classids;
    
    if($user_id=='')
        $user_id= get_current_user_id();
    
    $class_ids= "";
    
    $classes_data = get_user_meta($user_id, 'classes');
    
    $classes= maybe_unserialize($classes_data);
    
    if($classes)
        $class_ids = implode(',',$classes[0]);
    
    $divisions_qry="select id from {$wpdb->prefix}class_divisions where class_id in (".$class_ids.")";

    $divisions = $wpdb->get_results($divisions_qry);
    
    foreach($divisions as $div)
        $data[]=  get_single_division($div->id);
    
    return $data;
    
}