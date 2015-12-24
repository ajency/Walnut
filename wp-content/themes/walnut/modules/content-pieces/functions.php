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
    
    global $wpdb;
    
    $current_blog_id= get_current_blog_id();

    switch_to_blog(1);

    if(isset($args['exclude'])){
        $args['exclude'] = $args['exclude'];
    }

    if(isset($args['ids'])){
        $ids = implode(',',$args['ids']);
        $args['post__in'] = $args['ids'];
    }
    
    if(isset($args['textbook'])){
        
        $post_ids= $wpdb->prepare(
                "SELECT post_id from {$wpdb->base_prefix}postmeta WHERE meta_key LIKE %s
                    AND meta_value like %s",
                array('term_ids', '%"'.$args['textbook'].'";%')                
        );
        $textbook_posts=$wpdb->get_col($post_ids);
        if($textbook_posts)
            $args['post__in'] = $textbook_posts;

        else
            return false;

        unset($args['textbook']);
    }
    
    if(isset($args['content_type'])){

        $content_type_meta_array = array('relation' => 'OR');
        
        foreach($args['content_type'] as $content_type){
            $content_type_meta_array[]= array(
                'key'     => 'content_type',
                'value'   => $content_type,
                'compare' => '='
            );
        }
        $args['meta_query']=$content_type_meta_array;
    }

    $args['numberposts'] = -1;
    $args['fields'] = 'ids';

    if(!isset($args['post_status']))
        $args['post_status'] = 'any';
     
    $content_items = get_posts($args);
    
    if(isset($args['search_str']) && trim($args['search_str']) !='')
        $content_items = get_content_pieces_by_search_string($args['search_str'], $content_items);


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

        //Start Kapils code to hide archived content pieces
        if($cpiece->post_status == 'archive'){
            continue;
        }
        //End Kapils code to hide archived content pieces        
        $content_pieces[]= $cpiece;
    }

    switch_to_blog($current_blog_id);

    return $content_pieces;

}

function get_content_pieces_by_search_string($search_string, $content_pieces){

    $content_items= $excerpts= array();

    if (!is_array($content_pieces))
        return false;

    foreach($content_pieces as $id){

        $content_layout= get_post_meta($id, 'layout_json', true);

        $content_layout = maybe_unserialize($content_layout);

        $content_elements = get_json_to_clone($content_layout);

        $excerpts = $content_elements['excerpt'];

        $grading_parameters=get_grading_parameters($id);

        $excerpts[]=$grading_parameters['excerpts'];

        //get instructions for content piece
        $content_meta= get_post_meta($id,'content_piece_meta',true);

        $content_meta= maybe_unserialize($content_meta);
        
        if(isset($content_meta['post_tags'])) 
            $excerpts[] = $content_meta['post_tags'];
        
        if(isset($content_meta['instructions'])) 
            $excerpts[] = $content_meta['instructions'];

        $excerpts = __u::flatten($excerpts);

        foreach($excerpts as $excerpt){

            if(strpos(strtolower(strip_tags($excerpt)), strtolower($search_string)) !== false){
                $content_items[]=$id;
            }
        }

    }

    return $content_items;

}

function get_single_content_piece($id){

    $current_blog_id= get_current_blog_id();

    switch_to_blog(1);
    
    global $wpdb;

    $content_piece= get_post($id);

    $authordata = get_userdata($content_piece->post_author);
    $post_modified= $content_piece->post_modified; 
    $content_piece->post_modified = date('Y-m-d H:i:s',strtotime('+5 hours +30 minutes',strtotime($post_modified)));
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

    $content_piece->hint_enable = (isset($hint_enable))? $hint_enable === "true" : false;

    $content_piece->hint = (isset($hint))? $hint : '';

    $content_piece->comment_enable = (isset($comment_enable))? $comment_enable === "true" : false;

    $content_piece->comment = (isset($comment))? $comment : '';

    $content_piece->difficulty_level = (int) get_post_meta($id,'difficulty_level',true);

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

    $excerpt_array = array();
    $excerpt = '';

    if($content_layout){
        $content_elements = get_json_to_clone($content_layout);
        $content_piece->marks = 0; 
        
        if($content_elements['marks'] > 0)
           $content_piece->marks = $content_elements['marks'];

        $content_piece->layout = $content_elements['elements'];
        $excerpt_array = $content_elements['excerpt'];
    }

    $grading_details= get_grading_parameters($id);

    $content_piece->grading_params = $grading_details['parameters']; //$grading_params;

    $content_piece->present_in_modules = get_modules_containing_content_piece($id);

    $excerpt_array= array_merge($excerpt_array, $grading_details['excerpts']);

    $excerpt = prettify_content_piece_excerpt($excerpt_array);

    if(strlen(trim($excerpt))==0)
        $excerpt='No excerpt';
    else
        $excerpt.='';
        //original commented by kapil $excerpt.='...';    
    $content_piece->post_excerpt =$excerpt;
    
    switch_to_blog($current_blog_id);

    return $content_piece;
}

