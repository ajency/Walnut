<?php

function create_content_piece_post_type() {
    register_post_type('content-piece', array(
            'labels' => array(
                'name' => __('Content Piece'),
                'singular_name' => __('Content Piece'),
                'add_new_item' => 'Add New Content Piece',
                'edit_item' => 'Edit Content Piece',
                'new item' => 'New Content Piece',
                'view_item' => 'View Content Pieces',
                'not_found' => 'No Content Piece found',
                'not_found_in_trash' => 'No Content Pieces found in the trash',
                'search_items' => 'Search Content Pieces'
            ),
            'public' => true,
            'has_archive' => true,
            'supports' => array('title', 'editor', 'comments', 'thumbnail','custom-fields')
        )
    );

    register_taxonomy('textbook', 'content-piece', array('labels' => array(
        'name' => 'Textbook',
        'singular_name' => 'Textbook',
        'add_new_item' => 'Add New Textbook',
        'edit_item' => 'Edit Textbook',
        'new item' => 'New Textbook',
        'view_item' => 'View Textbooks',
        'not_found' => 'No Textbook found',
        'not_found_in_trash' => 'No Textbooks found in the trash',
        'search_items' => 'Search Textbooks'
    ), 'public' => true,
        'hierarchical' => true,
        'show_ui' => true,
        'query_var' => true));

    register_taxonomy('content-piece-tags', 'content-piece', array('labels' => array(
        'name' => 'Content Piece Tags',
        'singular_name' => 'Content Piece Tag',
        'add_new_item' => 'Add New Tag',
        'edit_item' => 'Edit Tag',
        'new item' => 'New Tag',
        'view_item' => 'View Tag',
        'not_found' => 'No Tag found',
        'not_found_in_trash' => 'No Tag found in the trash',
        'search_items' => 'Search Content Piece Tag'
    ), 'public' => true,
        'show_ui' => true,
        'query_var' => true));
}

add_action('init', 'create_content_piece_post_type');

function get_content_pieces($args = array()) {

    $current_blog_id= get_current_blog_id();

    switch_to_blog(1);

    if(isset($args['ids'])){
        $ids = implode(',',$args['ids']);
        $args['post__in'] = $args['ids'];
    }


    if(isset($args['content_type'])){

//        $content_type_meta_array = array();
//
//        foreach($args['content_type'] as $content_type){
//            $content_type_meta_array[]= array(
//                'key'     => 'content_type',
//                'value'   => $content_type,
//                'compare' => '='
//            );
//        }
//
//        $content_type_meta= array_values($content_type_meta_array);
//
//        print_r($content_type_meta); //exit;

        //NEED TO CHANGE THIS !!

        $args['meta_query']=
            array(
                'relation' => 'OR',

                array(
                    'key'     => 'content_type',
                    'value'   => 'teacher_question',
                    'compare' => '='
                ),

                array(
                    'key'     => 'content_type',
                    'value'   => 'content_piece',
                    'compare' => '='
                ),

            );

        #  print_r($args['meta_query']); exit;
    }

    $args['numberposts'] = -1;
    $args['fields'] = 'ids';

    if(!isset($args['post_status']))
        $args['post_status'] = 'any';

    $content_items = get_posts($args);


    $content_pieces=array();

    foreach ($content_items as $id) {
        $cpiece=get_single_content_piece($id);
        $cpiece->order=0;
        if(isset($args['ids']) && sizeof($args['ids'])>0){
            foreach($args['ids'] as $key=>$val){
                if($val==$id){
                    $cpiece->order=$key;
                }
            }
        }
        $content_pieces[]= $cpiece;
    }

    switch_to_blog($current_blog_id);

    return $content_pieces;

}


