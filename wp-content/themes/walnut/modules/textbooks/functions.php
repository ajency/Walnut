<?php

function extra_tax_fields($tag) {
    //check for existing taxonomy meta for term ID
    
    global $wpdb;
    $t_id = $tag->term_id;
    $term_meta = get_option("taxonomy_$t_id");
    $res = $wpdb->get_results("select class_id, tags from {$wpdb->prefix}textbook_relationships where textbook_id=" . $t_id, ARRAY_A);
    $classes= maybe_unserialize($res[0]['class_id']);
    $subjects= maybe_unserialize($res[0]['tags']);
    
    $textbook_fields = '';
    if ($tag->parent != 0)
        $textbook_fields = 'style="display:none"';
    ?>
    <tr class="form-field textbook_fields" <?= $textbook_fields ?>>
        <th scope="row" valign="top"><label for="cat_Image_url"><?php _e('Textbook Image Url'); ?></label></th>
        <td>
            <div class="row form-input">
                <div class="col-md-12 labels">
                    <input id="image-upload" type="file" name="files" class="inline image-upload"/><div id="progress" class="progress" style="display:none">
                           <img src="<?=site_url()?>/wp-content/themes/walnut/images/loader.gif">
                    </div>
                    <div id="image-container" class="success_container">
                        <?php echo $term_meta['attachmenturl'] ? '<img src="' . $term_meta['attachmenturl'] . '" height=100px>' : ''; ?>

                    </div>
                    
                    <input type="hidden" class="attachment_id" value="<?php echo $term_meta['attachmentid'] ? $term_meta['attachmentid'] : ''; ?>" name="term_meta[attachmentid]" placeholder="" class="col-md-3">
                    <input type="hidden" class="attachment_url" value="<?php echo $term_meta['attachmenturl'] ? $term_meta['attachmenturl'] : ''; ?>" name="term_meta[attachmenturl]" placeholder="" class="col-md-3">
                </div>

                <div class="form-actions">

                </div>
            </div>
        </td>
    </tr>
    <tr class="form-field  textbook_fields" <?= $textbook_fields ?>>
        <th scope="row" valign="top"><label for="extra1"><?php _e('Author Name'); ?></label></th>
        <td>
            <input type="text" name="term_meta[author]" id="term_meta[extra1]" size="25" style="width:60%;" value="<?php echo $term_meta['author'] ? $term_meta['author'] : ''; ?>"><br />
            <span class="description"><?php _e('author name'); ?></span>
        </td>
    </tr>
    <tr class="form-field textbook_fields" <?= $textbook_fields ?>>
        <th scope="row" valign="top"><label for="extra2"><?php _e('Classes Suitable For'); ?></label></th>
        <td><?
            global $class_ids;
            for ($i = 1; $i <= sizeof($class_ids); $i++) {
                $selected = '';

                if ($classes)
                    $selected = in_array($i, $classes) ? "checked" : '';
                ?>
                <input style="width:20px" type="checkbox" name="classes[]" value="<?= $i ?>" <?= $selected ?> /> <?= $class_ids[$i]['label'] ?><br>
            <? } ?>
            <br>
            <span class="description"><?php _e('classes for which this textbook is suitable for'); ?></span>
        </td>
    </tr>
   <tr> 
       <td>Subject : </td>
       <td>
           <?
            global $all_subjects;
            for ($i = 0; $i < sizeof($all_subjects); $i++) {
                $selected = '';

                if ($subjects)
                    $selected = in_array($all_subjects[$i], $subjects) ? "checked" : '';
                ?>
                <input style="width:20px" type="checkbox" name="term_tags[]" value="<?=$all_subjects[$i] ?>" <?= $selected ?> /> <?=$all_subjects[$i] ?><br>
            <? } ?>
            <br>
            <span class="description"><?php _e('subjects which this textbook belongs to'); ?></span>
         
       </td>
       
   </tr>
    <?php
}