function get_modules_containing_content_piece($content_id){

    global $wpdb;

    if(!$content_id)
        return false;

    $modules=array();

    $present_in_query=$wpdb->prepare("
        SELECT * from {$wpdb->base_prefix}collection_meta
            WHERE meta_key in ('content_pieces', 'content_layout')
            AND meta_value like %s",
        array('%"'.$content_id.'";%')
    );

    $result= $wpdb->get_results($present_in_query);

    $valid = true;

    foreach($result as $module_meta){

        if($module_meta->meta_key === 'content_layout'){
            $content_layout = maybe_unserialize($module_meta->meta_value);
            foreach($content_layout as $layout){
                if($layout['type']=='content-piece')
                    $content_pieces[]=$layout['id'];
            }

            if(!in_array($content_id, $content_pieces))
                $valid = false;

        }

        if($valid){
            $module_dets= get_single_content_module($module_meta->collection_id);
            $m['id']=$module_dets->id;
            $m['name']=$module_dets->name;
            $m['type']=$module_dets->type;
            $modules[]=$m;
        }

    }

    return $modules;

}

//get grading parameters, attributes and excerpts

function get_grading_parameters($content_piece_id){

    global $wpdb;

    $all_params_query = $wpdb->prepare( "SELECT * FROM {$wpdb->base_prefix}postmeta WHERE post_id = %d
                    AND meta_key LIKE %s",
                    array($content_piece_id, 'parameter_%')
                );

    $allParams= $wpdb->get_results($all_params_query, ARRAY_A);

    $grading_params = $excerpt_array= array();

    foreach ($allParams as $params){
        $paramObj = array();
        $paramObj['id'] = $params['meta_id'];
        $paramObj['parameter'] =$excerpt_array[]= str_replace('parameter_','',$params['meta_key']);
        $paramObj['attributes'] =$excerpt_array[]= maybe_unserialize($params['meta_value']);
        array_push($grading_params,$paramObj);
    }

    $grading = array(
      'parameters'  => $grading_params,
      'excerpts'    => $excerpt_array
    );

    return $grading;

}

function get_json_to_clone($elements, $content_id=0, $create=FALSE)
{
    $d = array();
    $excerpt= array();
    $marks = 0;

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
                $marks += $d2['marks'];

            } else {
                $meta = get_meta_values($element, $create);
                if ($meta !== FALSE){
                    $d[] = $meta;
                    if($meta['element']=='Text')
                        $excerpt []= $meta['content'];
                    if($meta['element']=='Fib')
                        $excerpt []= $meta['text'];

                    $marks += $meta['marks'];
                }
            }
        }
    }
    $content['elements']= $d;
    $content['excerpt']= $excerpt;
    $content['marks']= $marks;

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
                    $marks += $data['marks'];
                } else {
                    $meta = get_meta_values($ele, $create);
                    if ($meta !== FALSE){
                        $ele = wp_parse_args($meta, $ele);
                        if($ele['element']=='Text')
                            $excerpt []= $ele['content'];
                        if($ele['element']=='Fib')
                            $excerpt []= $ele['text'];
                        $marks += $ele['marks'];
                    }
                }
            }
        }
    }

    $element['element']= $element;
    $element['excerpt']= $excerpt;
    $element['marks']= $marks;

    return $element;
}

