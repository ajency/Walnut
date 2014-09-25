<?php

function authenticate_login( $data ) {

    $login_data = $data;
    $login_check = wp_authenticate( $login_data['txtusername'], $login_data['txtpassword'] );

    if (is_wp_error( $login_check ))
        return array( "error" => "Invalid Username or Password" );

    else {
        
        $current_blog= get_current_blog_id();

        $response_data['blog_details'] = get_primary_blog_details( $login_check->ID );

        if($response_data['blog_details']['blog_id'] != $current_blog){
            switch_to_blog($response_data['blog_details']['blog_id']);
            $login_check = get_userdata($login_check->ID);
        }

        $login_check->division = get_user_meta($login_check->ID,'student_division',true);

        $response_data['login_details'] = $login_check;

        restore_current_blog();

        return $response_data;
    }

}

function get_primary_blog_details( $user_id = '' ) {

    if ($user_id == '')
        $user_id = get_current_user_id();

    $blog = get_active_blog_for_user( $user_id );
    $blog_logo_id = get_blog_option( $blog->blog_id, 'blog_logo' );

    switch_to_blog( $blog->blog_id );

    $blog_user_data = new WP_User($user_id);

    $blog_logo = wp_get_attachment_thumb_url( $blog_logo_id );

    $blog_data = array(
        'blog_id' => $blog->blog_id,
        'blog_name' => $blog->blogname,
        'blog_logo' => $blog_logo,
        'site_url' => $blog->siteurl,
        'blog_roles' =>$blog_user_data->roles
    );
    
    if (!is_multisite()) 
        $blog_data['site_url']=get_site_url();

    restore_current_blog();

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

    $user_data['ID']            = $user->ID;
    $user_data['display_name']  = $user->display_name;
    $user_data['role']          = $user->roles;
    $user_data['user_email']    = $user->user_email;
    $user_data['user_email']    = $user->user_email;
    $user_data['roll_no']       = get_user_meta($id, 'student_rollno', true);

    $user_data['profile_pic']   = get_site_url( 1 ) . '/wp-content/themes/walnut/images/avtar.png';

    return $user_data;

}


