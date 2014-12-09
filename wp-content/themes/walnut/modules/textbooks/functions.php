<?php

function load_fileupload( $hook ) {
    if ($hook == 'edit-tags.php') {
        wp_enqueue_script( 'jquery-ui-widget' );
        wp_enqueue_script( 'file-upload', get_template_directory_uri() .
            '/walnut/dev/js/plugins/jquery.fileupload.js', array(), false, true );
        wp_enqueue_script( 'theme-js', get_template_directory_uri() .
            '/modules/school/js/wp_global.js', array(), false, true );
    }
}

add_action( 'admin_enqueue_scripts', 'load_fileupload' );

function upload_textbook_image() {
    if (!isset($_GET['request']))
        return true;

    $targetFolder = wp_upload_dir(); // Relative to the root

    global $user_ID;

    $files = $_FILES['files'];


    if ($files['name']) {
        $file = array(
            'name' => $files['name'],
            'type' => $files['type'],
            'tmp_name' => $files['tmp_name'],
            'error' => $files['error'],
            'size' => $files['size']
        );

        $_FILES = array( "upload_attachment" => $file );


        $attach_data = array();


        foreach ($_FILES as $file => $array) {
            $attach_id = upload_attachment( $file, 0, true );
            $attachment_id = $attach_id;
            $attachment_url = wp_get_attachment_thumb_url( $attach_id );
        }
    }

    wp_send_json( array( 'attachment_id' => $attachment_id, 'attachment_url' => $attachment_url ) );
}

add_action( 'admin_init', 'upload_textbook_image' );

// save extra taxonomy fields callback function
function save_extra_taxonomy_fields( $term_id ) {
    if ($_POST['parent'] > 0)
        return true;

    if (isset($_POST['term_meta'])) {
        global $wpdb;
        $t_id = $term_id;
        $term_meta = get_option( "taxonomy_$t_id" );
        $cat_keys = array_keys( $_POST['term_meta'] );
        foreach ($cat_keys as $key) {
            if (isset($_POST['term_meta'][$key])) {
                $term_meta[$key] = $_POST['term_meta'][$key];
            }
        }
        //save the option array
        update_option( "taxonomy_$t_id", $term_meta );
        $classes = maybe_serialize( $_POST['classes'] );
        $tags = maybe_serialize( $_POST['term_tags'] );

        $check_exists = $wpdb->query( "select id from {$wpdb->prefix}textbook_relationships where textbook_id=" . $t_id );
        if ($check_exists)
            $textbooks_query = "update {$wpdb->prefix}textbook_relationships set class_id= '" . $classes . "', tags='" . $tags . "'
                        where textbook_id=" . $t_id;
        else
            $textbooks_query = "insert into {$wpdb->prefix}textbook_relationships values ('','" . $t_id . "', '" . $classes . "','" . $tags . "')";

        $wpdb->query( $textbooks_query );
    }
}

// this adds the fields
add_action( 'textbook_add_form_fields', 'extra_tax_fields', 10, 2 );

// this saves the fields
add_action( 'created_textbook', 'save_extra_taxonomy_fields', 10, 2 );

add_action( 'textbook_edit_form_fields', 'extra_tax_fields', 10, 2 );
add_action( 'edited_textbook', 'save_extra_taxonomy_fields', 10, 2 );

/**
 *
 * @param type $args
 * @return boolean
 *
 * textbooks will be fetched from primary blog only.
 * if fetch all is true, ALL textbooks will be fetched
 * if class_id is defined, textbooks associated with that classid only will be returned
 * if parent is set then chapters/sections/subsections of that parent will be fetched
 */

