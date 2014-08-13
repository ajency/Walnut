<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 22/05/14
 * Time: 5:15 PM
 */

/**
 * @param string $blog_id
 * @param string $last_sync if blank returns full data in the tables mentioned in get_tables_to_export function
 * if mentioned, returns the data from that time forward
 * @param string $user_id # todo: sync by textbook id. Its not going to be by user
 * @return mixed
 */

function export_tables_for_app($blog_id='', $last_sync='', $user_id='',$device_type=''){

    if($blog_id=='')
        $blog_id=get_current_blog_id();

    $current_blog= get_current_blog_id();

    switch_to_blog($blog_id);

    $tables_to_export= get_tables_to_export($blog_id, $last_sync, $user_id);

    $exported_tables= prepare_csvs_for_export($tables_to_export);

    $uploads_dir=wp_upload_dir();

    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    $upload_url = str_replace('/images', '', $uploads_dir['baseurl']);

    $random= rand(9999,99999);

    if(!file_exists($upload_directory.'/tmp/'))
        mkdir($upload_directory.'/tmp',0755);

    if(!file_exists($upload_directory.'/tmp/downsync'))
        mkdir($upload_directory.'/tmp/downsync',0755);

    if(!file_exists($upload_directory.'/tmp/upsync'))
        mkdir($upload_directory.'/tmp/upsync',0755);

    $upload_path= '/tmp/downsync/csvs-'.$random.date('Ymdhis').'.zip';

    $result = create_zip($exported_tables, $upload_directory.$upload_path);

    switch_to_blog($current_blog);

    $export_details = array();

    if($result === false){
        $export_details['error'] = true;
        $export_details['message'] = 'Failed to create export file';
    }
    else{
        $uploaded_url= $upload_url.$upload_path;
        $export_details['exported_csv_url'] = $uploaded_url;
        $export_details['last_sync']=date('Y-m-d h:i:s');
        create_sync_device_log($blog_id,$device_type,$export_details['last_sync']);
    }
    return $export_details;
}

// this function takes an array of tablenames as argument and makes an array of csv data for each table
// this csv array is then returned

function prepare_csvs_for_export($tables_to_export){

    if(sizeof($tables_to_export)<1)
        return false;

    $csv_files= array();

    foreach($tables_to_export as $table)
        $csv_files[]= export_table_to_csv($table);

    return $csv_files;
}

// individual table is taken one at a time and sent to exportMysqlToCsv function to create csv
// this generated csv is then returned to prepare_csvs_for_export function.

function export_table_to_csv($table){

    $csv_file='';

    if(is_array($table)){
        $table_name= $table['table_name'];
        $csv_data= exportMysqlToCsv($table_name, $table['query']);
    }
    else{
        $csv_data= exportMysqlToCsv($table);
        $table_name= $table;
    }

    if(trim($csv_data) != ''){
        $file['data']= $csv_data;
        $file['name']= $table_name;
        $csv_file=$file;
    }

    return $csv_file;
}


function get_tables_to_export($blog_id, $last_sync='', $user_id=''){

    global $wpdb;

    $tables_list= array(

        // THIS FOLLOWING LIST IS OF TABLES WHOSE FULL DATA WILL BE EXPORTED EVERY TIME

        //PARENT SITE TABLE QUERIES
        //"{$wpdb->base_prefix}options",
        "{$wpdb->base_prefix}terms",
        "{$wpdb->base_prefix}term_relationships",
        "{$wpdb->base_prefix}term_taxonomy",
        "{$wpdb->base_prefix}textbook_relationships",
        "{$wpdb->base_prefix}usermeta",

        //CHILD SITE TABLE QUERIES
        "{$wpdb->prefix}class_divisions",
        "{$wpdb->prefix}question_response",
        "{$wpdb->prefix}question_response_meta"

    );

    // ONLY THE RECORDS REGARDING TEXTBOOKS ADDITIONAL DATA
    // LIKE AUTHOR AND IMAGE FROM WP_OPTIONS TABLE ARE FETCHED
    $tables_list[]= get_options_table_query();

    // USER AND USERMETA TABLES ARE CUSTOM QUERIED AND ONLY BLOG RELATED RECORDS ARE FETCHED
    $tables_list[]= get_user_table_query($blog_id);
    $tables_list[]= get_usermeta_table_query($blog_id);

    // POST, POST META, COLLECCTION and COLLECTION META TABLES ARE FETCHED BASED ON LAST SYNCED

    if(!$last_sync){

        $tables_list[]= get_posts_table_query();
        $tables_list[]= get_postmeta_table_query();

        //IF LAST SYNC TIME IS EMPTY JUST PASSING TABLE NAMES GETS ALL RECORDS IN TABLES
        array_push(
            $tables_list,
            "{$wpdb->base_prefix}content_collection",
            "{$wpdb->base_prefix}collection_meta"
        );
    }

    else{
        $tables_list[]= get_posts_table_query($last_sync, $user_id);
        $tables_list[]= get_postmeta_table_query($last_sync, $user_id);
        $tables_list[]= get_collection_table_query($last_sync, $user_id);
        $tables_list[]= get_collectionmeta_table_query($last_sync, $user_id);
    }

    return $tables_list;
}


