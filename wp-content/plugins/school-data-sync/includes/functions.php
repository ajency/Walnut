<?php
function school_data_sync_screen(){
    
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
	?>
	<script>
	SERVER_AJAXURL = 'http://synapsedu.info/wp-admin/admin-ajax.php';
	</script>
	<?php
	global $wpdb;
	$last_sync_status = get_last_sync_status();
        $last_sync_imported = get_last_sync_imported();
        $sync_defaults = array('label' =>'Start','lastsync'=>'','syncstatus' =>'','filepath' =>'','sync_id' => '','server_sync_id'=>'');
        if(!empty($last_sync_status)){
            $sync_defaults['sync_id'] = $last_sync_status[0]->id;
            $sync_defaults['syncstatus'] = $last_sync_status[0]->status;
            $sync_defaults['lastsync'] = $last_sync_status[0]->last_sync;
            if($last_sync_status[0]->status != 'imported'){
                 $sync_defaults['label'] = 'Continue';
                 $sync_defaults['syncstatus'] = $last_sync_status[0]->status;
                 $sync_defaults['filepath'] = $last_sync_status[0]->file_path;
                 $sync_defaults['server_sync_id'] = $last_sync_status[0]->server_sync_id;
            }
        }
        
	echo '<form>
		 <fieldset>
		 <h3>School Data Sync</h3>
                 <p>[Last Data Sync]:'.date_format(date_create($last_sync_imported[0]->last_sync), 'd/m/Y H:i:s').'</p>
	     <label>Data Sync </label> -> 
             <input type="button" name="sync-data" value="'.$sync_defaults['label'].'" '
                . 'id="sync-data" data-lastsync="'.$sync_defaults['lastsync'].'" '
                . 'data-syncstatus="'.$sync_defaults['syncstatus'].'" '
                . 'data-lastsync-id="'.$sync_defaults['sync_id'].'" '
                . 'data-file-path="'.$sync_defaults['filepath'].'" data-server-sync-id="'.$sync_defaults['server_sync_id'].'"  />
                    <span class="status-msg"></span>
		 <br/><br/>
		 <label>Media Sync</label> -> <input type="button" name="sync-media" value="Start" id="sync-media"/>
                 <span class="status-msg"></span>
		 </fieldset>
              </form>';
}

function sds_admin_scripts($hook) {

    if( 'settings_page_school_data_sync' != $hook )
        return;
    wp_enqueue_script( 'sds_custom', plugins_url( '../js/custom.js', __FILE__ ), array(), false, true );
}
add_action( 'admin_enqueue_scripts', 'sds_admin_scripts',100 );

function get_last_sync_status() {
    global $wpdb;
    $import_last_status = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}sync_local_data order by id DESC LIMIT 0,1" );
    
    return $import_last_status;
    
}

function get_last_sync_imported() {
    global $wpdb;
    $import_last_status = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}sync_local_data where status LIKE 'imported' order by id DESC LIMIT 0,1" );
    
    return $import_last_status;
    
}

function sds_download_file_local($sync_id){
    global $wpdb;
    
    $sync_record = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}sync_local_data WHERE id = %d",$sync_id ) );
    
    $url = stripslashes($sync_record->file_path);
    
    $zipFileName = get_zip_archive_name($url);
    $status = $sync_record->status;
    
    $uploads_dir=wp_upload_dir();
    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    
    if(!file_exists($upload_directory.'/tmplocal/'))
        mkdir($upload_directory.'/tmplocal',0755);

    if(!file_exists($upload_directory.'/tmplocal/downsync'))
        mkdir($upload_directory.'/tmplocal/downsync',0755);
    
    if(!file_exists($upload_directory.'/tmplocal/upsync'))
        mkdir($upload_directory.'/tmplocal/upsync',0755);

    
    $zipFile = $upload_directory.'/tmplocal/downsync/'.$zipFileName; // Local Zip File Path
    $zipResource = fopen($zipFile, "w");
    // Get The Zip File From Server
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER,true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); 
    curl_setopt($ch, CURLOPT_FILE, $zipResource);
    $executefiledownload = curl_exec($ch);
    if(!$executefiledownload) {
     $downloadstatus = false;
    }
    else{
     $downloadstatus = true;
     $status = 'downloaded';
        $wpdb->update( $wpdb->prefix . "sync_local_data",
        array('status' => $status),
        array( 'id' => $sync_id ) );
    }
    curl_close($ch);
    
    return $downloadstatus;
}

