<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 22/05/14
 * Time: 5:15 PM
 */

function export_tables_for_app($blog_id=''){

    if($blog_id=='')
        $blog_id=get_current_blog_id();

    $exported_tables= array();
    $current_blog= get_current_blog_id();

    switch_to_blog($blog_id);

    $tables_to_export= get_tables_to_export();

    $exported_tables= prepare_for_export($tables_to_export);

    $custom_queries_to_export= get_custom_queried_tables_to_export();

    $exported_custom_queries= prepare_for_export($custom_queries_to_export);

    switch_to_blog($current_blog);

    $zip_files= array_merge($exported_tables,$exported_custom_queries);

    $uploads_dir=wp_upload_dir();

    $random= rand(9999,99999);

    if(!file_exists($uploads_dir['basedir'].'/tmp/'))
        mkdir($uploads_dir['basedir'].'/tmp',0777);

    $upload_path= '/tmp/csvs-'.$random.date('Ymdhis').'.zip';

    $result = create_zip($zip_files, $uploads_dir['basedir'].$upload_path);

    $uploaded_url= $uploads_dir['baseurl'].$upload_path;

    return $uploaded_url;
}

function prepare_for_export($tables_to_export){

    if(sizeof($tables_to_export)<1)
        return false;

    $csv_files= array();

    if(sizeof($tables_to_export)==1){
        $csv_files= export_table_to_csv($tables_to_export);
    }

    else{
        foreach($tables_to_export as $table){
            $csv_files[]= export_table_to_csv($table);
        }
    }

    return $csv_files;
}

function export_table_to_csv($table){

    $csv_files = array();

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
        $csv_files[]=$file;
    }

    return $csv_files;
}

function get_tables_to_export(){

    global $wpdb;

    $tables_list= array(

        //PARENT SITE TABLE QUERIES
        "{$wpdb->base_prefix}posts",
        "{$wpdb->base_prefix}postmeta",
        "{$wpdb->base_prefix}content_collection",
        "{$wpdb->base_prefix}collection_meta",
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

    return $tables_list;
}

function get_custom_queried_tables_to_export(){

    global $wpdb;

    $blog_id = get_current_blog_id();

    $user_table_query= "SELECT u.* FROM
                            {$wpdb->base_prefix}users u,
                            {$wpdb->base_prefix}usermeta um
                                WHERE u.ID= um.user_id
                                    AND um.meta_key='primary_blog'
                                    AND um.meta_value=".$blog_id;

    $user_meta_query = "SELECT * FROM
                            {$wpdb->base_prefix}usermeta um
                                WHERE um.meta_key='primary_blog'
                                    AND um.meta_value=".$blog_id;

    $custom_queries_to_export= array(
        array(
            'query'=> $user_table_query,
            'table_name'=> "{$wpdb->base_prefix}users"
        ),
        array(
            'query'=> $user_meta_query,
            'table_name'=> "{$wpdb->base_prefix}usermeta"
        )
    );

    return $custom_queries_to_export;

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
        $zip->addFromString ($file[0]['name'].'.csv',$file[0]['data']);
    }
    //debug
    //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

    //close the zip -- done!
    $zip->close();

    return $destination;

}