<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 22/05/14
 * Time: 5:15 PM
 */

function export_tables_for_app($blog_id='', $last_sync=''){

    if($blog_id=='')
        $blog_id=get_current_blog_id();

    $current_blog= get_current_blog_id();

    switch_to_blog($blog_id);

    $tables_to_export= get_tables_to_export($blog_id, $last_sync);

    $exported_tables= prepare_csvs_for_export($tables_to_export);

    $uploads_dir=wp_upload_dir();

    $random= rand(9999,99999);

    if(!file_exists($uploads_dir['basedir'].'/tmp/'))
        mkdir($uploads_dir['basedir'].'/tmp',0777);

    $upload_path= '/tmp/csvs-'.$random.date('Ymdhis').'.zip';

    $result = create_zip($exported_tables, $uploads_dir['basedir'].$upload_path);

    $uploaded_url= $uploads_dir['baseurl'].$upload_path;

    switch_to_blog($current_blog);

    return $uploaded_url;
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


function get_tables_to_export($blog_id, $last_sync){

    global $wpdb;

    $tables_list= array(

        // THIS FOLLOWING LIST IS OF TABLES WHOSE FULL DATA WILL BE EXPORTED EVERY TIME

        //PARENT SITE TABLE QUERIES
        "{$wpdb->base_prefix}options",
        "{$wpdb->base_prefix}terms",
        "{$wpdb->base_prefix}term_relationships",
        "{$wpdb->base_prefix}term_taxonomy",
        "{$wpdb->base_prefix}textbook_relationships",

        //CHILD SITE TABLE QUERIES
        "{$wpdb->prefix}class_divisions",
        "{$wpdb->prefix}question_response",
        "{$wpdb->prefix}question_response_logs",
        "{$wpdb->prefix}training_logs"

    );

    // USER AND USERMETA TABLES ARE CUSTOM QUERIED AND ONLY BLOG RELATED RECORDS ARE FETCHED
    $tables_list[]= get_user_table_query($blog_id);
    $tables_list[]= get_usermeta_table_query($blog_id);

    // POST, POST META, COLLECCTION and COLLECTION META TABLES ARE FETCHED BASED ON LAST SYNCED

    if(!$last_sync){
        //IF LAST SYNC TIME IS EMPTY JUST PASSING TABLE NAMES GETS ALL RECORDS IN TABLES
        array_push(
            $tables_list,
            "{$wpdb->base_prefix}posts",
            "{$wpdb->base_prefix}postmeta",
            "{$wpdb->base_prefix}content_collection",
            "{$wpdb->base_prefix}collection_meta"
        );
    }

    else{
        $tables_list[]= get_posts_table_query($last_sync);
        $tables_list[]= get_postmeta_table_query($last_sync);
        $tables_list[]= get_collection_table_query($last_sync);
        $tables_list[]= get_collectionmeta_table_query($last_sync);
    }

    return $tables_list;
}

function get_user_table_query($blog_id){

    global $wpdb;

    if(!$blog_id)
        $blog_id= get_current_blog_id();

    $args= array('role'=>'student','fields'=>'ID');
    $users= get_users($args);

    $student_ids= join(',',$users);

    $user_table_query= $wpdb->prepare(
        "SELECT u.* FROM
            {$wpdb->base_prefix}users u,
            {$wpdb->base_prefix}usermeta um
                WHERE u.ID= um.user_id
                    AND um.meta_key=%s
                    AND um.meta_value=%d
                    AND u.ID in (".$student_ids.")",
        array('primary_blog', $blog_id)
    );
    $user_table= array(
        'query'=> $user_table_query,
        'table_name'=> "{$wpdb->base_prefix}users"
    );

    return $user_table;

}

function get_usermeta_table_query($blog_id){

    global $wpdb;

    if(!$blog_id)
        $blog_id= get_current_blog_id();

    $user_meta_query = $wpdb->prepare(
        "SELECT * FROM
            {$wpdb->base_prefix}usermeta um
                WHERE um.meta_key=%s
                    AND um.meta_value=%d",
        array('primary_blog', $blog_id)
    );

    $usermeta_table= array(
        'query'=> $user_meta_query,
        'table_name'=> "{$wpdb->base_prefix}usermeta"
    );

    return $usermeta_table;
}

function get_posts_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $posts_table_query=$wpdb->prepare(
        "SELECT * FROM {$wpdb->base_prefix}posts
                WHERE post_modified > '%s'",
        $last_sync
    );
    $posts_table= array(
        'query'=> $posts_table_query,
        'table_name'=> "{$wpdb->base_prefix}posts"
    );

    return $posts_table;
}

function get_postmeta_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $postmeta_table_query=$wpdb->prepare(
        "SELECT pm.* FROM {$wpdb->base_prefix}posts p,
            {$wpdb->base_prefix}postmeta pm
                WHERE p.post_modified > '%s'
                AND p.ID = pm.post_id",
        $last_sync
    );

    $postmeta_table= array(
        'query'=> $postmeta_table_query,
        'table_name'=> "{$wpdb->base_prefix}postmeta"
    );

    return $postmeta_table;
}

function get_collection_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $collection_table_query=$wpdb->prepare(
        "SELECT * FROM {$wpdb->base_prefix}content_collection
                WHERE last_modified_on > '%s'",
        $last_sync
    );

    $collection_table= array(
        'query'=> $collection_table_query,
        'table_name'=> "{$wpdb->base_prefix}content_collection"
    );

    return $collection_table;
}

function get_collectionmeta_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $collectionmeta_table_query=$wpdb->prepare(
        "SELECT cm.* FROM {$wpdb->base_prefix}content_collection c, {$wpdb->base_prefix}collection_meta cm
                WHERE c.last_modified_on > '%s'
                AND c.ID = cm.collection_id",
        $last_sync
    );

    $collectionmeta_table= array(
        'query'=> $collectionmeta_table_query,
        'table_name'=> "{$wpdb->base_prefix}collection_meta"
    );

    return $collectionmeta_table;
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
                        str_replace($csv_enclosed, $csv_escaped . $csv_enclosed, $row[$j]) . $csv_enclosed;
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
        if($file['name'] != '' && $file['data'] !='')
            $zip->addFromString ($file['name'].'.csv',$file['data']);

    }
    //debug
    //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

    //close the zip -- done!
    $zip->close();

    return $destination;

}