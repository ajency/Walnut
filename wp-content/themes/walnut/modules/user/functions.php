<?php

function authenticate_login( $data ) {

    $login_data = $data;
    $login_check = wp_authenticate( $login_data['txtusername'], $login_data['txtpassword'] );

    if (is_wp_error( $login_check ))
        return array( "error" => "Invalid Username or Password" );

    else {

        $response_data['login_details'] = $login_check;

        $response_data['blog_details'] = get_primary_blog_details( $login_check->ID );

        return $response_data;
    }

}

function get_primary_blog_details( $user_id = '' ) {

    if ($user_id == '')
        $user_id = get_current_user_id();

    $blog = get_active_blog_for_user( $user_id );
    $blog_logo_id = get_blog_option( $blog->blog_id, 'blog_logo' );

    switch_to_blog( $blog->blog_id );

    $blog_logo = wp_get_attachment_thumb_url( $blog_logo_id );

    $blog_data = array(
        'blog_id' => $blog->blog_id,
        'blog_name' => $blog->blogname,
        'blog_logo' => $blog_logo,
        'site_url' => $blog->siteurl
    );
    return $blog_data;
}

function get_user_list( $data ) {

    $args['blog_id'] = get_current_blog_id();

    if (isset($data['role']))
        $args['role'] = $data['role'];

    if (isset($data['division'])) {
        $args['meta_key'] = 'student_division';
        $args['meta_value'] = $data['division'];
    }

    $users = get_users( $args );

    $user_data = array();
    foreach ($users as $user) {
        $user_data[] = get_user_by_id( $user->id );
    }

    return $user_data;

}

function get_user_by_id( $id ) {

    $user = get_userdata( $id );

    $user_data['ID'] = $user->ID;
    $user_data['display_name'] = $user->display_name;
    $user_data['role'] = $user->roles;
    $user_data['user_email'] = $user->user_email;
    $user_data['user_email'] = $user->user_email;
    $user_data['profile_pic'] = get_site_url( 1 ) . '/wp-content/themes/walnut/images/avtar.png';

    return $user_data;

}