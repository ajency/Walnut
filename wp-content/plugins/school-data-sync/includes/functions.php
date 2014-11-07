<?php
function school_data_sync_screen(){
    
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
	?>
	<script>
	SERVER_AJAXURL = '<?php echo REMOTE_SERVER_URL?>/wp-admin/admin-ajax.php';
	</script>

	<?php


        $sync_user_cookie_name = get_option('sync_user_cookie_name');
        $sync_user_cookie_value = get_option('sync_user_cookie_value');
        $blog_id = get_option('blog_id');
        if($sync_user_cookie_name){
            $sync_form_html = get_sync_form_html($blog_id,$sync_user_cookie_name,$sync_user_cookie_value); 
            echo $sync_form_html;
        }

        else {
            $validation_form_html= get_sync_user_validation_form();
            echo $validation_form_html;
        }

}

function get_sync_form_html($blog_id,$cookiename,$cookievalue){

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
    $sync_form_html .= '<p id="reset-passwrd-block">Reset Sync Password: <input type="password" name="reset-sync-password" id="reset-sync-password"> 
                        <input type="button" name="reset-passwrd-button" value="Reset" id="reset-passwrd-button"/>
                                 <span class="status-msg"></span></p>';
    if($last_sync_imported->last_sync)
        $sync_form_html .= '<p>Last Data Sync:'.date_format(date_create($last_sync_imported->last_sync), 'd/m/Y H:i:s').'</p>';
        
        $upsyncount = get_upsync_data_count();
        
        $sync_form_html .= '<p>Records To Be Upsyncd:'.$upsyncount.'</p>';
        
        $sync_form_html .= '<input type="hidden" name="login_cookie_name" id ="login_cookie_name" value='.$cookiename.' />
                            <input type="hidden" name="login_cookie_value" id ="login_cookie_value" value='.$cookievalue.' />
                        <label>Data Sync </label> ->
                        <input type="button" name="sync-data" value="'.$sync_defaults['label'].'" '
            . 'id="sync-data" data-lastsync="'.$sync_defaults['lastsync'].'" '
            . 'data-syncstatus="'.$sync_defaults['syncstatus'].'" '
            . 'data-lastsync-id="'.$sync_defaults['sync_id'].'" '
            . 'data-blog-id="'.$blog_id.'" '
            . 'data-file-path="'.$sync_defaults['filepath'].'" data-server-sync-id="'.$sync_defaults['server_sync_id'].'"  />
                            <span class="status-msg"></span>
                         <br/><br/>
                         <label>Media Sync</label> -> <input type="button" name="sync-media" value="Start" id="sync-media"/>
                                 <span class="status-msg"></span>
                         </fieldset>
                        </form>';
        if(!school_is_syncd()){
            $sync_form_html .='<iframe style="position:absolute;top:-5000px" src="'.site_url().'/wp-admin/options-permalink.php"></iframe>'; 
        }

    return $sync_form_html;

}

