<?php

//Invoking the communication plugin
function add_taught_in_class_student_mail($data, $comm_data){

    global $aj_comm;

    $meta = $data['additional_data'];
    $meta_data['division'] = $meta['division'];

    $recipients = get_student_recipients($division=$meta['division']);

    foreach($meta['module_ids'] as $module_id){

        $meta_data['module_id']= $module_id;

        $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);
    }

    return $comm;

}

//Invoking the communication plugin
function add_taught_in_class_parent_mail($data,$comm_data){

    global $aj_comm;

    $meta = $data['additional_data'];
    $meta_data['division'] = $meta['division'];

    $recipients=get_parent_recipients($division=$meta['division']);

    foreach($meta['module_ids'] as $module_id){

        $meta_data['module_id']= $module_id;

        $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);
    }

    return $comm;

}

function get_student_recipients($division){

    $students=get_students_by_division( $division );

    $recipients= array();

    foreach($students as $student){
        $recipients[] = array(                
                'user_id'   => $student->ID,
                'type'      => 'email',
                'value'     => $student->user_email
            );
    }

    return $recipients;
}

function get_parent_recipients($division){

    $students = get_students_by_division($division);

    $parents = array();

    if(is_array($students)){
        $studentIDs = __u::pluck($students, 'ID');
        $parents = get_parents_by_student_ids($studentIDs);
    }

    $recipients= array();

    foreach($parents as $parent){

        $recipients[] = array(                
                'user_id'   => $parent->ID,
                'type'      => 'email',
                'value'     => $parent->user_email
            );
    }

    return $recipients;
}