function user_extend_profile_fields($user){

    $user_textbooks = maybe_unserialize(get_user_meta( $user->ID, 'textbooks',true));
    $user_divisions = maybe_unserialize(get_user_meta( $user->ID, 'divisions',true));
    $user_student_division = maybe_unserialize(get_user_meta( $user->ID, 'student_division',true));
    $user_student_rollno = get_user_meta( $user->ID, 'student_rollno',true);
    $user_student_parentemail1 = get_user_meta( $user->ID, 'parent_email1',true);
    $user_student_parentemail2 = get_user_meta( $user->ID, 'parent_email2',true);
    $user_student_parentemail3 = get_user_meta( $user->ID, 'parent_email3',true);
    $user_student_parentphone1 = get_user_meta( $user->ID, 'parent_phone1',true);
    $user_student_parentphone2 = get_user_meta( $user->ID, 'parent_phone2',true);
 
      if(!is_array($user_textbooks)){
            $user_textbooks = array();
      }
      else{
         $user_textbooks = array_map('intval', $user_textbooks);
      }
      
       if(!is_array($user_divisions)){
            $user_divisions = array();
      }
      else{
         $user_divisions = array_map('intval', $user_divisions);
      }     
      $hide_textbooks="style='display:none'";
      if(user_can($user->ID,'teacher'))
        $hide_textbooks= "";
      
      switch_to_blog(1);
?> 
    
    <table class="form-table">

    <tr>
        <th><label for="tax_input[document_folders]">Textbooks</label></th>

        <td>
            <div>
            <ul class="textbooks-list" <?=$hide_textbooks?>>
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
                        <input value="<?php echo $textbook->term_id;?>" type="checkbox" name="textbooks[]" 
                               id="textbooks-<?php echo $textbook->term_id;?>" <?php echo $checked; ?> /> 
                                   <?php echo $textbook->name;?>
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
<table class="form-table visible-teacher" style="display:none">

    <tr>
        <th><label for="teacher-divisions">Divisions</label></th>

        <td>
            <div>
            <ul class="divisions-list">
    <?php
        restore_current_blog();
        $divisions =  get_class_divisions();
        switch_to_blog(1);
        if(!is_null($divisions)){
        foreach($divisions as $key => $value):

            $checked = "";
 
            if(in_array($key,$user_divisions)){

                $checked = "checked";


            }
        ?> 
                <li id="textbooks-<?php echo $key;?>">
                    <label class="selectit">
                        <input value="<?php echo $key;?>" type="checkbox" name="divisions[]" 
                               id="textbooks-<?php echo $key;?>" <?php echo $checked; ?> /> <?php echo $value;?>
                    </label>
                </li>
    <?php endforeach;
  }?>
            </ul>
            </div>
            <span class="description">Select the Divisions the current user has access to.</span>
        </td>
    </tr>

</table>

<table class="form-table visible-student" style="display:none">
    <tr id="student_division_row" class="form-field form-required">
        <th><label for="student-division">Division <span class="description"><?php _e('(required)'); ?></span></label>
        </th>

        <td> 
            <div>
                <select id="student_division" name="student_division">
                    <option value=""></option>
                    <?php
                    foreach($divisions as $key => $value):
                    $selected = ''; 
                    if($key == $user_student_division){
                        $selected = "selected";
                    }
                    ?>
                    <option value="<?php echo $key;?>" <?php echo $selected;?>><?php echo $value;?></option>
                    <?php
                    endforeach;
                    ?>
                </select>
            </div>
            <span class="description">Select the Division for the current user.</span>
        </td>
    </tr>
</table>
<table class="form-table visible-student" style="display:none">
    <tr class="form-field form-required">
        <th><label for="student-rollno">Roll No. <span class="description"><?php _e('(required)'); ?></span></label></th>

        <td> 
            <div>
                <input type="text" aria-required="true" value="<?php echo $user_student_rollno;?>" id="student_rollno" 
                       name="student_rollno">
            </div>
        </td>
    </tr>
</table>
<table class="form-table visible-student" style="display:none">
    <tr class="form-field form-required">
        <th><label>Parent email id 1 <span class="description"><?php _e('(required)'); ?></span></label></th>

        <td> 
            <div>
                <input type="text" aria-required="true" value="<?php echo $user_student_parentemail1;?>" 
                       id="parent_email_1" name="parent_email_1">
            </div>
        </td>
    </tr>
    <tr class="form-field">
        <th><label>Parent email id 2 </label></th>

        <td> 
            <div>
                <input type="text" value="<?php echo $user_student_parentemail2;?>" id="parent_email_2" 
                       name="parent_email_2" />
            </div>
        </td>
    </tr>
    <tr class="form-field">
        <th><label>Parent email id 3 </label></th>

        <td> 
            <div>
                <input type="text" value="<?php echo $user_student_parentemail3;?>" id="parent_email_3" 
                       name="parent_email_3" />
            </div>
        </td>
    </tr>
   <tr class="form-field form-required">
        <th><label>Parent mobile no 1 <span class="description"><?php _e('(required)'); ?></span></label></th>

        <td> 
            <div>
                <input type="text" aria-required="true" value="<?php echo $user_student_parentphone1;?>" 
                       id="parent_mobile_1" name="parent_mobile_1" />
            </div>
        </td>
    </tr>
   <tr class="form-field">
        <th><label>Parent mobile no 2 </label></th>

        <td> 
            <div>
                <input type="text" value="<?php echo $user_student_parentphone2;?>" 
                       id="parent_mobile_2" name="parent_mobile_2"/>
            </div>
        </td>
    </tr>
</table>
<?php
restore_current_blog();
}
add_action( 'show_user_profile', 'user_extend_profile_fields' );

add_action( 'edit_user_profile', 'user_extend_profile_fields' );