function get_textbooks( $args = array() ) {
    // set defaults
    $defaults = array(
        'hide_empty'    => false,
        'parent'        => 0,
        'fetch_all'     => false,
        'orderby'       => 'name',
        'order'         => 'asc',
        //'number'=>2,
        'user_id'       => get_current_user_id(),
        'class_id'      => ''
    );

    $count_total=0;
    $args = wp_parse_args( $args, $defaults );
    $textbooks_for_blog = get_textbooksids_for_current_blog();

    if($args['parent'] ==0 && current_user_can('administrator')==false)
        $args['include']=$textbooks_for_blog;

    extract( $args );

    $current_blog = get_current_blog_id();


    //if fetch_all is true (eg. for content creator / admin), get full list of textbooks
    if ($fetch_all) {
        switch_to_blog( 1 );
        $textbooks = get_terms( 'textbook', $args );
        $count_args = $args;
        $count_args['fields'] = 'count';
        $count_args['number'] = '';
        $count_total = get_terms( 'textbook', $count_args );
        switch_to_blog( $current_blog );
    } //if filtering for a particular class, get textbooks based on which class they belong to
    else if (is_numeric( $class_id ) || $class_id == '0')
        $textbooks = get_textbooks_for_class( $class_id );

    //get textbooks for logged in user depending on the class the user belongs to
    //generally used for logged in students
    else{
        $textbooks = get_textbooks_for_user( $user_id );
    }


    if (is_wp_error( $textbooks ))
        return false;

    $data = array();
    if (is_array( $textbooks )) {

        $division=0;
        if(isset($args['division']))
            $division = $args['division'];

        foreach ($textbooks as $book){
            $book= get_book( $book,$division,$user_id );
            if($book)
                $data[]= $book;
        }


    }
    $textbooks_data['data'] = $data;
    $textbooks_data['count'] = $count_total;

    return $textbooks_data;
}

function get_textbooksids_for_current_blog(){

    global $wpdb;

    $class_ids= $wpdb->get_results("SELECT class_id FROM {$wpdb->prefix}class_divisions",ARRAY_A);

    $class_ids=__u::flatten($class_ids);
    $class_ids=__u::unique($class_ids);

    $textbooks= $wpdb->get_results("SELECT textbook_id, class_id FROM {$wpdb->base_prefix}textbook_relationships");

    $blog_textbooks=array();

    foreach($textbooks as $book){
        $book_classes = maybe_unserialize($book->class_id);

        if($book_classes){
            $contains = __u::intersection($book_classes,$class_ids );

            if ($contains){
                $blog_textbooks[]=$book->textbook_id;
            }
        }

    }
    return $blog_textbooks;

}