function get_options_table_query(){

    global $wpdb;

    $options_table_name= $wpdb->base_prefix.'options';

    $options_table_query= $wpdb->prepare(
        "SELECT * FROM $options_table_name
            WHERE option_name LIKE %s",
        'taxonomy%'
    );
    $options_table= array(
        'query'=> $options_table_query,
        'table_name'=> $options_table_name
    );

    return $options_table;

}

function get_user_table_query($blog_id){

    global $wpdb;

    if(!$blog_id)
        $blog_id= get_current_blog_id();

    $blog_users= get_all_user_ids();

    $user_ids= join(',',$blog_users);

    $user_table_query= $wpdb->prepare(
        "SELECT u.* FROM
            {$wpdb->base_prefix}users u,
            {$wpdb->base_prefix}usermeta um
                WHERE u.ID= um.user_id
                    AND um.meta_key=%s
                    AND um.meta_value=%d
                    AND u.ID in (".$user_ids.")",
        array('primary_blog', $blog_id)
    );
    $user_table= array(
        'query'=> $user_table_query,
        'table_name'=> "{$wpdb->base_prefix}users"
    );

    return $user_table;

}

function get_all_user_ids(){

    $args= array('role'=>'student','fields'=>'ID');
    $students= get_users($args);


    $args= array('role'=>'teacher','fields'=>'ID');
    $teacher= get_users($args);

    $args = array('role'=>'parent','fields'=>'ID');
    $parents= get_users($args);

    $args = array('role'=>'school-admin','fields'=>'ID');
    $school_admins= get_users($args);

    $users = array_merge($students, $teacher,$parents,$school_admins);

    return $users;

}

function get_usermeta_table_query($blog_id){

    global $wpdb;

    $blog_users= get_all_user_ids();
    $user_ids= join(',',$blog_users);

    $user_meta_query = $wpdb->prepare(
        "SELECT * FROM
            {$wpdb->base_prefix}usermeta WHERE user_id in ($user_ids)",
        array('primary_blog', $blog_id)
    );

    $usermeta_table= array(
        'query'=> $user_meta_query,
        'table_name'=> "{$wpdb->base_prefix}usermeta"
    );

    return $usermeta_table;
}

function get_posts_table_query($last_sync='', $user_id=''){

    global $wpdb;

    if($user_id)
        $user_content_pieces=get_content_pieces_for_user($user_id);

    if($last_sync != '')
        $posts_table_query=$wpdb->prepare(
            "SELECT * FROM {$wpdb->base_prefix}posts
                    WHERE post_type <> %s AND post_modified > '%s'",
            array('page', $last_sync)
        );

    else 
        $posts_table_query=$wpdb->prepare(
            "SELECT * FROM {$wpdb->base_prefix}posts
                    WHERE  post_type <> %s",
            'page'
        );

    $posts_table= array(
        'query'=> $posts_table_query,
        'table_name'=> "{$wpdb->base_prefix}posts"
    );

    return $posts_table;
}