function prettify_content_piece_excerpt($excerpt_array){

    $excerpt_array = __u::flatten($excerpt_array);

    $excerpt_length =0;
    $excerpt = '';

    foreach($excerpt_array as $excerpt_item){
        $ex = trim(stripslashes(strip_tags($excerpt_item)));

        //IF CURRENT STRING HAS TEXT AND LENGTH OF EXCERPT TILL NOW IS LESS THAN 500
        //CONTINUE ADDING TO EXCERPT

        if(strlen($ex)>0 && $excerpt_length <500 ){
            $excerpt.=$ex;
            $excerpt_length += strlen($ex);
            //commented by kapil $excerpt.=' | ';
        }
    }

    //IF EXCERPT TOTAL LENGTH IS GREATER THAN 500, REDUCE IT
    if(strlen($excerpt)>500)
        $excerpt= substr($excerpt,0,500);

    //REMOVAL OF LAST 3 CHARACTERS WHICH MAY CONTAIN THE DIVIDER
    //$excerpt = substr($excerpt,0,-3); commented by kapil

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

    if ($element['element'] == 'Video' || $element['element'] == 'Audio' ){
        $newUrls=array();
        if (!is_multisite()) {
            if($element['element'] == 'Video'){
                $ele['videoUrl'] = replace_media_urls($ele['videoUrl']);
                if(count ($ele['videoUrls']) > 0){
                    foreach($ele['videoUrls'] as $url){
                        $url = replace_media_urls($url);
                        $newUrls[]=$url;
                    }
                    $ele['videoUrls']=$newUrls;
                }
            }
            if($element['element'] == 'Audio'){
                $ele['audioUrl'] = replace_media_urls($ele['audioUrl']);
             if(count ($ele['audioUrls']) > 0){
                foreach($ele['audioUrls'] as $url){
                    $url = replace_media_urls($url);
                    $newUrls[]=$url;
                }
                $ele['audioUrls']=$newUrls;
             }
            }
        }
    }

    $ele['meta_id'] = $create ? create_new_element($ele) : $element['meta_id'];
    validate_element($ele);

    return $ele;
}

function validate_element(&$element)
{
    $numkeys = array('id', 'meta_id', 'menu_id', 'ID', 'image_id', 'marks','columncount',
        'optioncount','numberOfBlanks','font_size','height');
    $boolkey = array('draggable', 'justified','case_sensitive','enableIndividualMarks','multiple',
        'transparent');
    $floatkeys = array('bg_opacity');

    if (!is_array($element) && !is_object($element))
        return $element;

    foreach ($element as $key => $val) {

        if (in_array($key, $numkeys)){
            $element[$key] = (int)$val;
        }
        if (in_array($key, $boolkey))
            $element[$key] = $val === "true";

        if (in_array($key,$floatkeys))
            $element[$key] = (float)$val;
    }

    return $element;
}

function clone_json_of_content_piece($id, $clone_id){

    $layout_json = get_json_to_clone($layout='', $clone_id, true);

    $layout_json = $layout_json['elements'];

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

//Added By Kapil start to add column ID in http://synapselearning.net/wp-admin/edit-tags.php?taxonomy=textbook&post_type=content-piece page
add_filter('manage_edit-textbook_columns', 'change_columns_header', 10, 3);
function change_columns_header($columns) {
    $columns['id'] = 'ID';
    return $columns;
}

function id_column_register_sortable( $columns ) {
$columns['id'] = "ID";
return $columns;
}
add_filter( 'manage_edit-textbook_sortable_columns', 'id_column_register_sortable' );

function manage_textbook_custom_fields($deprecated,$column_name,$term_id)
{
 if ($column_name == 'id') {
   echo $term_id;
 }
}
add_filter ('manage_textbook_custom_column', 'manage_textbook_custom_fields', 10,3);

//Added By Kapil ends to add column ID in http://synapselearning.net/wp-admin/edit-tags.php?taxonomy=textbook&post_type=content-piece page