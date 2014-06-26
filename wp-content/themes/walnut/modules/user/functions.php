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


function user_extend_profile_fields($user){

    $user_textbooks = maybe_unserialize(get_user_meta( $user->ID, 'textbooks',true));
 
      if(!is_array($user_textbooks)){

            $user_textbooks = array();
      }
      else{
         $user_textbooks = array_map('intval', $user_textbooks);
      }
    switch_to_blog(1);
?> 
    
    <table class="form-table">

    <tr>
        <th><label for="tax_input[document_folders]">Textbooks</label></th>

        <td>
            <div>
            <ul clsss="textbooks-list">
    <?php


    $args = array(
        'orderby'    => 'name',
        'hide_empty' => 0,
        'parent' =>0, 
        'hierarchical'  => true
        ); 
        $textbooks =  get_terms('textbook',  $args);
        if(!is_null($textbooks)){
        foreach($textbooks as $textbook):

            $checked = "";
 
            if(in_array($textbook->term_id,$user_textbooks)){

                $checked = "checked";


            }
        ?> 
                <li id="textbooks-<?php echo $textbook->term_id;?>">
                    <label class="selectit">
                        <input value="<?php echo $textbook->term_id;?>" type="checkbox" name="textbooks[]" id="textbooks-<?php echo $textbook->term_id;?>" <?php echo $checked; ?> /> <?php echo $textbook->name;?>
                    </label>
                </li>
    <?php endforeach;
  }?>
            </ul>
            </div>
            <span class="description">Select the textbooks the current user has access to.</span>
        </td>
    </tr>

</table>
<?php
restore_current_blog();
}
add_action( 'show_user_profile', 'user_extend_profile_fields' );

add_action( 'edit_user_profile', 'user_extend_profile_fields' );

//add_action( 'user_new_form', 'user_extend_profile_fields' );


//update the user meta textbooks key

function user_extend_profile_fields_save($user_id) {

    if ( (!current_user_can( 'edit_user')) )
        return false;
    $textbooks= array_map('intval', $_POST['textbooks']);
    update_user_meta( $user_id, 'textbooks', $textbooks );
  
}

add_action( 'personal_options_update', 'user_extend_profile_fields_save' );
add_action( 'edit_user_profile_update', 'user_extend_profile_fields_save' );

function get_parent_emails_by_division($division){

    global $wpdb;

    $student_ids= get_students_by_division($division);

    $students_str = join(',',$student_ids);
    $students_str = "(".$students_str.")";

    $parents_query =$wpdb->prepare("SELECT user_id FROM {$wpdb->prefix}usermeta
        WHERE meta_key LIKE %s
        AND meta_value in $students_str",
        array('parent_of')
    );

    $parent_ids= $wpdb->get_results($parents_query, ARRAY_A);

    $parent_ids = __u::flatten($parent_ids);

    $args = array(
        'include'=> $parent_ids,
        'fields'=> array('user_email')
    );
    $parent_emails= get_users($args);
    $emails=array();
    foreach($parent_emails as $email){
        $emails[]= $email->user_email;
    }

    return $emails;
}


function get_students_by_division($division){

    global $wpdb;

    $students_query= $wpdb->prepare("SELECT user_id FROM {$wpdb->prefix}usermeta
        WHERE meta_key LIKE %s
        AND meta_value = %d",
        array('student_division',$division)
    );

    $student_ids = $wpdb->get_results($students_query, ARRAY_A);
    $student_ids = __u::flatten($student_ids);


    return $student_ids;
}