add_action( 'user_new_form', 'user_extend_profile_fields' );


//update the user meta textbooks key

function user_extend_profile_fields_save($user_id) {

    if ( (!current_user_can( 'edit_user')) )
        return false;
    if(isset($_POST['textbooks']) && !empty($_POST['textbooks'])){
        $textbooks= array_map('intval', $_POST['textbooks']);
        update_user_meta( $user_id, 'textbooks', $textbooks );
    }
    
    if(isset($_POST['divisions']) && !empty($_POST['divisions'])){
        $divisions = array_map('intval', $_POST['divisions']);
        update_user_meta( $user_id, 'divisions', $divisions );
    }
  
    if(isset($_POST['student_division']) && $_POST['student_division'] !=''){
        update_user_meta( $user_id, 'student_division', intval($_POST['student_division']) );
    }
    
    if(isset($_POST['student_rollno']) && $_POST['student_rollno'] !=''){
        update_user_meta( $user_id, 'student_rollno', intval($_POST['student_rollno']) );
    }
   
    for($i=1;$i<=3;$i++){
             if(isset($_POST['parent_email_'.$i]) && $_POST['parent_email_'.$i] !=''){
                 if( $parent_id = email_exists( $_POST['parent_email_'.$i] )) {
                     update_user_meta( $user_id, 'parent_email'.$i, $_POST['parent_email_'.$i] );
                     update_user_meta( $parent_id, 'parent_of', $user_id );
                    }
                 elseif(is_email($_POST['parent_email_'.$i])){
                     $password = wp_generate_password( 12, true );
                     $email_address =$_POST['parent_email_'.$i]; 
                     $new_parent_id = wp_create_user ( $email_address, $password, $email_address);
                     wp_update_user( array(
                                      'ID'       => $new_parent_id,
                                      'nickname' => $email_address
                                    )
                                  );
                     add_user_to_blog(get_current_blog_id(), $new_parent_id, 'parent' );
                     wp_new_user_notification($new_parent_id, $password);
                     //$parent_user = new WP_User( $new_parent_id );
                     
                     //$parent_user->set_role( 'parent' );
                     update_user_meta( $user_id, 'parent_email'.$i, $_POST['parent_email_'.$i] );
                     update_user_meta( $new_parent_id, 'parent_of', $user_id );

                 }             
            }  
    }
    
    for($i=1;$i<=2;$i++){
             if(isset($_POST['parent_mobile_'.$i]) && $_POST['parent_mobile_'.$i] !=''){
                update_user_meta( $user_id, 'parent_phone'.$i, $_POST['parent_mobile_'.$i] );
            }  
    }
    
}
add_action( 'personal_options_update', 'user_extend_profile_fields_save' );
add_action( 'edit_user_profile_update', 'user_extend_profile_fields_save' );
//add_action( 'wpmu_new_user', 'user_extend_profile_fields_save' );

function get_parents_by_division($division){

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

    $ids= array();

    foreach($parent_ids as $id)
        $ids[]= (int) $id->user_id;

    return $ids;
}

function get_parents_by_student_ids($student_ids){

    global $wpdb;

    $students_str = join(',',$student_ids);
    $students_str = "(".$students_str.")";

    $parents_query =$wpdb->prepare("SELECT user_id FROM {$wpdb->base_prefix}usermeta
        WHERE meta_key LIKE %s
        AND meta_value in $students_str",
        array('parent_of')
    );

    $parent_ids= $wpdb->get_results($parents_query);

    $ids= array();

    foreach($parent_ids as $id)
        $ids[]= (int) $id->user_id;

    return $ids;
}