function load_fileupload($hook) {
    if ($hook == 'edit-tags.php') {
        wp_enqueue_script('jquery-ui-widget');
        wp_enqueue_script('file-upload', get_template_directory_uri() .
                '/walnut/dev/js/plugins/jquery.fileupload.js', array(), false, true);
        wp_enqueue_script('theme-js', get_template_directory_uri() .
                '/modules/school/js/wp_global.js', array(), false, true);
    }
}

add_action('admin_enqueue_scripts', 'load_fileupload');

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

        $_FILES = array("upload_attachment" => $file);



        $attach_data = array();


        foreach ($_FILES as $file => $array) {
            $attach_id = upload_attachment($file, 0, true);
            $attachment_id = $attach_id;
            $attachment_url = wp_get_attachment_thumb_url($attach_id);
        }
    }

    echo json_encode(array('attachment_id' => $attachment_id, 'attachment_url' => $attachment_url));

    // run ajax
    die($ajax_message);
}

add_action('admin_init', 'upload_textbook_image');

// save extra taxonomy fields callback function
function save_extra_taxonomy_fields($term_id) {
    if ($_POST['parent'] > 0)
        return true;

    if (isset($_POST['term_meta'])) {
        global $wpdb;
        $t_id = $term_id;
        $term_meta = get_option("taxonomy_$t_id");
        $cat_keys = array_keys($_POST['term_meta']);
        foreach ($cat_keys as $key) {
            if (isset($_POST['term_meta'][$key])) {
                $term_meta[$key] = $_POST['term_meta'][$key];
            }
        }
        //save the option array
        update_option("taxonomy_$t_id", $term_meta);
        $classes=  maybe_serialize($_POST['classes']);
        $tags=  maybe_serialize($_POST['term_tags']);
        
        $check_exists=$wpdb->query("select id from {$wpdb->prefix}textbook_relationships where textbook_id=" . $t_id);
        if($check_exists)
            $textbooks_query="update {$wpdb->prefix}textbook_relationships set class_id= '".$classes."', tags='".$tags."'
                        where textbook_id=" . $t_id;
        else 
            $textbooks_query="insert into {$wpdb->prefix}textbook_relationships values ('','".$t_id."', '".$classes."','".$tags."')";

        $wpdb->query($textbooks_query);
    }
}

// this adds the fields
add_action('textbook_add_form_fields', 'extra_tax_fields', 10, 2);

// this saves the fields
add_action('created_textbook', 'save_extra_taxonomy_fields', 10, 2);

add_action('textbook_edit_form_fields', 'extra_tax_fields', 10, 2);
add_action('edited_textbook', 'save_extra_taxonomy_fields', 10, 2);

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

function get_textbooks($args = array()) {
    
    $current_blog = get_current_blog_id();
    switch_to_blog(1);
    // set defaults
    $defaults = array(
        'hide_empty' => false,
        'parent' => 0,
        'fetch_all' => false,
        'orderby' => 'name',
        'order' => 'asc',
        //'number'=>2,
        'user_id' => get_current_user_id(),
        'class_id' => ''
    );

    $args = wp_parse_args($args, $defaults);
    extract($args);

    //if fetch_all is true (eg. for content creator / admin), get full list of textbooks
    if ($fetch_all){
        $textbooks = get_terms('textbook', $args);
        $count_args=$args;
        $count_args['fields']='count';
        $count_args['number']='';
        $count_total = get_terms('textbook', $count_args);
    }

    //if filtering for a particular class, get textbooks based on which class they belong to
    else if (is_numeric($class_id) || $class_id=='0')
        $textbooks = get_textbooks_for_class($class_id);
    
    //get textbooks for logged in user depending on the class the user belongs to
    //generally used for logged in students
    else
        $textbooks = get_textbooks_for_user($user_id);



    if (is_wp_error($textbooks))
        return false;

    $data = array();

    if (is_array($textbooks)) {
        foreach ($textbooks as $book) {
            $data[] = get_book($book);
        }
    }
    $textbooks_data['data']=$data;
    $textbooks_data['count']=$count_total;
    
    switch_to_blog($current_blog);
    
    return $textbooks_data;
}