function get_local_syncrecord_status($sync_id){
    global $wpdb;
    
    $sync_status = $wpdb->get_var( $wpdb->prepare( "SELECT status FROM {$wpdb->prefix}sync_local_data WHERE id = %d",$sync_id ) );
    return $sync_status;
}

function get_zip_archive_name($url){
    $urlcomponent = parse_url($url);
    $pathinfo = explode('/',$urlcomponent['path']);
    $count = count($pathinfo);
    $filename = $pathinfo[$count-1];
    
    return $filename;        
}

function sds_mark_sync_complete($sync_id){  
    global $wpdb;
    $wpdb->update( $wpdb->prefix . "sync_local_data",
        array('status' => 'imported'),
        array( 'id' => $sync_id ) );
}  

function sds_get_tables_to_export($last_sync=''){

    global $wpdb;

    $tables_list= array(

        // THIS FOLLOWING LIST IS OF TABLES WHOSE FULL DATA WILL BE EXPORTED EVERY TIME

        //PARENT SITE TABLE QUERIES
        //"{$wpdb->base_prefix}options",
        //"{$wpdb->prefix}terms",
        //"{$wpdb->prefix}term_relationships",
        //"{$wpdb->prefix}term_taxonomy",
        //"{$wpdb->prefix}textbook_relationships",
        //"{$wpdb->prefix}usermeta",

        //CHILD SITE TABLE QUERIES
        //"{$wpdb->prefix}class_divisions",
        "{$wpdb->prefix}question_response",
        "{$wpdb->prefix}question_response_meta"

    );

    // ONLY THE RECORDS REGARDING TEXTBOOKS ADDITIONAL DATA
    // LIKE AUTHOR AND IMAGE FROM WP_OPTIONS TABLE ARE FETCHED
    //$tables_list[]= sds_get_options_table_query();

    // USER AND USERMETA TABLES ARE CUSTOM QUERIED AND ONLY BLOG RELATED RECORDS ARE FETCHED
    //$tables_list[]= get_user_table_query($blog_id);
    //$tables_list[]= get_usermeta_table_query($blog_id);

    // POST, POST META, COLLECCTION and COLLECTION META TABLES ARE FETCHED BASED ON LAST SYNCED

    /*if(!$last_sync){
        //IF LAST SYNC TIME IS EMPTY JUST PASSING TABLE NAMES GETS ALL RECORDS IN TABLES
        array_push(
            $tables_list,
            "{$wpdb->prefix}posts",
            "{$wpdb->prefix}postmeta",
            "{$wpdb->prefix}content_collection",
            "{$wpdb->prefix}collection_meta"
        );
    }

    else{
        $tables_list[]= sds_get_posts_table_query($last_sync);
        $tables_list[]= sds_get_postmeta_table_query($last_sync);
        $tables_list[]= sds_get_collection_table_query($last_sync);
        $tables_list[]= sds_get_collectionmeta_table_query($last_sync);
    }*/

    return $tables_list;
}

function sds_get_options_table_query(){

    global $wpdb;

    $options_table_name= $wpdb->prefix.'options';

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

function sds_get_posts_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $posts_table_query=$wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}posts
                WHERE post_modified > '%s'",
        $last_sync
    );

    $posts_table= array(
        'query'=> $posts_table_query,
        'table_name'=> "{$wpdb->prefix}posts"
    );

    return $posts_table;
}