function get_students_by_division($division){

    global $wpdb;
    
    $blogusers = get_users( 'blog_id='.  get_current_blog_id() );
    $blog_user_ids = array();
    foreach ( $blogusers as $user ) {
	$blog_user_ids[] = $user->ID;
    }
     
    if(empty($blog_user_ids)){
         $student_ids = array();
    }
    else{
        $user_ids = implode(',', $blog_user_ids);   

        $students_query= $wpdb->prepare("SELECT user_id FROM {$wpdb->base_prefix}usermeta
            WHERE meta_key LIKE %s
            AND meta_value = %d AND user_id IN (".$user_ids.")",
            array('student_division',$division)
        );

        $student_ids = $wpdb->get_results($students_query);
    }
    
    $ids= array();

    foreach($student_ids as $id)
        $ids[]= (int) $id->user_id;

    return $ids;
}

function get_class_divisions(){
    global $wpdb;
    $divisions_query= "SELECT id,division FROM {$wpdb->prefix}class_divisions";

    $division_ids = $wpdb->get_results($divisions_query);

    $divisions= array();

    foreach($division_ids as $division)
        $divisions[(int)$division->id]= $division->division;
    
    return $divisions;
}

/**
 * wp admin dashboard custom menus and functions
 */

function admin_scripts_users($hook) {
    if( 'user-new.php' != $hook && 'user-edit.php' != $hook )
        return;
    wp_enqueue_script( 'admin_users', get_template_directory_uri() .
            '/modules/user/js/admin_users.js', array(), false, true );
}
add_action( 'admin_enqueue_scripts', 'admin_scripts_users',100 );

/*
 * filter hook to update user meta fields in meta of signups table
 */
function add_user_meta_signups($user, $user_email, $key, $meta){
    global $wpdb;    
    $signeduser = $wpdb->get_row("SELECT * FROM $wpdb->signups WHERE user_login = '$user'");
    $usermeta = maybe_unserialize($signeduser->meta);
    $signeduserid = $signeduser->signup_id;
    
    if(isset($_POST['textbooks']) && !empty($_POST['textbooks'])){
        $textbooks= array_map('intval', $_POST['textbooks']);
        $usermeta['textbooks'] = $textbooks;
    }
    
    if(isset($_POST['divisions']) && !empty($_POST['divisions'])){
        $divisions = array_map('intval', $_POST['divisions']);
        $usermeta['divisions'] = $divisions;
    }
  
    if(isset($_POST['student_division']) && $_POST['student_division'] !=''){
        $usermeta['student_division'] = intval($_POST['student_division']);
    }
    
    if(isset($_POST['student_rollno']) && $_POST['student_rollno'] !=''){
        $usermeta['student_rollno'] = intval($_POST['student_rollno']);
    }
   
    for($i=1;$i<=3;$i++){
             if(isset($_POST['parent_email_'.$i]) && $_POST['parent_email_'.$i] !=''){
                 if( $parent_id = email_exists( $_POST['parent_email_'.$i] )) {
                     $usermeta['parent_email'.$i] = $_POST['parent_email_'.$i];
                     $usermeta['child_of'.$i] = $parent_id;
                     //update_user_meta( $parent_id, 'parent_of', $user_id );
                    }
                 elseif(is_email($_POST['parent_email_'.$i])){
                     $password = wp_generate_password( 12, true );
                     $email_address =$_POST['parent_email_'.$i]; 
                     $new_parent_id = wp_create_user ( $email_address, $password, $email_address);
                     wp_update_user( array(
                                      'ID'       => $new_parent_id,
                                      'nickname' => $email_address
                                    )
                                  );
                     add_user_to_blog(get_current_blog_id(), $new_parent_id, 'parent' );
                     wp_new_user_notification($new_parent_id, $password);

                     $usermeta['parent_email'.$i] = $_POST['parent_email_'.$i];
                     $usermeta['child_of'.$i] = $new_parent_id;
                     //update_user_meta( $new_parent_id, 'parent_of', $user_id );

                 }             
            }  
    }
    
    for($i=1;$i<=2;$i++){
             if(isset($_POST['parent_mobile_'.$i]) && $_POST['parent_mobile_'.$i] !=''){
                $usermeta['parent_phone'.$i] = $_POST['parent_mobile_'.$i];
            }  
    }
    
    $usermeta = serialize($usermeta);
    
    $wpdb->update( $wpdb->signups, 
                    array( 'meta' => $usermeta), 
                    array( 'signup_id' => $signeduserid ), 
                    array('%s')
                    );
    
    if ( isset( $_POST[ 'noconfirmation' ] ) && is_super_admin() ) {
            return false; // Disable confirmation email
    }
    
    return $user;
}       
add_filter('wpmu_signup_user_notification','add_user_meta_signups',10,4);     

