
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
        <!--<input type="text" name="term_meta[img]" id="term_meta[img]" size="3" style="width:60%;" value="<?php echo $term_meta['img'] ? $term_meta['img'] : ''; ?>"><br />
                    <span class="description"><?php _e('Image for textbook: use full url with http://'); ?></span>-->
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
            for ($i = 0; $i < sizeof($class_ids); $i++) {
                $selected = '';

                if ($classes)
                    $selected = in_array($i, $classes) ? "checked" : '';
                ?>
                <input style="width:20px" type="checkbox" name="classes[]" value="<?= $i ?>" <?= $selected ?> /> Class <?= $i ?><br>
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
            <span class="description"><?php _e('classes for which this textbook is suitable for'); ?></span>
            
         <!--  <div  id='tags_area'>
               <? if($subjects) {
                   foreach($subjects as $sub){ 
                        echo '<div class="termtags">
                             <input name=term_tags[] value="'.$sub.'">
                             <a onclick="jQuery(this).closest(\'div\').remove();" class="remove_tag">delete</a>
                        </div>';
                   }
               }
               ?>
                   
           </div>
           -->
       </td>
       
   </tr><!--
    <tr class="form-field">
    <th scope="row" valign="top"><label for="tags">Add <?php _e('Tags'); ?></label></th>
    <td>
      <input type="text" name="" id="term_meta_tags" size="10" style="width:20%;">
      <a id="tags_add">Add</a><br>
    <br>   
    </td>
    </tr>
    <script language="javascript">
        jQuery(document).ready(function($) {            
            $('#tags_add').click(function(){
                var term_val=$('#term_meta_tags').val();
                $('#tags_area').append('<div class="termtags"> \
                            <input name=term_tags[] value="'+term_val+'"> \
                            <a onclick="jQuery(this).closest(\'div\').remove();" class="remove_tag">delete</a></div>')
                $('#term_meta_tags').val('');
            });
        });

    </script>-->
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
        //echo $textbooks_query; exit;
        $wpdb->query($textbooks_query);
    }
}

// this adds the fields
add_action('textbook_add_form_fields', 'extra_tax_fields', 10, 2);

// this saves the fields
add_action('created_textbook', 'save_extra_taxonomy_fields', 10, 2);

add_action('textbook_edit_form_fields', 'extra_tax_fields', 10, 2);
add_action('edited_textbook', 'save_extra_taxonomy_fields', 10, 2);

function get_textbooks($args = array()) {
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
    $textbooks['data']=$data;
    $textbooks['count']=$count_total;
    return $textbooks;
}

function get_book($book) {
    global $wpdb;
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
    $book_dets->cover_pic = $additional['attachmenturl'];
    $book_dets->author = $additional['author'];

    $classes = $wpdb->get_results("select class_id, tags from {$wpdb->prefix}textbook_relationships 
                where textbook_id=" . $book_id, ARRAY_A);
    $book_dets->classes= maybe_unserialize($classes[0]['class_id']);
    $book_dets->subjects= maybe_unserialize($classes[0]['tags']);

    $args = array('hide_empty' => false,
        'parent' => $book_id,
        'fields' => 'count');
    
    $subsections=get_terms('textbook', $args);
    
    $book_dets->chapter_count = ($subsections)?$subsections:0;

    return $book_dets;
}

//fetching textbooks list based on the classid passed
function get_textbooks_for_class($classid) {
    global $wpdb;
    $txtbook_qry = "select textbook_id from {$wpdb->prefix}textbook_relationships where class_id=" . $classid;
    $textbook_ids = $wpdb->get_results($txtbook_qry);
    
    if (is_array($textbook_ids)) {
        foreach ($textbook_ids as $book) {
            $bookdets = get_book($book->textbook_id);
            if($bookdets->parent == 0)
                $data[]=$bookdets;
        }
    }
    return $data;
}

function get_textbooks_for_user() {
    
}