function sds_get_postmeta_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    // set it so that empty file is generated if no records are to be sent
    $meta_ids_str = $post_ids_str = -1;

    $element_metas=$wpdb->prepare(
        "SELECT p.ID, pm.meta_value as layout FROM
        {$wpdb->prefix}posts p, {$wpdb->prefix}postmeta pm
        WHERE p.post_modified > %s AND p.ID = pm.post_id AND pm.meta_key like %s",
        array($last_sync,'layout_json')
    );

    $elements= $wpdb->get_results($element_metas, ARRAY_A);

    $post_ids= __u::pluck($elements, 'ID');

    if($post_ids)
        $post_ids_str=join(',',$post_ids);

    $layouts =  __u::pluck($elements, 'layout');

    foreach($layouts as $ele){
        $layout = maybe_unserialize($ele);
        $layout = maybe_unserialize($layout);

        $meta_ids= array();
        foreach($layout as $l){
            $meta_ids= sds_get_meta_ids($l, $meta_ids);
        }

        if(sizeof($meta_ids>0))
            $meta_ids_str = join(',',__u::compact($meta_ids));
    }

    $postmeta_table_query=$wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}postmeta
                WHERE post_id in ($post_ids_str)
                OR meta_id in ($meta_ids_str)",
        null
    );

    $postmeta_table= array(
        'query'=> $postmeta_table_query,
        'table_name'=> "{$wpdb->prefix}postmeta"
    );

    return $postmeta_table;
}

