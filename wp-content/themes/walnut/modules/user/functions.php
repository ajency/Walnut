<?php

function get_user_list($data){
    
    $args['blog_id']= get_current_blog_id();
    
    if(isset($data['role']))
        $args['role']= $data['role'];
    
    if(isset($data['division'])){
        $args['meta_key'] = 'student_division';
        $args['meta_value']= $data['division'];
    }
    
    $users = get_users($args);
    
    $userdata = array();
    foreach($users as $user){        
        $userdata[]= get_user_by_id($user->id);
    }
    
    return $userdata;
    
}

function get_user_by_id($id){
    
    $user=  get_userdata($id);
    
    $userdata['ID'] = $user->ID;
    $userdata['display_name'] = $user->display_name;
    $userdata['role'] = $user->roles;
    $userdata['user_email'] = $user->user_email;
    $userdata['user_email'] = $user->user_email;
    $userdata['profile_pic'] = get_site_url(1).'/wp-content/themes/walnut/images/avtar.png';
    
    return $userdata;
    
}