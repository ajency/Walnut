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

        $blog_id = get_option('blog_id');

        if($blog_id){
            $sync_form_html = get_sync_form_html($blog_id); 
            echo $sync_form_html;
        }

        else {
            $validation_form_html= get_sync_user_validation_form();
            echo $validation_form_html;
        }

}

function get_sync_form_html($blog_id){

    global $wpdb;
    $last_sync_status = get_last_sync_status();
    $last_sync_imported = get_last_sync_imported();
    $sync_defaults = array('label' =>'Start','lastsync'=>'','syncstatus' =>'','filepath' =>'','sync_id' => '','server_sync_id'=>'');
    if(!empty($last_sync_status)){
        $sync_defaults['sync_id'] = $last_sync_status->id;
        $sync_defaults['syncstatus'] = $last_sync_status->status;
        $sync_defaults['lastsync'] = $last_sync_status->last_sync;
        if($last_sync_status->status != 'imported'){
             $sync_defaults['label'] = 'Continue';
             $sync_defaults['syncstatus'] = $last_sync_status->status;
             $sync_defaults['filepath'] = $last_sync_status->file_path;
             $sync_defaults['server_sync_id'] = $last_sync_status->server_sync_id;
        }
    }


    $sync_form_html= '<form>
         <fieldset>
         <h3>School Data Sync</h3>';
    if($last_sync_imported->last_sync)
        $sync_form_html .= '<p>[Last Data Sync]:'.date_format(date_create($last_sync_imported->last_sync), 'd/m/Y H:i:s').'</p>';

    $sync_form_html .= '<label>Data Sync </label> ->
                    <input type="button" name="sync-data" value="'.$sync_defaults['label'].'" '
        . 'id="sync-data" data-lastsync="'.$sync_defaults['lastsync'].'" '
        . 'data-syncstatus="'.$sync_defaults['syncstatus'].'" '
        . 'data-lastsync-id="'.$sync_defaults['sync_id'].'" '
        . 'data-blog-id='.$blog_id.' '
        . 'data-file-path="'.$sync_defaults['filepath'].'" data-server-sync-id="'.$sync_defaults['server_sync_id'].'"  />
                        <span class="status-msg"></span>
                     <br/><br/>
                     <label>Media Sync</label> -> <input type="button" name="sync-media" value="Start" id="sync-media"/>
                             <span class="status-msg"></span>
                     </fieldset>
                    </form>';

    return $sync_form_html;

}

function get_sync_user_validation_form(){

    $html ='<h3>Validate Blog User</h3>';

    $html .= '<form id="validate_school_user"  autocomplete="off">
                <div class="error_msg" style="color:red; padding:10px 0"></div>
                Username: <input id="validate_uname" value=" " type="text"><br>
                Password: <input id="validate_pwd" value=""  type="password"><br>
                <input type="button" id="validate-blog-user" value="Validate User">
            </form>';

    return $html;

}

function sds_admin_scripts($hook) {

    if( 'settings_page_school_data_sync' != $hook )
        return;
    wp_enqueue_script( 'sds_custom', plugins_url( '../js/custom.js', __FILE__ ), array(), false, true );
}
add_action( 'admin_enqueue_scripts', 'sds_admin_scripts',100 );

function get_last_sync_status() {
    global $wpdb;
    $import_last_status = $wpdb->get_row( "SELECT * FROM {$wpdb->prefix}sync_local_data order by id DESC LIMIT 0,1" );
    
    return $import_last_status;
    
}

function get_last_sync_imported() {
    global $wpdb;
    $import_last_status = $wpdb->get_row( "SELECT * FROM {$wpdb->prefix}sync_local_data where status LIKE 'imported' order by id DESC LIMIT 0,1" );
    
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

        "{$wpdb->prefix}question_response",
        "{$wpdb->prefix}question_response_meta"

    );
    return $tables_list;
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
    }

    else{
        if($mediatype === 'audios')
            $folderName='media-web/audio-web';

        if($mediatype === 'videos')
            $folderName='media-web/videos-web';

        $files = sds_read_folder_directory( str_replace("images", $folderName, $wp_upload_dir['path']), 
             str_replace("images", $folderName, $wp_upload_dir['baseurl']));
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

        //REVERT BACK TO THESE TWO LINES AFTER DECRYPTION FEATURE DONE
        // if ($mediatype != 'images')
        //     $upload_path=str_replace("images", $mediatype, $uploads_dir['basedir']);

        if ($mediatype != 'images'){
            if($mediatype === 'audios')
                $upload_path=str_replace("images", 'media-web/audio-web', $uploads_dir['basedir']);

            if($mediatype === 'videos')
                $upload_path=str_replace("images", 'media-web/videos-web', $uploads_dir['basedir']);
        }

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