function get_single_content_piece($id){

    global $wpdb;

    $current_blog_id= get_current_blog_id();

    switch_to_blog(1);

    $content_piece= get_post($id);

    $authordata = get_userdata($content_piece->post_author);

    $content_piece->post_author_name = $authordata->display_name;

    $content_piece_meta_serialized=get_post_meta($id, 'content_piece_meta', true);

    $content_piece_meta= maybe_unserialize($content_piece_meta_serialized);

    if($content_piece_meta)
        extract($content_piece_meta);

    // Content Type is 'teacher question' or 'student question' etc
    $content_type = get_post_meta($id, 'content_type', true);

    $content_piece->content_type = ($content_type) ? $content_type : '--';

    //        get negative marks
//    if( $content_type == 'student_question'){
//        $negative_marks = get_post_meta($id,'negative_marks',true);
//
//        $content_piece->negative_marks = (int) $negative_marks;
//    }

    $content_piece->question_type = get_post_meta($id, 'question_type', true);

    $content_piece->post_tags = (isset($post_tags)) ? $post_tags : '';

    $content_piece->instructions = (isset($instructions)) ? $instructions : '';

    $content_piece->duration = (isset($duration)) ? $duration : '';

    $content_piece->last_modified_by='';

    if(isset($last_modified_by)){
        $last_modified_by_user=get_userdata($last_modified_by);
        $content_piece->last_modified_by = $last_modified_by_user->display_name;
    }

    $content_piece->published_by = '';

    if(isset($published_by)){
        $published_by_user=get_userdata($published_by);
        $content_piece->published_by = $published_by_user->display_name;
    }

    $content_piece->term_ids= array();
    if(isset($term_ids)){

        $term_ids = maybe_unserialize($term_ids);

        $content_piece->term_ids = $term_ids;
    }
    $content_layout= get_post_meta($id, 'layout_json', true);

    $content_layout = maybe_unserialize($content_layout);

    $excerpt = '';

    if($content_layout){
        $content_elements = get_json_to_clone($content_layout);
        $content_piece->layout = $content_elements['elements'];
        $excerpt = prettify_content_piece_excerpt($content_elements['excerpt']);
    }
    if(strlen(trim($excerpt))==0)
        $excerpt='No excerpt';
    else
        $excerpt.='...';

    $content_piece->post_excerpt =$excerpt;

    $allParams = $wpdb->get_results( "SELECT * FROM {$wpdb->base_prefix}postmeta WHERE post_id = $id
    AND meta_key LIKE 'parameter_%'",ARRAY_A);
    $grading_params = array();
    foreach ($allParams as $params){
        $paramObj = array();
        $paramObj['id'] = $params['meta_id'];
        $paramObj['parameter'] = ltrim($params['meta_key'],'parameter_');
        $paramObj['attributes'] = maybe_unserialize($params['meta_value']);
        array_push($grading_params,$paramObj);
    }
    $content_piece->grading_params = $grading_params;

    switch_to_blog($current_blog_id);

    return $content_piece;
}


function get_json_to_clone($elements, $content_id=0, $create=FALSE)
{
    $d = array();
    $excerpt= array();
    $row_elements = array('Row','TeacherQuestion','TeacherQuestRow');

    if($content_id !=0){
        $elements = get_post_meta($content_id, 'layout_json', TRUE);
        $elements= maybe_unserialize($elements);
    }

    if (is_array($elements)) {
        foreach ($elements as $element) {
            if (in_array($element['element'], $row_elements)) {
                $element['columncount'] = count($element['elements']);
                $d2= get_row_elements($element, $create);
                $d[]                    = $d2['element'];

                $excerpt[]= $d2['excerpt'];

            } else {
                $meta = get_meta_values($element, $create);
                if ($meta !== FALSE){
                    $d[] = $meta;
                    $excerpt[]=$meta['content'];
                }
            }
        }
    }
    $content['elements']= $d;
    $content['excerpt']= $excerpt;

    return $content;
}

function get_row_elements($element, $create=FALSE)
{
    $excerpt= array();
    $row_elements = array('Row','TeacherQuestion','TeacherQuestRow');

    foreach ($element['elements'] as &$column) {
        if($column['elements']){
            foreach ($column['elements'] as &$ele) {

                if(isset($column['position']))
                    $column['position']= (int) $column['position'];

                if (in_array($ele['element'],$row_elements)) {
                    $ele['columncount'] = count($ele['elements']);
                    $data= get_row_elements($ele, $create);

                    $data['element']['position']= (int) $data['element']['position'];
                    $ele = $data['element'];
                    $excerpt []= $data['excerpt'];
                } else {
                    $meta = get_meta_values($ele, $create);
                    if ($meta !== FALSE){
                        $ele = wp_parse_args($meta, $ele);
                        if($ele['element']=='Text')
                            $excerpt []= $ele['content'];
                    }
                }
            }
        }
    }

    $element['element']= $element;
    $element['excerpt']= $excerpt;

    return $element;
}

function prettify_content_piece_excerpt($excerpt_array){

    $excerpt_array = __u::flatten($excerpt_array);

    $excerpt_length =0;
    $excerpt = '';

    foreach($excerpt_array as $excerpt_item){
        $ex = trim(stripslashes(strip_tags($excerpt_item)));

        //IF CURRENT STRING HAS TEXT AND LENGTH OF EXCERPT TILL NOW IS LESS THAN 150
        //CONTINUE ADDING TO EXCERPT

        if(strlen($ex)>0 && $excerpt_length <150 ){
            $excerpt.=$ex;
            $excerpt_length += strlen($ex);
            $excerpt.=' | ';
        }
    }

    //IF EXCERPT TOTAL LENGTH IS GREATER THAN 150, REDUCE IT
    if(strlen($excerpt)>150)
        $excerpt= substr($excerpt,0,150);

    //REMOVAL OF LAST 3 CHARACTERS WHICH MAY CONTAIN THE DIVIDER
    $excerpt = substr($excerpt,0,-3);

    return $excerpt;

}

function get_meta_values($element, $create = FALSE)
{
    $meta = get_metadata_by_mid('post', $element['meta_id']);

    if (!$meta)
        return FALSE;

    $ele            = maybe_unserialize($meta->meta_value);

    if ($element['element'] == 'Mcq'){
        $allElements = &$element['elements'];
        if($allElements){
            foreach ($allElements as &$optionElements){
                foreach ($optionElements as &$optionElement){
                    $optionElement = get_meta_values($optionElement, $create);
                }
            }
        }
        $ele['elements'] = $element['elements'];
    }

    $ele['meta_id'] = $create ? create_new_element($ele) : $element['meta_id'];
    validate_element($ele);

    return $ele;
}

function validate_element(&$element)
{
    $numkeys = array('id', 'meta_id', 'menu_id', 'ID', 'image_id', 'marks',
        'columncount','optioncount','numberOfBlanks','bg_opacity','font_size');
    $boolkey = array('draggable', 'justified','case_sensitive','enableIndividualMarks','multiple');

    if (!is_array($element) && !is_object($element))
        return $element;

    foreach ($element as $key => $val) {

        if (in_array($key, $numkeys)){
            $element[$key] = (int)$val;
        }
        if (in_array($key, $boolkey))
            $element[$key] = $val === "true";
    }

    return $element;
}

function save_content_piece($data){
    global $wpdb;

    // only if post_author is set we will update it. else the current user will be set as post_author

    $post_author=(isset($data['post_author'])) ? $data['post_author'] : get_current_user_id();

    $post_array=array(
        'post_status'   => $data['post_status'],
        'post_type'     => 'content-piece',
        'post_title'    => 'content piece',
        'post_author'   => $post_author
    );

    //if ID is set the post will be updated. if not, a new post will be created
    if(isset($data['ID']))
        $post_array['ID']= $data['ID'];

    $content_id= wp_insert_post($post_array);

    if(!$content_id)
        return false;

    $content_layout = maybe_serialize($data['json']);

    update_post_meta ($content_id, 'layout_json',$content_layout);

    update_post_meta ($content_id, 'content_type',$data['content_type']);

    update_post_meta ($content_id, 'question_type',$data['question_type']);

    update_post_meta ($content_id, 'textbook',$data['term_ids']['textbook']);

//    negative marks for student question
//    if($data['content_type'] == 'student_question'){
//        update_post_meta ($content_id, 'negative_marks', $data['negative_marks']);
//    }
    $preventDelete = array();
    if (isset($data['grading_params'])){
        foreach($data['grading_params'] as $grading_parameter){
            if($grading_parameter['parameter'] == '' || sizeOf($grading_parameter['attributes']) == 0)
                continue;
            else{
                $meta_key = "parameter_" . $grading_parameter['parameter'];
                $meta_value = $grading_parameter['attributes'];
                update_post_meta ($content_id, $meta_key,$meta_value);
                array_push($preventDelete,$meta_key);
            }
        }
    }
//    get all params for this content piece
    $allParams = $wpdb->get_results( "SELECT meta_key FROM {$wpdb->base_prefix}postmeta WHERE post_id = $content_id AND meta_key LIKE 'parameter_%'",ARRAY_N);
    // delete it if absent from current update
    foreach ($allParams as $params){
        if (in_array($params[0],$preventDelete ))
            continue;
        else
            delete_post_meta ($content_id,$params[0]);

    }

    $content_piece_additional = array(
        'term_ids'          => $data['term_ids'],
        'duration'          => $data['duration'],
        'post_tags'         => $data['post_tags'],
        'instructions'         => $data['instructions'],
        'last_modified_by'  => $post_author
    );

    if($data['post_status']=='publish')
        $content_piece_additional['published_by']=$post_author;

    $content_piece_meta= maybe_serialize($content_piece_additional);

    update_post_meta ($content_id, 'content_piece_meta',$content_piece_meta);

    if(isset($data['clone_id'])){
        clone_json_of_content_piece($content_id, $data['clone_id']);
    }

    return $content_id;
}

function clone_json_of_content_piece($id, $clone_id){

    $layout_json = get_json_to_clone($layout='', $clone_id, true);

    $layout_json = maybe_serialize($layout_json['elements']);

    update_post_meta($id, 'layout_json',$layout_json);

}

function create_new_element(&$ele)
{

    global $wpdb;

    //unset the existing meta_id
    unset($ele['meta_id']);

    //handle_unavailable_fields($ele);
    //insert the element in postmeta and retunr the meta_id
    $serialized_element = maybe_serialize($ele);
    $wpdb->insert($wpdb->postmeta, array(
        'post_id'    => 0,
        'meta_value' => $serialized_element,
        'meta_key'   => 'content_element'
    ));

    return $wpdb->insert_id;
}