function get_sync_user_validation_form(){
    $blog_id = get_option('blog_id');
    
    $html ='<h3>Validate Sync User</h3>';

    $html .= '<form id="validate_sync_school_user"  autocomplete="off">
                <div class="error_msg" style="color:red; padding:10px 0"></div>
                <input id="validate_blog_id" value="'.$blog_id.'" type="hidden">
                Sync Password: <input id="validate_pwd" value=""  type="password"><br>
                <input type="button" id="validate-blog-sync-user" value="Validate">
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

    $question_response_table = "{$wpdb->prefix}question_response";
    $response_meta_table = "{$wpdb->prefix}question_response_meta";
    
    $quiz_question_response_table = "{$wpdb->prefix}quiz_question_response";
    $quiz_response_summary_table = "{$wpdb->prefix}quiz_response_summary";
    
    $quiz_schedules_table = "{$wpdb->prefix}quiz_schedules";

    $tables_list[]= array(
        'query'=> "SELECT ref_id,teacher_id,content_piece_id,collection_id,division,question_response,time_taken,start_date,end_date,status FROM $question_response_table WHERE sync = 0",
        'table_name'=> $question_response_table
        );

    $tables_list[]= array(
        'query'=> "SELECT qrm.* FROM $question_response_table qr, $response_meta_table qrm WHERE qr.sync = 0 AND qr.ref_id = qrm.qr_ref_id",
        'table_name'=> $response_meta_table);
    
    $tables_list[]= array(
        'query'=> "SELECT qr_id,summary_id,content_piece_id,question_response,time_taken,marks_scored,status FROM $quiz_question_response_table WHERE sync = 0",
        'table_name'=> $quiz_question_response_table
        );
    
    $tables_list[]= array(
        'query'=> "SELECT summary_id,collection_id,student_id,taken_on,quiz_meta FROM $quiz_response_summary_table WHERE sync = 0",
        'table_name'=> $quiz_response_summary_table
        );

    $tables_list[]= array(
        'query'=> "SELECT quiz_id,division_id,schedule_from,schedule_to FROM $quiz_schedules_table WHERE sync = 0",
        'table_name'=> $quiz_schedules_table
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
    //echo 'The zip archive contains '.$zip->numFiles.' files with a status of '.$zip->status.'=destination'.$destination;exit;

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
            $folderName='audios';

        if($mediatype === 'videos')
            $folderName='videos';

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

        if ($mediatype != 'images'){
             $upload_path=str_replace("images", $mediatype, $uploads_dir['basedir']);
        }
   
        $max_execution_time = ini_get('max_execution_time');
        ini_set('max_execution_time', '0');    
     
        foreach ($files as $key=>$value){
            $url = $value;
            $savepath = $upload_path.'/'.$key;
            $localpath  = $savepath;
            //$localpath =  fopen($savepath, "w");
            
            
            // function call to download remote file by chunks
            copyfile_chunked($url,$localpath);
            /*$ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_FAILONERROR, true);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_AUTOREFERER, true);
            curl_setopt($ch, CURLOPT_BINARYTRANSFER,true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); 
            curl_setopt($ch, CURLOPT_FILE, $localpath);
            curl_setopt($ch, CURLOPT_TIMEOUT, 0);
            $executefiledownload = curl_exec($ch);
            if(!$executefiledownload) {
                $retarray['error'] = $executefiledownload;
                $retarray['errorstr'] = curl_error($ch);
             return $retarray;
            }  
            curl_close($ch);
             */

        }
        
        ini_set('max_execution_time', $max_execution_time);
        
    return $retarray;
}

function get_upsync_data_count(){
    global $wpdb;
    $upsynccount_question_r = $wpdb->get_col( "SELECT count(*) FROM {$wpdb->prefix}question_response where sync = 0" );
    $upsynccount_quiz_qr = $wpdb->get_col( "SELECT count(*) FROM {$wpdb->prefix}quiz_question_response where sync = 0" );
    $upsynccount_quiz_sr = $wpdb->get_col( "SELECT count(*) FROM {$wpdb->prefix}quiz_response_summary where sync = 0" );
    return $upsynccount_question_r[0]+$upsynccount_quiz_qr[0]+$upsynccount_quiz_sr[0];
}

function sds_update_data_imported(){
    global $wpdb;
    
    $wpdb->query("UPDATE `{$wpdb->prefix}posts` SET guid = replace(guid, '".REMOTE_SERVER_URL."','".site_url()."')");

}

/**
 * Copy remote file over HTTP one small chunk at a time.
 *
 * @param $infile The full URL to the remote file
 * @param $outfile The path where to save the file
 */
function copyfile_chunked($infile, $outfile) {
    $chunksize = 10 * (1024 * 1024); // 10 Megs

    /**
     * parse_url breaks a part a URL into it's parts, i.e. host, path,
     * query string, etc.
     */
    $parts = parse_url($infile);
    $i_handle = fsockopen($parts['host'], 80, $errstr, $errcode, 5);
    $o_handle = fopen($outfile, 'wb');

    if ($i_handle == false || $o_handle == false) {
        return false;
    }

    if (!empty($parts['query'])) {
        $parts['path'] .= '?' . $parts['query'];
    }

    /**
     * Send the request to the server for the file
     */
    $request = "GET {$parts['path']} HTTP/1.1\r\n";
    $request .= "Host: {$parts['host']}\r\n";
    $request .= "User-Agent: Mozilla/5.0\r\n";
    $request .= "Keep-Alive: 115\r\n";
    $request .= "Connection: keep-alive\r\n\r\n";
    fwrite($i_handle, $request);

    /**
     * Now read the headers from the remote server. We'll need
     * to get the content length.
     */
    $headers = array();
    while(!feof($i_handle)) {
        $line = fgets($i_handle);
        if ($line == "\r\n") break;
        $headers[] = $line;
    }

    /**
     * Look for the Content-Length header, and get the size
     * of the remote file.
     */
    $length = 0;
    foreach($headers as $header) {
        if (stripos($header, 'Content-Length:') === 0) {
            $length = (int)str_replace('Content-Length: ', '', $header);
            break;
        }
    }

    /**
     * Start reading in the remote file, and writing it to the
     * local file one chunk at a time.
     */
    $cnt = 0;
    while(!feof($i_handle)) {
        $buf = '';
        $buf = fread($i_handle, $chunksize);
        $bytes = fwrite($o_handle, $buf);
        if ($bytes == false) {
            return false;
        }
        $cnt += $bytes;

        /**
         * We're done reading when we've reached the content length
         */
        if ($cnt >= $length) break;
    }

    fclose($i_handle);
    fclose($o_handle);
    return $cnt;
}


function get_web_data_sync_html($blog_id){

    global $wpdb;
    $last_sync_status = get_last_sync_status();
    $last_sync_imported = get_last_sync_imported();
    $sync_user_cookie_name = get_option('sync_user_cookie_name');
    $sync_user_cookie_value = get_option('sync_user_cookie_value');
    
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

    $sync_form_html= '';

         
        $upsyncount = get_upsync_data_count();
        
        $sync_form_html .= '<div id="totalRecords" class="row">
                                                  <div class="col-sm-12  m-b-10">
                                                    <div class="">
                                                      <h5 id="totalRecordsToBeSynced" class="m-t-10 bold text-center text-error">Records to be synced: '.$upsyncount.'</h5>
                                                    </div>
                                                  </div>
                                                </div>';
        
       if($last_sync_imported->last_sync) 
        $sync_form_html .= '<div id="lastDownload" class="row">
                                <div class="col-sm-12  m-b-10">
                                  <div class="">
                                    <h5 id="lastDownloadTimeStamp" class="m-t-10 bold text-center text-error">Last downloaded: 
                                    '.date_format(date_create($last_sync_imported->last_sync), 'd/m/Y H:i:s').'
                                    </h5>
                                  </div>
                                </div>
                              </div>';       
        
        $sync_form_html .= '<div class="row">
                                <div class="col-sm-12  m-b-10 m-t-10">
                                  <div class="">
                                  <input type="hidden" name="login_cookie_name" id ="login_cookie_name" value='.$sync_user_cookie_name.' />
                                  <input type="hidden" name="login_cookie_value" id ="login_cookie_value" value='.$sync_user_cookie_value.' />
                                    <button name="sync-data" '
            . 'id="sync-data" data-lastsync="'.$sync_defaults['lastsync'].'" '
            . 'data-syncstatus="'.$sync_defaults['syncstatus'].'" '
            . 'data-lastsync-id="'.$sync_defaults['sync_id'].'" '
            . 'data-blog-id='.$blog_id.' '
            . 'data-file-path="'.$sync_defaults['filepath'].'" data-server-sync-id="'.$sync_defaults['server_sync_id'].'" 
              type="button" class="btn btn-success h-align-middle block"><span id="syncButtonText" class="bold">'.$sync_defaults['label'].'</span></button>
              <h5 id="syncSuccess" class="m-t-5 semi-bold text-center text-success status-msg"></h5>
              <h5 id="datasyncProgress" class="m-t-5 semi-bold text-center text-success status-msg"></h5>
                                  </div>
                                </div>
                              </div>';

    return $sync_form_html;

}