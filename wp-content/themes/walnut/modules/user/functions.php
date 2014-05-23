<?php

function authenticate_login($data){

    $login_data=$data;
    $login_check=wp_authenticate($login_data['txtusername'],$login_data['txtpassword']);

    if(is_wp_error($login_check))
        return array("error"=>"Invalid Username or Password");

    else{

        $response_data['login_details']= $login_check;

        wp_set_auth_cookie( $login_check->ID );
        $response_data['blog_details'] = get_primary_blog_details($login_check->ID);

        return $response_data;
    }

}

function get_primary_blog_details($user_id=''){

    if($user_id=='')
        $user_id = get_current_user_id();

    $blog =get_active_blog_for_user($user_id);
    $blog_logo_id = get_blog_option($blog->blog_id, 'blog_logo');

    switch_to_blog($blog->blog_id);

    $blog_logo= wp_get_attachment_thumb_url($blog_logo_id);

    $blog_data= array(
        'blog_id'=> $blog->blog_id,
        'blog_name'=> $blog->blogname,
        'blog_logo'=> $blog_logo,
        'site_url'=> $blog->siteurl
    );
    return $blog_data;
}

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