function get_book($book) {
    global $wpdb;
    $current_blog = get_current_blog_id();
    switch_to_blog(1);
    
    if (is_numeric($book->term_id)){
        $book_id = $book->term_id;
        $book_dets = $book;
    }
    else if (is_numeric($book)) {
        $book_id = $book;
        $book_dets=get_term($book, 'textbook');
        
    } else {
        return false;
    }

    //$book_dets = array();
    
    $additional = get_option('taxonomy_' . $book_id);
    $coverid= $additional['attachmentid'];
    $book_dets->thumbnail=wp_get_attachment_image($coverid, 'thumbnail' );
    $book_dets->cover_pic = wp_get_attachment_image($coverid, 'large' );
    $book_dets->author = $additional['author'];

    $classes = $wpdb->get_results("select class_id, tags from {$wpdb->prefix}textbook_relationships 
                where textbook_id=" . $book_id, ARRAY_A);
    $book_dets->classes= maybe_unserialize($classes[0]['class_id']);
    $book_dets->subjects= maybe_unserialize($classes[0]['tags']);
    
    $modules_count = $wpdb->get_results("SELECT count(id) as count FROM `wp_content_collection` where term_ids like '%\"".$book_id."\";%'");
    $book_dets->modules_count = $modules_count[0]->count;

    $args = array('hide_empty' => false,
        'parent' => $book_id,
        'fields' => 'count');
    
    $subsections=get_terms('textbook', $args);
    
    $book_dets->chapter_count = ($subsections)?$subsections:0;
    
    switch_to_blog($current_blog);
    return $book_dets;
}

//fetching textbooks list based on the classid passed
function get_textbooks_for_class($classid) {
    global $wpdb;
    $current_blog = get_current_blog_id();
    switch_to_blog(1);
    
    $data=array();
    
    //$class= '"$classid";';
    
    //get the class_id from serialized array in db in the format "2";
    
    $txtbooks_assigned=get_assigned_textbooks();
    
    if($txtbooks_assigned){
        $tids=implode(',',$txtbooks_assigned);
        
        $txtbook_qry= $wpdb->prepare("select textbook_id from {$wpdb->prefix}textbook_relationships 
            where textbook_id in ($tids) and class_id like %s", '%"'.$classid.'";%');

        $textbook_ids = $wpdb->get_results($txtbook_qry);

        if (is_array($textbook_ids)) {
            foreach ($textbook_ids as $book) {
                $bookdets = get_book($book->textbook_id);
                $data[]=$bookdets;
            }
        }
    }
    switch_to_blog($current_blog);
    return $data;
}

function get_assigned_textbooks($user_id='') {
    
    if($user_id=='')
        $user_id=  get_current_user_id();
    
    $txtbooks_assigned=  get_usermeta($user_id, 'textbooks');
    
    $txtbook_ids= maybe_unserialize($txtbooks_assigned);
    
    return $txtbook_ids;
    
}

/**
 * 
 * @param type $user_id
 * @return type array
 */
function get_textbooks_for_user($user_id='') {
    
    $data=array();
    
    $txtbooks_assigned=get_assigned_textbooks($user_id);
    
    if (is_array($txtbooks_assigned)) {
        foreach ($txtbooks_assigned as $book) {
            $bookdets = get_book($book->textbook_id);
            $data[]=$bookdets;
        }
    }
    return $data;
}

function get_chapter_subsections($args = array()){
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

    $args = wp_parse_args($args, $defaults);
    extract($args);
    
    $sections_full = get_terms('textbook', $args);
    
    $count_args=$args;
    $count_args['fields']='count';
    $count_args['number']='';
    $count_total = get_terms('textbook', $count_args);
    
    $sections['data']=$sections_full;
    $sections['count']=$count_total;
    
    return $sections;
}