function get_book( $book, $division=0,$user_id=0) {
    global $wpdb;
    $current_blog = get_current_blog_id();

    switch_to_blog( 1 );

    if (is_numeric( $book )) {
        $book_id = $book;
        $book_dets = get_term( $book, 'textbook' );

        if(!$book_dets)
            return false;

    } else if (is_numeric( $book->term_id )) {
        $book_id = $book->term_id;
        $book_dets = $book;

    } else {
        return false;
    }

    //$book_dets = array();

    $additional = get_option( 'taxonomy_' . $book_id );
    $coverid = $additional['attachmentid'];
    $book_dets->thumbnail = wp_get_attachment_image( $coverid, 'thumbnail' );
    $book_dets->cover_pic = wp_get_attachment_image( $coverid, 'large' );
    $book_dets->author = $additional['author'];

    $classes = $wpdb->get_row( "select class_id, tags from {$wpdb->base_prefix}textbook_relationships
                where textbook_id=" . $book_id, ARRAY_A );

    $book_dets->classes = maybe_unserialize( $classes['class_id'] );
    $book_dets->subjects = maybe_unserialize( $classes['tags'] );

    
    $modules_count_query=$wpdb->prepare("
        SELECT count(id) as count FROM `{$wpdb->base_prefix}content_collection`
            WHERE term_ids LIKE %s AND post_status like %s AND type like %s",
        array('%"'. $book_id . '";%', 'publish', 'teaching-module')
    );
    $teaching_modules = $wpdb->get_row( $modules_count_query );
    $book_dets->teaching_modules = (int) $teaching_modules->count;

    $quiz_count_query=$wpdb->prepare("SELECT
        SUM( CASE
                WHEN m.meta_value = 'practice' THEN 1 ELSE 0 END
            ) as practice,
        SUM( CASE
                WHEN m.meta_value = 'test' 
                THEN 1 ELSE 0  END
            ) as test,
        SUM( CASE
                WHEN m.meta_value = 'class_test' 
                THEN 1 ELSE 0  END
            ) as class_test

        FROM `{$wpdb->base_prefix}content_collection` c, {$wpdb->base_prefix}collection_meta m
        WHERE c.term_ids LIKE %s 
            AND c.post_status LIKE %s 
            AND c.type LIKE %s
            AND c.id = m.collection_id
            AND m.meta_key LIKE %s",
            
        array('%"'. $book_id . '";%', 'publish', 'quiz', 'quiz_type')
    );
    $quizzes_count = $wpdb->get_row( $quiz_count_query );

    $book_dets->class_test_count = (int) $quizzes_count->class_test;
    $book_dets->practice_count = (int) $quizzes_count->practice;
    $book_dets->take_at_home_count = (int) $quizzes_count->test;

    $questions_count = $wpdb->get_row( "SELECT count(meta_id) as count FROM `{$wpdb->base_prefix}postmeta` where meta_key='textbook' and meta_value=" . $book_id );
    $book_dets->questions_count = (int) $questions_count->count;

    $args = array( 'hide_empty' => false,
        'parent' => $book_id,
        'fields' => 'count' );

    $subsections = get_terms( 'textbook', $args );

    $book_dets->chapter_count = ($subsections) ? $subsections : 0;

    if ($division != 0 && $book_dets->parent === 0){
        $textbook_status = get_status_for_textbook($book_id, $division);
        $book_dets->chapters_completed = sizeof($textbook_status['completed']);
        $book_dets->chapters_in_progress = sizeof($textbook_status['in_progress']);
        $book_dets->chapters_not_started = sizeof($textbook_status['not_started']);

    }


    restore_current_blog();

    if ($division && $book_dets->parent === 0){
        $textbook_status = get_status_for_textbook($book_id, $division);
        $book_dets->chapters_completed = sizeof($textbook_status['completed']);
        $book_dets->chapters_in_progress = sizeof($textbook_status['in_progress']);
        $book_dets->chapters_not_started = sizeof($textbook_status['not_started']);

    }

    if($user_id){
        $quizzes_status = quiz_status_for_textbook($book_id,$user_id);
        $book_dets->home_test_completed    = $quizzes_status['home_test_completed'];
        $book_dets->home_test_in_progress  = $quizzes_status['home_test_in_progress'];
        $book_dets->home_test_not_started = $quizzes_count->test - ($quizzes_status['home_test_completed']+$quizzes_status['home_test_in_progress']);

        $book_dets->practice_completed    = $quizzes_status['practice_completed'];
        $book_dets->practice_in_progress  = $quizzes_status['practice_in_progress'];
        $book_dets->practice_not_started = $quizzes_count->practice - ($quizzes_status['practice_completed']+$quizzes_status['practice_in_progress']);
    
    }



    return $book_dets;
}

function get_status_for_textbook($textbook_id, $division){

    $args = array( 'hide_empty' => false,
        'parent' => $textbook_id,
        'fields' => 'ids' );

    switch_to_blog( 1 );
    $chapters = get_terms( 'textbook', $args );
    
    restore_current_blog();
    
    $completed = $in_progress = $not_started = array();

    foreach($chapters as $chapter){
        $chapter_status = get_status_for_chapter($chapter, $division);

        //if there isnt any modules for the chapter, mark the chapter as not started
        if (sizeof($chapter_status['all_modules']) ==0)
            $not_started[]= $chapter;

        elseif(sizeof($chapter_status['all_modules']) == sizeof($chapter_status['completed']))
            $completed[]=$chapter;

        elseif(sizeof($chapter_status['in_progress']) > 0 || sizeof($chapter_status['completed']) > 0)
            $in_progress[]=$chapter;

        else
            $not_started[]= $chapter;

    }

    $textbook_status= array(
        'completed' => $completed,
        'in_progress'=> $in_progress,
        'not_started'=> $not_started
    );

    return $textbook_status;
}

function get_status_for_chapter($chapter_id, $division){

    global $wpdb;
    
    restore_current_blog();
    
    if(!(int)$chapter_id || ! (int) $division)
        return false;

    $completed = $in_progress = $not_started = array();

    $module_ids_query = $wpdb->prepare("SELECT id FROM {$wpdb->base_prefix}content_collection
        WHERE term_ids like %s AND post_status like %s AND type like %s",
        array('%"' . $chapter_id . '";%', 'publish', 'teaching-module')
    );

    $module_ids = $wpdb->get_results($module_ids_query);
    
    if($module_ids){
        foreach($module_ids as $module){
            $module_status = get_content_module_status($module->id, $division);

            if($module_status['status']=='completed')
                $completed[]=$module->id;

            elseif($module_status['status']=='started')
                $in_progress[]=$module->id;

            else
                $not_started[]= $module->id;

        }
    }

    $chapter_status= array(
        'all_modules' => $module_ids,
        'completed' => $completed,
        'in_progress'=> $in_progress,
        'not_started'=> $not_started
    );

    return $chapter_status;

}

//fetching textbooks list based on the classid passed
function get_textbooks_for_class( $classid ) {
    global $wpdb;

    $data = array();

    //$class= '"$classid";';

    //get the class_id from serialized array in db in the format "2";

    $txtbooks_assigned = get_assigned_textbooks();
    $txtbooks_assigned = __u::compact( $txtbooks_assigned );

    if ($txtbooks_assigned) {
        $tids = implode( ',', $txtbooks_assigned );

        $txtbook_qry = $wpdb->prepare( "select textbook_id from {$wpdb->base_prefix}textbook_relationships
            where textbook_id in ($tids) and class_id like %s", '%"' . $classid . '";%' );

        $textbook_ids = $wpdb->get_results( $txtbook_qry );

        if (is_array( $textbook_ids )) {
            foreach ($textbook_ids as $book) {
                $bookdets = get_book( $book->textbook_id );
                if($bookdets)
                    $data[] = $bookdets;
            }
        }
    }
    return $data;
}

function get_assigned_textbooks( $user_id = '' ) {
    
    global $wpdb;
    
    if ($user_id == '')
        $user_id = get_current_user_id();
    
    if(user_can($user_id, 'administrator') || user_can($user_id, 'school-admin') || user_can($user_id, 'content-creator')){

        switch_to_blog(1);
        $txtbook_ids = get_terms(
                'textbook', 
                array(
                    'hide_empty'=>false, 
                    'fields'=>'ids')
                );
        restore_current_blog();
    }
    
    elseif(user_can($user_id, 'student')){
        
        $division_id = get_user_meta(get_current_user_id(), 'student_division',true);
        $division = fetch_single_division($division_id);
        
        $class_id= $division['class_id'];
        
        $query= $wpdb->prepare(
                "SELECT textbook_id from {$wpdb->base_prefix}textbook_relationships 
                    WHERE class_id like %s",
                '%"'.$class_id.'";%'
                );
                
        $txtbook_ids= $wpdb->get_col($query);
        
    }
    
    else{

        $txtbooks_assigned = get_user_meta( $user_id, 'textbooks', true );

        $txtbook_ids = maybe_unserialize( $txtbooks_assigned );
    }
    
    return $txtbook_ids;
}

/**
 *
 * @param type $user_id
 * @return type array
 */
function get_textbooks_for_user( $user_id = '' ) {

    $data = array();

    $txtbooks_assigned = get_assigned_textbooks( $user_id );
    if (is_array( $txtbooks_assigned )) {
        foreach ($txtbooks_assigned as $book) {
            $bookdets = get_book( $book );
            if($bookdets)
                $data[] = $bookdets;
        }
    }
    return $data;
}

function get_chapter_subsections( $args = array() ) {
    // set defaults


    $defaults = array(
        'hide_empty' => false,
        'child_of' => 0,
        'orderby' => 'name',
        'order' => 'asc',
        //'number'=>2,
        'user_id' => get_current_user_id(),
        'class_id' => ''
    );

    $args = wp_parse_args( $args, $defaults );
    extract( $args );

    $sections_full = get_terms( 'textbook', $args );

    $count_args = $args;
    $count_args['fields'] = 'count';
    $count_args['number'] = '';
    $count_total = get_terms( 'textbook', $count_args );

    $sections['data'] = $sections_full;
    $sections['count'] = $count_total;

    return $sections;
}


function get_textbook_subject($textbook_id){

    global $wpdb;

    if(!$textbook_id)
        return false;

    $textbook_relationships_table = $wpdb->base_prefix . "textbook_relationships";

    $module_subject_query = $wpdb->prepare(
        "SELECT tags FROM $textbook_relationships_table
                WHERE textbook_id = %d",
        $textbook_id
    );

    $subject=$wpdb->get_var($module_subject_query);

    $subject = maybe_unserialize($subject);
    $subject = __u::flatten($subject);

    if($subject)
        $subject = join(',', $subject);

    return $subject;

}

function user_has_access_to_textbook($textbook,$user_id=0){

    if(!$user_id)
        $user_id = get_current_user_id();

    if(!$textbook)
        return false;

    $has_access = false;

    $assigned = get_assigned_textbooks($user_id);

    if($assigned && sizeof($assigned)>0)

        if(in_array($textbook, $assigned))
            $has_access = true;
    
    return $has_access;

}