function sds_get_meta_ids($layout, &$meta_ids)
{
    $row_elements = array('Row','TeacherQuestion','TeacherQuestRow');

    if($layout['elements']){
        foreach ($layout['elements'] as &$column) {
            if($column['elements']){
                foreach ($column['elements'] as &$ele) {
                if (in_array($ele['element'],$row_elements)) {
                        $ele['columncount'] = count($ele['elements']);
                        sds_get_meta_ids($ele,$meta_ids);
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

function sds_get_collection_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $collectionStr = '';

    /*if($user_id){
        $collection_ids=get_collection_ids_for_user($user_id);
        $collection_ids= join(',',$collection_ids);
        $collectionStr = "AND id in ($collection_ids)";
    }*/

    $collection_table_query=$wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}content_collection
                WHERE last_modified_on > '%s'"
        .$collectionStr,
        $last_sync
    );

    $collection_table= array(
        'query'=> $collection_table_query,
        'table_name'=> "{$wpdb->prefix}content_collection"
    );

    return $collection_table;
}

function sds_get_collectionmeta_table_query($last_sync=''){

    global $wpdb;

    if(!$last_sync)
        return false;

    $collectionStr = '';

    /*if($user_id){
        $collection_ids=get_collection_ids_for_user($user_id);
        $collection_ids= join(',',$collection_ids);
        $collectionStr = "AND cm.collection_id in ($collection_ids)";
    }*/

    $collectionmeta_table_query=$wpdb->prepare(
        "SELECT cm.* FROM {$wpdb->prefix}content_collection c, {$wpdb->prefix}collection_meta cm
                WHERE c.last_modified_on > '%s'
                AND c.ID = cm.collection_id"
        .$collectionStr,
        $last_sync
    );

    $collectionmeta_table= array(
        'query'=> $collectionmeta_table_query,
        'table_name'=> "{$wpdb->prefix}collection_meta"
    );

    return $collectionmeta_table;
}

// this function takes an array of tablenames as argument and makes an array of csv data for each table
// this csv array is then returned

function sds_prepare_csvs_for_export($tables_to_export){

    if(sizeof($tables_to_export)<1)
        return false;

    $csv_files= array();

    foreach($tables_to_export as $table)
        $csv_files[]= sds_export_table_to_csv($table);

    return $csv_files;
}

// individual table is taken one at a time and sent to exportMysqlToCsv function to create csv
// this generated csv is then returned to prepare_csvs_for_export function.

function sds_export_table_to_csv($table){

    $csv_file='';

    if(is_array($table)){
        $table_name= $table['table_name'];
        $csv_data= sds_exportMysqlToCsv($table_name, $table['query']);
    }
    else{
        $csv_data= sds_exportMysqlToCsv($table);
        $table_name= $table;
    }

    if(trim($csv_data) != ''){
        $file['data']= $csv_data;
        $file['name']= $table_name;
        $csv_file=$file;
    }

    return $csv_file;
}

function sds_exportMysqlToCsv($table, $sql_query=''){
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
function sds_create_zip($files = array(),$destination = '',$overwrite = false) {

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

function get_local_uploaded_file($sync_request_id){
     global $wpdb;
    
    $sync_meta = $wpdb->get_var( $wpdb->prepare( "SELECT meta FROM {$wpdb->prefix}sync_local_data WHERE id = %d",$sync_request_id ) );
    
    $sync_meta_data = maybe_unserialize($sync_meta);
    
     if (is_string( $sync_meta_data['exported_local_csv_url'] ))
        return $sync_meta_data['exported_local_csv_url'];

    return false;
}

// media sync functions from ajax calls start
function sds_read_folder_directory( $dir, $base_URL = '' ) {

    $listDir = array();
    if ($handler = opendir( $dir )) {
        while (($sub = readdir( $handler )) !== FALSE) {

            if ($sub != "." && $sub != ".." && $sub != "Thumb.db" && $sub !== ".DS_Store") {

                if (is_file( $dir . "/" . $sub )) {

                    $listDir[] = $base_URL . '/' . $sub;

                } elseif (is_dir( $dir . "/" . $sub )) {

                    $listDir[$sub] = sds_read_folder_directory( $dir . "/" . $sub );
                }

            }
        }
        closedir( $handler );
    }
    return $listDir;
}

function sds_get_media_files_directory_json($mediatype = 'images') {
    $wp_upload_dir = wp_upload_dir();
    if($mediatype == 'images'){
     $files = sds_read_folder_directory( $wp_upload_dir['path'], $wp_upload_dir['baseurl']);   
    }else{
     $files = sds_read_folder_directory( str_replace("images", $mediatype, $wp_upload_dir['path']), 
             str_replace("images", $mediatype, $wp_upload_dir['baseurl']));
    }
    return $files;
}
function sds_get_videos_directory_json() {
    $wp_upload_dir = wp_upload_dir();

    $files = read_folder_directory( str_replace("images", "videos", $wp_upload_dir['path']), str_replace("images", "videos", $wp_upload_dir['baseurl']));
    return $files;
}

function sds_get_files_name_path($images){
    $retarray = array(); 
    foreach($images as $value){
        $fileinfo = pathinfo($value);
        $retarray[$fileinfo['basename']] = $value;
    }
    
    return $retarray;
}

function sds_get_files_difference($local_files,$server_files){
    $difference = array();
    foreach($server_files as $key =>$value){
        if (! array_key_exists($key, $local_files) ) {
            $difference[$key] = $value;
        }        
    }
    
    return $difference;
}

function sds_get_files_difference_server($files,$mediatype = 'images'){
    $retarray = array('success'=>true);
      $uploads_dir=wp_upload_dir();
      $upload_path = $uploads_dir['basedir'];
      if ($mediatype != 'images')
        $upload_path=str_replace("images", $mediatype, $uploads_dir['basedir']);
        foreach ($files as $key=>$value){
            $url = $value;
            $savepath = $upload_path.'/'.$key;
            $localpath =  fopen($savepath, "w");
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_FAILONERROR, true);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_AUTOREFERER, true);
            curl_setopt($ch, CURLOPT_BINARYTRANSFER,true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); 
            curl_setopt($ch, CURLOPT_FILE, $localpath);
            curl_setopt($ch, CURLOPT_TIMEOUT, 200);
            $executefiledownload = curl_exec($ch);
            if(!$executefiledownload) {
                $retarray['error'] = $executefiledownload;
                $retarray['errorstr'] = curl_error($ch);
             return $retarray;
            }  
            curl_close($ch);

        }
        
    return $retarray;
}