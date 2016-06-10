
<?php

function get_sections($chapids){ 
  
    global $wpdb;
    $chap_ids = $sect_data = $sect_da = array();
    $chapids = trim($chapids,',');
    $chap_ids = split(',',$chapids);
    foreach ($chap_ids as $chapid) {
    if($chapid == '' || $chapid == null){
        return $sect_da;
        }
    $section_data = $wpdb->get_results("SELECT ter.name , ter.term_id, tax.parent, term2.name AS chapter_name FROM wp_terms AS ter
                                    LEFT JOIN wp_term_taxonomy AS tax ON ter.term_id=tax.term_id
                                    LEFT JOIN wp_terms AS term2 ON tax.parent = term2.term_id
                                    WHERE tax.parent = '".$chapid."'
                                    ORDER BY ter.name");
    $sect_da = array_merge($section_data,$sect_da);
    }

    return $sect_da;
}



function get_chapters($textbook_id){ 
    global $wpdb;
    $textids = $chapter_data = $chapter_da = array();

    $chapter_data = $wpdb->get_results("SELECT ter.name , ter.term_id, tax.parent FROM wp_terms AS ter
                                    LEFT JOIN wp_term_taxonomy AS tax ON ter.term_id=tax.term_id
                                    WHERE tax.parent = '".$textbook_id."'
                                    ORDER BY ter.name");

    return $chapter_data;
}

function text_data(){

   $data = apply_filters('wp_ajax_get-textbooks', 'fetch_all');
   return $data;
}



function textbook_name($id_text)
{
    
    global $wpdb;
    $textbooks = $wpdb->get_results("SELECT name FROM wp_terms WHERE term_id='".$id_text."'");
    return $textbooks;
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

    $content_layout = $data['json'];

    update_post_meta ($content_id, 'layout_json',$content_layout);

    update_post_meta ($content_id, 'content_type',$data['content_type']);

    update_post_meta ($content_id, 'question_type',$data['question_type']);

    update_post_meta ($content_id, 'textbook',$data['term_ids']['textbook']);

    update_post_meta ($content_id, 'difficulty_level', $data['difficulty_level']);

//    negative marks for student question
//    if($data['content_type'] == 'student_question'){
//        update_post_meta ($content_id, 'negative_marks', $data['negative_marks']);
//    }


    // get all params for this content piece
    $allParams = $wpdb->get_results( "SELECT meta_key FROM {$wpdb->base_prefix}postmeta WHERE post_id = $content_id AND meta_key LIKE 'parameter_%'",ARRAY_N);
    // delete them
    foreach ($allParams as $params)
        delete_post_meta ($content_id,$params[0]);

    //add new set of parameters & attributes
    if (isset($data['grading_params'])){
        foreach($data['grading_params'] as $grading_parameter){

            if($grading_parameter['parameter'] == '' || sizeOf($grading_parameter['attributes']) == 0)
                continue;
            else{
                $meta_key = "parameter_" . $grading_parameter['parameter'];
                $meta_value = $grading_parameter['attributes'];
                add_post_meta ($content_id, $meta_key,$meta_value);
            }
        }
    }

    $content_piece_additional = array(
        'term_ids'          => $data['term_ids'],
        'duration'          => $data['duration'],
        'post_tags'         => $data['post_tags'],
        'instructions'      => $data['instructions'],
        'hint_enable'       => $data['hint_enable'],
        'hint'              => $data['hint'],
        'comment_enable'    => $data['comment_enable'],
        'comment'           => $data['comment'],
        'last_modified_by'  => $post_author
    );

    if($data['post_status']=='publish')
        $content_piece_additional['published_by']=$post_author;

    $content_piece_meta= $content_piece_additional;

    update_post_meta ($content_id, 'content_piece_meta',$content_piece_meta);

    update_post_meta ($content_id, 'term_ids',$data['term_ids']);

    if(isset($data['clone_id'])){
        clone_json_of_content_piece($content_id, $data['clone_id']);
    }

    return $content_id;
}

function save_content_element($element_details){

    global $wpdb;

    #make sure all post values are without slashes before serializing
    foreach($element_details as $key=>$value)
        $element_details[$key]= wp_unslash($value);

    $meta_id = (isset($element_details['meta_id']))?$element_details['meta_id']:0;

    if($meta_id)
        update_metadata_by_mid('post', $meta_id, $element_details, 'content_element');

    else{
        $element_details=  maybe_serialize($element_details);
        $query= $wpdb->prepare("insert into {$wpdb->prefix}postmeta values ('',%d,'content_element',%s)", array(0,$element_details));
        $wpdb->query($query);
        $meta_id= $wpdb->insert_id;
    }

    return $meta_id;

}


