<?php

function setup_childsite($blog_id){
    global $wpdb;   
    
    //save the additional details of blog from setup. eg. licence validity
    $blog_details=  maybe_serialize($_POST['blog_additional']);
    update_blog_option($blog_id, 'blog_meta',$blog_details);
    
    echo '<br><br>Setting Theme and template<br>';
    //setup the template and stylesheet for child sites
    update_blog_option($blog_id, 'template','walnut');
    update_blog_option($blog_id, 'stylesheet','schoolsite');
    
    $current_blog= get_current_blog_id();
    switch_to_blog($blog_id);
    
    setup_childsite_roles();
    
    setup_childsite_custom_pages();
    
    setup_childsite_tables();
    
    setup_childsite_menus($current_blog, $blog_id);

    create_temporary_folders();

    switch_to_blog($current_blog);
    
}

function setup_childsite_roles(){
    
    echo '<br><br>Creating Childsite Roles<br>';
    global $wp_roles;
    if(get_role('subscriber')!=NULL)remove_role( 'subscriber' );//removes the subscriber role
    if(get_role('contributor')!=NULL)remove_role( 'contributor' );//removes the contributor role
    if(get_role('author')!=NULL)remove_role( 'author' );//removes the author role
    if(get_role('editor')!=NULL)remove_role( 'editor' );//removes the editor role

       if(get_role('school-admin')==NULL)
         {
            $role_clone='administrator';
            $role_cloned = $wp_roles->get_role($role_clone);
            $role='school-admin';
            $role_name='School Admin';
            $wp_roles->add_role($role, $role_name, $role_cloned->capabilities);
         }
    add_role( 'student','Student');
    add_role( 'teacher','Teacher');
    add_role( 'parent','Parent');
    
    echo '<br>school-admin, Student, Parent roles created.';
    
}

function setup_childsite_custom_pages(){
    
    echo '<br><br>Creating Custom Pages<br>';
    if (!get_page_by_title('Dashboard')) {
        $post = array();
        $post['post_type'] = 'page'; //could be 'page' for example
        $post['post_author'] = get_current_user_id();
        $post['post_status'] = 'publish'; //draft
        $post['post_title'] = 'Dashboard';
        $dashboard_id = wp_insert_post($post);
                           
    }
    update_post_meta($dashboard_id, '_wp_page_template', 'dashboard.php');
    echo 'Dashboard Page Created<br>';
    
    update_option( 'page_on_front', $dashboard_id );
    update_option( 'show_on_front', 'page' );
    echo 'Dashboard Page set as front page<br>';
    
}

function setup_childsite_tables(){
    global $wpdb;
    
    echo '<br><br>Creating Tables<br>';
    
    $class_divisions_table= "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}class_divisions 
            (`id` varchar(255),
             `division` varchar(255) NOT NULL, 
             `class_id` INT NOT NULL, 
             PRIMARY KEY (`id`))";

    $wpdb->query($class_divisions_table);
    
    echo "{$wpdb->prefix}class_divisions table created<br>";
    
    $training_logs_table= "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}training_logs 
             (`id` INT NOT NULL AUTO_INCREMENT, `division_id` INT NOT NULL, 
             `collection_id` INT NOT NULL, 
             `teacher_id` INT NOT NULL, 
             `date` DATETIME NOT NULL, 
             `status` VARCHAR(255) NOT NULL, 
             PRIMARY KEY (`id`))";

    $wpdb->query($training_logs_table);
    
    echo "{$wpdb->prefix}training_logs table created<br>";
    
    $question_response_table = "
            CREATE TABLE IF NOT EXISTS `{$wpdb->prefix}question_response` (
              `ref_id` varchar(255) NOT NULL,
              `content_piece_id` int(11) NOT NULL,
              `collection_id` int(11) NOT NULL,
              `division` int(11) NOT NULL,
              `question_response` varchar(255) NOT NULL,
              `time_taken` varchar(255) NOT NULL DEFAULT '0',
              `start_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              `end_date` datetime NOT NULL,
              `status` varchar(50) NOT NULL
            )";
    
    $wpdb->query($question_response_table);
    
    echo "{$wpdb->prefix}question_response table created<br>";
    
 }

function setup_childsite_menus($current_blog, $blog_id){
    
    echo '<br><br>Creating Menus: <br>';
    switch_to_blog($current_blog);
    
    $parent_menus = wp_get_nav_menus();

    foreach($parent_menus as $p_menu){
        
        switch_to_blog($current_blog);
        $parent_menu_items = wp_get_nav_menu_items($p_menu->term_id);

        switch_to_blog($blog_id);
        $new_menu = wp_create_nav_menu($p_menu->name);
        
        echo $p_menu->name. ' created. <br>';
        
        foreach($parent_menu_items as $p_item){
           $p_item->post_status='publish';
           $post_id= wp_insert_post($p_item);
           $menu_data=array(
                'menu-item-db-id' => $post_id,
                'menu-item-object-id' => $p_item->object_id,
                'menu-item-object' => $p_item->object,
                'menu-item-parent-id' => $p_item->menu_item_parent,
                'menu-item-type' => $p_item->type,
                'menu-item-title' => $p_item->title,
                'menu-item-url' => $p_item->url,
                'menu-item-status' => 'publish'

           );
           wp_update_nav_menu_item( $new_menu,0, $menu_data);
        }
    }
}

function create_temporary_folders(){

    $uploads_dir=wp_upload_dir();

    if(!file_exists($uploads_dir['basedir'].'/tmp/'))
        mkdir($uploads_dir['basedir'].'/tmp',0777);

    if(!file_exists($uploads_dir['basedir'].'/tmp/downsync'))
        mkdir($uploads_dir['basedir'].'/tmp/downsync',0777);

    if(!file_exists($uploads_dir['basedir'].'/tmp/upsync'))
        mkdir($uploads_dir['basedir'].'/tmp/upsync',0777);

}