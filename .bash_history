ls
rm -Rf wp-config-sample.php
touch test.html
ls
git clone https://github.com/ajency/Walnut.git
git clone https://naizy@github.com/ajency/Walnut.git
ls
cd Walnut
ls
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git add wp-content/themes/walnut/modules/content-pieces/functions.php
git commit
git status
git commit
git status
git reset HEAD wp-content/themes/walnut/modules/content-pieces/functions.php
git status
git pull origin master
git checkout wp-content/themes/walnut/modules/content-pieces/functions.php
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git checkout -- wp-content/uploads/2014/04/correct_answer-150x150.jpg
git pull origin master
git checkout -- wp-content/uploads/2014/04/correct_answer.jpg
git pull origin master
git checkout -- wp-content/uploads/2014/04/correct_answer.jpg
git pull origin master
git checkout -- wp-content/uploads/2014/04/image-01-1024x576.jpg
git status
git pull origin master
git checkout -- wp-content/uploads
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 22/05/14
 * Time: 5:15 PM
 */
function export_tables_for_app($blog_id='', $last_sync='', $user_id=''){
    if($blog_id=='');         $blog_id=get_current_blog_id();
    $current_blog= get_current_blog_id();
    switch_to_blog($blog_id);
    global $wpdb;
    $tables_to_export= get_tables_to_export($blog_id, $last_sync, $user_id);
    $exported_tables= prepare_csvs_for_export($tables_to_export);
    $uploads_dir=wp_upload_dir();
    $random= rand(9999,99999);
        mkdir($uploads_dir['basedir'].'/tmp',0777);
        mkdir($uploads_dir['basedir'].'/tmp/downsync',0777);
        mkdir($uploads_dir['basedir'].'/tmp/upsync',0777);
    $upload_path= '/tmp/downsync/csvs-'.$random.date('Ymdhis').'.zip';
    $result = create_zip($exported_tables, $uploads_dir['basedir'].$upload_path);
    $uploaded_url= $uploads_dir['baseurl'].$upload_path;
    switch_to_blog($current_blog);
    $export_details['exported_csv_url']=$uploaded_url;
    $export_details['last_sync']=date('Y-m-d h:i:s');
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
        "{$wpdb->base_prefix}options",
        "{$wpdb->base_prefix}terms",
        "{$wpdb->base_prefix}term_relationships",
        "{$wpdb->base_prefix}term_taxonomy",
        "{$wpdb->base_prefix}textbook_relationships",
        "{$wpdb->base_prefix}usermeta",
        //CHILD SITE TABLE QUERIES
        "{$wpdb->prefix}class_divisions",
        "{$wpdb->prefix}question_response",
        "{$wpdb->prefix}question_response_logs",
        "{$wpdb->prefix}training_logs"
    );
    // USER AND USERMETA TABLES ARE CUSTOM QUERIED AND ONLY BLOG RELATED RECORDS ARE FETCHED
    $tables_list[]= get_user_table_query($blog_id);
    //$tables_list[]= get_usermeta_table_query($blog_id);
    // POST, POST META, COLLECCTION and COLLECTION META TABLES ARE FETCHED BASED ON LAST SYNCED
    if(SYNCEDlast_sync){
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
        $tables_list[]= get_posts_table_query($last_sync, $user_id);
        $tables_list[]= get_postmeta_table_query($last_sync, $user_id);
        $tables_list[]= get_collection_table_query($last_sync, $user_id);
        $tables_list[]= get_collectionmeta_table_query($last_sync, $user_id);
    }
    return $tables_list;
}
function get_user_table_query($blog_id){
    global $wpdb;
    if(;blog_id)
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
    $user_meta_query = $wpdb->prepare(
        "SELECT * FROM
            {$wpdb->base_prefix}usermeta",
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
    if(;last_sync)
        return false;
    if($user_id);         $user_content_pieces=get_content_pieces_for_user($user_id);
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
function get_postmeta_table_query($last_sync='', $user_id=''){
    global $wpdb;
    if(;last_sync)
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
function get_collection_table_query($last_sync='', $user_id=''){
    global $wpdb;
    if(;last_sync)
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
    if(;last_sync)
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
    if(;user_id)
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
    if({user_id);         return false;     global $wpdb;     $content_pieces=array();
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
    if($sql_query== '');         $sql_query = "select * from $table";     // Gets the data from the database;     $result = mysql_query($sql_query);
    if(;result)
        return false;
    $fields_cnt = mysql_num_fields($result);
    $schema_insert = '';
    for ($i = 0; $i < $fields_cnt; $i++)
    {         $l = $csv_enclosed . str_replace($csv_enclosed, $csv_escaped . $csv_enclosed,
                stripslashes(mysql_field_name($result, $i))) . $csv_enclosed;
        $schema_insert .= $l;
        $schema_insert .= $csv_separator;
    } // end for
    $output = trim(substr($schema_insert, 0, -1));
    $output .= $csv_terminated;
    // Format the data
    while ($row = mysql_fetch_array($result))
    {         $schema_insert = '';         for ($j = 0; $j < $fields_cnt; $j++)
        {             if ($row[$j] == '0' || $row[$j] != '');             {                 if ($csv_enclosed == '');                 {                     $schema_insert .= $row[$j];                 } else
                {                     $schema_insert .= $csv_enclosed .;                         str_replace($csv_enclosed, $csv_escaped . $csv_enclosed, $row[$j]) . $csv_enclosed;
                }
            } else
            {                  }
            if ($j < $fields_cnt - 1);             {                 $schema_insert .= $csv_separator;             };         } // end for
        $output .= $schema_insert;
        $
    } // end while
    return $output;
}
/* creates a compressed zip file */
function create_zip($files = array(),$destination = '',$overwrite = false) {
    //if the zip file already exists and overwrite is false, return false
    if(file_exists($destination) && falseoverwrite) { return false; }
    //create the archive
    $zip = new ZipArchive();
    if($zip->open($destination,$overwrite ? ZIPARCHIVE::OVERWRITE : ZIPARCHIVE::CREATE) !== true) {
        return false;
    }
    //add the files
    foreach($files as $file) {
        if(isset($file['name']) &&  ($file['name'] != '') && isse
            $zip->addFromString ($file['name'].'.csv',$file['data']);
    }
    //debug
    //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;
    //close the zip -- done!
    $zip->close();
    return $destination;
}git status
git status
clear
git status
git checkout -- wp-content/themes/walnut/modules/school/csv_export_tables.php
git status
git pull origin master
git status
git checkout -- wp-content/themes/walnut/modules/school/csv_export_tables.php
git status
git checkout -- wp-content/themes/walnut/csvupload/teacher_textbooks.csv
git checkout -- wp-content/themes/walnut/csvupload/teacher.csv
git checkout -- wp-content/themes/walnut/csvupload/student.csv
git checkout -- wp-content/themes/walnut/csvupload/division.csv
git status
git remove --  {->base_prefix}collection_meta
clear
git status
git checkout -- wp-content/themes/walnut/modules/school/csv_export_tables.php
git pull origin master
ls
cd..
git status
git checkout --  wp-content/themes/walnut/modules/textbooks/functions.php
git pull origin master
git status
git status
ls
git rm -- wp_training_logs.sql
git status
git reset HEAD wp_training_logs.sql
git status
git rm --wp_training_logs.sql
git rm -- wp_training_logs.sql
git status
git add -- wp_training_logs.sql
git status
git pull origin master
ls
ssh synapsedu.info -l synapsedu
git status
ls
git pull origin master
git status
git pull origin master
git status
git pull origin master
git status
git pull origin master
ls
exit
ls
vim wp-config.php 
exit
ls
cd wp-content/themes/walnut/
ls
whoami
sudo chown -Rv synapsedu csvupload/