function get_postmeta_table_query($last_sync='', $user_id=''){

    global $wpdb;

    if($last_sync == ''){
        $postmeta_table_query=$wpdb->prepare(
            "SELECT pm.* FROM {$wpdb->base_prefix}postmeta pm,
                {$wpdb->base_prefix}posts p
                    WHERE p.post_type <> %s AND p.ID = pm.post_id
            UNION SELECT * FROM {$wpdb->base_prefix}postmeta WHERE post_id=0
            ",
            "page"
        );
    }
    else{

        $meta_ids_str = $post_ids_str = -1;

        $meta_ids_str = get_meta_ids_str($last_sync);
        $postmeta_table_query=$wpdb->prepare(
            "SELECT * FROM {$wpdb->base_prefix}postmeta
                    WHERE post_id in ($post_ids_str)
                    OR meta_id in ($meta_ids_str)",
            null
        );
    }    

    $postmeta_table= array(
        'query'=> $postmeta_table_query,
        'table_name'=> "{$wpdb->base_prefix}postmeta"
    );

    return $postmeta_table;
}


function get_meta_ids_str($last_sync){

    global $wpdb;

    $element_metas=$wpdb->prepare(
        "SELECT p.ID, pm.meta_value as layout FROM
        {$wpdb->base_prefix}posts p, {$wpdb->base_prefix}postmeta pm
        WHERE p.post_modified > %s AND p.ID = pm.post_id AND pm.meta_key like %s",
        array($last_sync,'layout_json')
    );

    $elements= $wpdb->get_results($element_metas, ARRAY_A);

    $post_ids= __u::pluck($elements, 'ID');

    if($post_ids)
        $post_ids_str=join(',',$post_ids);

    $layouts =  __u::pluck($elements, 'layout');

    if(is_array($layouts)){
        foreach($layouts as $ele){
            $layout = maybe_unserialize($ele);
            $layout = maybe_unserialize($layout);

            $meta_ids= array();
            if($layout){
                foreach($layout as $l){
                    $meta_ids= get_meta_ids($l, $meta_ids);
                }
            }

            if(sizeof($meta_ids>0))
                $meta_ids_str = join(',',__u::compact($meta_ids));
        }
    }

    return $meta_ids_str;

}


function get_meta_ids($layout, &$meta_ids)
{
    $row_elements = array('Row','TeacherQuestion','TeacherQuestRow');

    if($layout['elements']){
        foreach ($layout['elements'] as &$column) {
            if($column['elements']){
                foreach ($column['elements'] as &$ele) {
                    if (in_array($ele['element'],$row_elements)) {
                        $ele['columncount'] = count($ele['elements']);
                        get_meta_ids($ele,$meta_ids);
                    }
                    else
                        $meta_ids[]= $ele['meta_id'];
                }
            }
        }
    }
    $meta_ids[]= $layout['meta_id'];

    return $meta_ids;
}

function get_collection_table_query($last_sync='', $user_id=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $collectionStr = '';

    if($user_id){
        $collection_ids=get_collection_ids_for_user($user_id);
        $collection_ids= join(',',$collection_ids);
        $collectionStr = "AND id in ($collection_ids)";
    }

    $collection_table_query=$wpdb->prepare(
        "SELECT * FROM {$wpdb->base_prefix}content_collection
                WHERE last_modified_on > '%s'"
        .$collectionStr,
        $last_sync
    );

    $collection_table= array(
        'query'=> $collection_table_query,
        'table_name'=> "{$wpdb->base_prefix}content_collection"
    );

    return $collection_table;
}

function get_collectionmeta_table_query($last_sync='', $user_id=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $collectionStr = '';

    if($user_id){
        $collection_ids=get_collection_ids_for_user($user_id);
        $collection_ids= join(',',$collection_ids);
        $collectionStr = "AND cm.collection_id in ($collection_ids)";
    }

    $collectionmeta_table_query=$wpdb->prepare(
        "SELECT cm.* FROM {$wpdb->base_prefix}content_collection c, {$wpdb->base_prefix}collection_meta cm
                WHERE c.last_modified_on > '%s'
                AND c.ID = cm.collection_id"
        .$collectionStr,
        $last_sync
    );

    $collectionmeta_table= array(
        'query'=> $collectionmeta_table_query,
        'table_name'=> "{$wpdb->base_prefix}collection_meta"
    );

    return $collectionmeta_table;
}