/*
 * set user meta on user activation from signups table meta field
 */
function set_meta_user_activation($user_id, $password, $meta)
{
    global $wpdb;
    $updatemetafields = array('divisions','textbooks','student_division','student_rollno','parent_email1','parent_email',
                            'parent_email2','parent_email3','parent_phone1','parent_phone2'
                        );
    $updateparentof = array('child_of1','child_of2','child_of3');
    $signup_tbl = $wpdb->base_prefix."signups";
    $users_tbl = $wpdb->base_prefix."users";

    //Query to get the custom fields stored in the signup table
    $metadata = $wpdb->get_var("SELECT meta FROM ".$signup_tbl." WHERE user_login=(SELECT user_login FROM $users_tbl "
                                . "WHERE ID=".$user_id.")");

    $user_meta = unserialize($metadata);
    
    foreach($updatemetafields as $field => $value){
     if(isset($user_meta[$value]))
         update_usermeta( $user_id, $value, $user_meta[$value] );
    }
    
    foreach($updateparentof as $field => $value){
        if(isset($user_meta[$value]))
            update_usermeta( $user_meta[$value], 'parent_of', $user_id );
    }

}
add_action( 'wpmu_activate_user', 'set_meta_user_activation', 10, 3);

/* functions to disable users delete option in admin dashboard start*/
function user_row_actions_admin($actions, $user_object){
    unset($actions['remove']);
    return $actions;
}
add_filter('user_row_actions','user_row_actions_admin',10,2);

function user_bulk_actions_admin($actions){
    unset($actions['remove']);
    return $actions; 
}
add_filter( 'bulk_actions-users','user_bulk_actions_admin',10,1);

/* functions to disable users delete option in admin dashboard end*/


function login_footer_custom_display(){
    echo '<br/><div style="width: 320px;margin:auto">For further assistance please mail us at <a href="mailto:support@synapse.com">support@synapse.com</a> and we will get back to you immediately</div>';
}
add_action('login_footer','login_footer_custom_display',10);

function login_message_custom($message){
    $message = '<p>Login as a school admin to access the school</p>'.$message;
    return $message;
}
add_filter('login_message','login_message_custom',10,1);

function getLoggedInUserModel(){
    $user_data = get_userdata( get_current_user_id() );
    $userModel='';
    if($user_data){
        $userdata = __u::toArray($user_data);
        $userdata['data'] = __u::toArray($userdata['data']);
        $userdata['data']['display_name']= $user_data->display_name;
        $userdata['data']['user_email']= $user_data->user_email;
        $userdata['data']['division']= get_user_meta($user_data->ID,'student_division',true);

        $userModel="USER={}\n";

        foreach ($userdata as $key => $value) {
        
            if(in_array($key,array('caps','roles','allcaps','data'))) {

                $userModel .= "USER['$key']={}\n";

                foreach($value as $k=>$v){

                    $userModel .= "USER['$key']['$k']='$v'\n";

                }
            } 

            else
                $userModel .= "USER['$key']='$value'\n";

        }
    }

    return $userModel;
    
}

//////custom logo on login page//////
function custom_login_logo() {
    ?>
    <style type="text/css">
        body.login div#login h1 a {
            background-image: url(./wp-content/themes/walnut/images/synapse-logo-main.png);
            padding-bottom: 0px;
            margin-bottom:10px;
            height:100px;
            background-size:220px auto;
            width:250px;
        }
    </style>
    <?php
}

add_action('login_enqueue_scripts', 'custom_login_logo');