function get_collection_ids_for_user($user_id){

    global $wpdb;

    if(!$user_id)
        return false;

    $textbook_ids= get_user_meta($user_id, 'textbooks', true);

    $textbook_ids_str= '';

    if($textbook_ids){
        $textbook_ids_str = join(',',$textbook_ids);
    }


    $collection_table_query = $wpdb->prepare(
        "SELECT cc.id FROM
            {$wpdb->base_prefix}content_collection cc,
            {$wpdb->base_prefix}collection_meta cm
            WHERE
                cc.id = cm.collection_id
                AND cm.meta_key=%s
                AND cm.meta_value in ($textbook_ids_str)",
        'textbook'
    );

    $collection_ids= $wpdb->get_results($collection_table_query,ARRAY_A);

    $collection_ids= __u::flatten($collection_ids);

    return $collection_ids;
}

function get_content_pieces_for_user($user_id){

    if(!$user_id)
        return false;

    global $wpdb;

    $content_pieces=array();

    $collection_ids=get_collection_ids_for_user($user_id);

    if($collection_ids){
        $collection_id_str= join(',',$collection_ids);
        $collection_content_pieces= $wpdb->prepare(
            "SELECT meta_value from {$wpdb->base_prefix}collection_meta
                WHERE meta_key = %s and collection_id in ($collection_id_str)",
            array("content_pieces")
        );

        $content_pieces_result = $wpdb->get_results($collection_content_pieces);

        if($content_pieces_result){
            foreach($content_pieces_result as $content){
                $content_pieces[]= maybe_unserialize($content->meta_value);
            }

            $content_pieces= __u::flatten($content_pieces);
        }

    }


    return $content_pieces;

}

function exportMysqlToCsv($table, $sql_query=''){
    $csv_terminated = "\n";
    $csv_separator = ",";
    $csv_enclosed = '"';
    $csv_escaped = "\\";

    //debug- see the list of tables being exported
    //echo $table; echo '<br><br>';

    if($sql_query== '')
        $sql_query = "select * from $table";

    // Gets the data from the database
    $result = mysql_query($sql_query);

    if(!$result)
        return false;

    $fields_cnt = mysql_num_fields($result);


    $schema_insert = '';

    for ($i = 0; $i < $fields_cnt; $i++)
    {
        $l = $csv_enclosed . str_replace($csv_enclosed, $csv_escaped . $csv_enclosed,
                stripslashes(mysql_field_name($result, $i))) . $csv_enclosed;
        $schema_insert .= $l;
        $schema_insert .= $csv_separator;
    } // end for

    $output = trim(substr($schema_insert, 0, -1));
    $output .= $csv_terminated;

    // Format the data
    while ($row = mysql_fetch_array($result))
    {
        $schema_insert = '';
        for ($j = 0; $j < $fields_cnt; $j++)
        {
            if ($row[$j] == '0' || $row[$j] != '')
            {

                if ($csv_enclosed == '')
                {
                    $schema_insert .= $row[$j];
                } else
                {
                    $schema_insert .= $csv_enclosed .
                        str_replace($csv_enclosed, $csv_escaped . $csv_enclosed, stripslashes($row[$j])) . $csv_enclosed;
                }
            } else
            {
                $schema_insert .= '';
            }

            if ($j < $fields_cnt - 1)
            {
                $schema_insert .= $csv_separator;
            }
        } // end for

        $output .= $schema_insert;
        $output .= $csv_terminated;
    } // end while

    return $output;

}

/* creates a compressed zip file */
function create_zip($files = array(),$destination = '',$overwrite = false) {

    //if the zip file already exists and overwrite is false, return false
    if(file_exists($destination) && !$overwrite) { return false; }

    //create the archive
    $zip = new ZipArchive();
    if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
        return false;
    }
    //add the files

    foreach($files as $file) {
        if(isset($file['name']) &&  ($file['name'] != '') && isset($file['data']) && ($file['data'] !=''))
            $zip->addFromString ($file['name'].'.csv',$file['data']);

    }
    //debug
    //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

    //close the zip -- done!
    $zip->close();

    return $destination;

}

/*
 * insert device sync log entry on every sync
 */
function create_sync_device_log($blog_id,$device_type,$last_sync){
    global $wpdb;

    $record_data = array('blog_id'=>$blog_id,'device_type'=>$device_type,'sync_date' =>$last_sync); 
    $wpdb->insert( $wpdb->base_prefix . "sync_device_log", $record_data );
    
}