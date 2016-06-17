<?php
// require the autoloader
require 'vendor/autoload.php';

if (!isset($content_width))
    $content_width = 604;

require_once 'underscore.php';
require_once 'modules/school/ajax.php';
require_once 'modules/content-pieces/ajax.php';
require_once 'modules/content-modules/ajax.php';
require_once 'modules/textbooks/ajax.php';
require_once 'modules/menus/ajax.php';
require_once 'modules/user/ajax.php';
require_once 'modules/media/ajax.php';
require_once 'modules/divisions/ajax.php';
require_once 'modules/question-response/ajax.php';
require_once 'modules/sync-data/sync-data-ajax.php';
require_once 'modules/communications/functions.php';
require_once 'modules/quiz/ajax.php';
require_once 'modules/student-training/ajax.php';
require_once 'custom_configs.php';
require_once 'modules/school/school_data_import.php';


add_theme_support( 'menus' );


if(!function_exists('_log')){
  function _log( $message ) {
    if( WP_DEBUG === true ){
      if( is_array( $message ) || is_object( $message ) ){
        error_log( print_r( $message, true ) );
      } else {
        error_log( $message );
      }
    }
  }
}



function result_object_to_array( $object )
    {
        if( !is_object( $object ) && !is_array( $object ) )
        {
            return $object;
        }
        if( is_object( $object ) )
        {
            $object = get_object_vars( $object );
        }
        return array_map( 'result_object_to_array', $object );
    }




//Added for testing

//Generating table data
add_action( 'wp_ajax_sync_generate', 'generate_sync_data' );
add_action( 'wp_ajax_nopriv_sync_generate', 'generate_sync_data' );

function generate_sync_data(){

  global $wpdb;
  $table = $_REQUEST['table'];

  $network_url = preg_replace('#^https?://#', '', rtrim(get_site_url(),'/'));

  $meta_per_page = 30000;


  if(isset($_REQUEST['blog_id'])){
    $prefix = $wpdb->prefix.$_REQUEST['blog_id'].'_';
  }else{
    $prefix = $wpdb->prefix;
  }

  if($table == 'terms'){
    $id = uniqid();
    $target = get_home_path().'tmp/'.$id;
    $oldumask = umask(0);
    mkdir($target, 0777);
    umask($oldumask);
  }else{
    $target = $_REQUEST['path'];
  }

  if ($table == 'postmeta'){
    $filename = $target.'/'.$table.'_'.$_REQUEST['postmeta_page'].'.csv';
  }else{
    $filename = $target.'/'.$table.'.csv';
  }

  

 


//Get data
  
  if($table=='users'){
    $data = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}users WHERE 1=1 AND {$wpdb->prefix}users.ID IN (
     SELECT {$wpdb->prefix}usermeta.user_id FROM {$wpdb->prefix}usermeta 
     WHERE {$wpdb->prefix}usermeta.meta_key = 'primary_blog'
     AND {$wpdb->prefix}usermeta.meta_value = {$_REQUEST['blog_id']})",ARRAY_A );

  }else if($table=='options'){

    $optionprefix = $wpdb->prefix.$_REQUEST['blog_id'].'_';

    $data= $wpdb->get_results($wpdb->prepare(
      "SELECT * FROM {$optionprefix}options"
      ),ARRAY_A);

  }else if($table=='postmeta'){
    $offset =  ($_REQUEST['postmeta_page']-1) * $meta_per_page;
    $data = $wpdb->get_results("SELECT * FROM {$prefix}$table LIMIT $meta_per_page OFFSET $offset", ARRAY_A);
    // _log("postmeta results fetched");
    //$data = result_object_to_array($metaresult);
   // _log("postmeta results converted to array");

  }else{     
      $data = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$prefix}$table"), ARRAY_A );
  }





//Generate csv files
  if($table=='usermeta'){
    $users = $wpdb->get_results( "SELECT ID FROM {$wpdb->prefix}users WHERE 1=1 AND {$wpdb->prefix}users.ID IN (
     SELECT {$wpdb->prefix}usermeta.user_id FROM {$wpdb->prefix}usermeta 
     WHERE {$wpdb->prefix}usermeta.meta_key = 'primary_blog'
     AND {$wpdb->prefix}usermeta.meta_value = {$_REQUEST['blog_id']})",ARRAY_A );
    $f = fopen($filename, 'w');

    foreach($users as $user){
      $metas = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}usermeta WHERE user_id={$user['ID']}",ARRAY_A);
      foreach ($metas as $line) {
        if(strpos($line['meta_key'],$_REQUEST['blog_id'].'_') !== false){
          $line['meta_key'] = str_replace($_REQUEST['blog_id'].'_', '', $line['meta_key']);
        }
        fputcsv($f, $line,',','"');
      }
    }
    fclose($f);



  }else if($table=='posts'){
    $f = fopen($filename, 'w');
    foreach ($data as $line) {
      $newline = str_replace($network_url, $_REQUEST['school'], $line);
      fputcsv($f, $newline,',','"');
    }
    fclose($f);


  }else if($table=='postmeta'){
    _log("postmeta generate file....start...");
    $f = fopen($filename, 'w');
    foreach ($data as $line) {

      if($line['meta_key'] == 'content_element' && strpos($line['meta_value'],$network_url) !== false){
        $raw_element = maybe_unserialize($line['meta_value']);
        $newelement = str_replace($network_url, $_REQUEST['school'], $raw_element);
        $line['meta_value'] = maybe_serialize($newelement);
      }else if($line['meta_key'] == 'layout_json' && strpos($line['meta_value'],$network_url) !== false && strpos($line['meta_value'],'WP_Post') == false){
        $raw_element = maybe_unserialize($line['meta_value']);
        $newelement = str_replace_deep($network_url, $_REQUEST['school'], $raw_element);
        $line['meta_value'] = maybe_serialize($newelement);
      }else if($line['meta_key'] == '_menu_item_url' && strpos($line['meta_value'],$network_url) !== false){
        $line['meta_value'] = str_replace($network_url, $_REQUEST['school'], $line['meta_value']);
      }

      fputcsv($f, $line,',','"');

    }
    fclose($f);


  }else if($table=='options'){

    $f = fopen($filename, 'w');
    foreach ($data as $line) {

      fputcsv($f, $line,',','"');
    }
    fclose($f);



}else{
  if(count($data)>0){
    $f = fopen($filename, 'w');
    foreach ($data as $line) {
      fputcsv($f, $line,',','"');
    }
    fclose($f);
  }
}



//Compressing file to gzip
  if($table == 'postmeta'){
    gzCompressFile($target.'/'.$table.'_'.$_REQUEST['postmeta_page'].'.csv');
  }else{
    gzCompressFile($target.'/'.$table.'.csv');
  }

//Removing csv file
  if($table == 'postmeta'){
    unlink($target.'/'.$table.'_'.$_REQUEST['postmeta_page'].'.csv');
  }else{
    unlink($target.'/'.$table.'.csv');
  }

//converting path to url
    $filePath = str_replace('\\','/',$target);
    $ssl = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? true : false;
    $sp = strtolower($_SERVER['SERVER_PROTOCOL']);
    $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
    $port = $_SERVER['SERVER_PORT'];
    $stringPort = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
    $host = isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
    $fileUrl = str_replace($_SERVER['DOCUMENT_ROOT'] ,$protocol . '://' . $host . $stringPort, $filePath);

    $response_data = array('status'=>'success','path'=>$target, 'url'=>$fileUrl, 'prefix'=>$prefix);

    if($table=='posts'){
      $num_result = $wpdb->get_results('SELECT COUNT(*) AS count FROM wp_postmeta');      
      $response_data['postmeta_pages'] = ceil($num_result[0]->count / $meta_per_page);
      $response_data['meta_per_page'] = $meta_per_page;
      $response_data['meta_count'] = $num_result[0]->count;
    }

    /*if($table == 'postmeta'){
      $noffset =  ($_REQUEST['postmeta_page']-1) * $meta_per_page;
      $meta_result = $wpdb->get_results("SELECT * FROM {$prefix}$table LIMIT $meta_per_page OFFSET $noffset");
      $response_data['record_count'] = count($meta_result);
      $response_data['record_start'] = $meta_result[0]->meta_id;
      $response_data['record_offset'] = $noffset;
    }*/

    $response = json_encode($response_data);
    header("content-type: text/javascript; charset=utf-8");
    header("access-control-allow-origin: *");
    echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
    exit;
  }





function str_replace_deep($search, $replace, $subject)
{
    if (is_array($subject))
    {
        foreach($subject as &$oneSubject)
            $oneSubject = str_replace_deep($search, $replace, $oneSubject);
        unset($oneSubject);
        return $subject;
    } else {
        return str_replace($search, $replace, $subject);
    }
}





function gzCompressFile($source, $level = 9){ 
    $dest = $source . '.gz'; 
    $mode = 'wb' . $level; 
    $error = false; 
    if ($fp_out = gzopen($dest, $mode)) { 
        if ($fp_in = fopen($source,'rb')) { 
            while (!feof($fp_in)) 
                gzwrite($fp_out, fread($fp_in, 1024 * 512)); 
            fclose($fp_in); 
        } else {
            $error = true; 
        }
        gzclose($fp_out); 
    } else {
        $error = true; 
    }
    if ($error)
        return false; 
    else
        return $dest; 
} 


function deleteDir($path) {
    if (empty($path)) { 
        return false;
    }
    return is_file($path) ?
            @unlink($path) :
            array_map(__FUNCTION__, glob($path.'/*')) == @rmdir($path);
}



function uncompress_gzip($file_name){
$buffer_size = 4096;
$out_file_name = str_replace('.gz', '', $file_name);
$file = gzopen($file_name, 'rb');
$out_file = fopen($out_file_name, 'wb');
while(!gzeof($file)) {
  fwrite($out_file, gzread($file, $buffer_size));
}
fclose($out_file);
gzclose($file);
}




//converting path to url
function convert_path_to_url($path){
  $filePath = str_replace('\\','/',$path);
  $ssl = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? true : false;
  $sp = strtolower($_SERVER['SERVER_PROTOCOL']);
  $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
  $port = $_SERVER['SERVER_PORT'];
  $stringPort = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
  $host = isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
  $fileUrl = str_replace($_SERVER['DOCUMENT_ROOT'] ,$protocol . '://' . $host . $stringPort, $filePath);
  return $fileUrl;
}











//Generating row count for upsync tables
add_action( 'wp_ajax_upsync_records_count', 'get_upsync_records_count' );
add_action( 'wp_ajax_nopriv_upsync_records_count', 'get_upsync_records_count' );

function get_upsync_records_count(){
global $wpdb;

$table_name = $wpdb->prefix.$_REQUEST['blog_id'].'_'.$_REQUEST['query_table'];
$records = $wpdb->get_results("SELECT * FROM ".$table_name."");

$response = array('status'=>'success','row_count'=>count($records));
echo json_encode($response);
exit;
}




//saving upsync table to tmp folder
add_action( 'wp_ajax_upsync_save_upsync_upload', 'save_upsync_upload' );
add_action( 'wp_ajax_nopriv_save_upsync_upload', 'save_upsync_upload' );

function save_upsync_upload(){
global $wpdb;

$id = $_REQUEST['folder_id'];
$target = get_home_path().'tmp/'.$id;
if(!file_exists($target)){
$oldumask = umask(0);
mkdir($target, 0777);
umask($oldumask);
}

$file = $_FILES['file'];
if(move_uploaded_file($file['tmp_name'], $target.'/'.$file['name']))
        {
            $uploaded = true;
            $status = 'success';
        }
        else
        {
            $uploaded = false;
            $status = 'failed';
        }

$response = array('status'=>$status,'uploaded'=>$uploaded);
echo json_encode($response);
exit;
}



//Extracting upsync data
add_action( 'wp_ajax_upsync_extract_data', 'upsync_extract_data' );
add_action( 'wp_ajax_nopriv_upsync_extract_data', 'upsync_extract_data' );

function upsync_extract_data(){

  $id = $_REQUEST['folder_id'];
  $target = get_home_path().'tmp/'.$id;
  $files = array_diff(scandir($target), array('..', '.'));
  foreach($files as $key=>$file){
    chmod($target.'/'.$file, 01777);
    uncompress_gzip($target.'/'.$file);
    unlink($target.'/'.$file);
  }

$response = json_encode(array('status'=>'success','path'=>$target));
header("content-type: text/javascript; charset=utf-8");
header("access-control-allow-origin: *");
echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
exit;
}




//Extracting upsync data
add_action( 'wp_ajax_import_uploaded_data', 'import_uploaded_data' );
add_action( 'wp_ajax_nopriv_import_uploaded_data', 'import_uploaded_data' );

function import_uploaded_data(){
  global $wpdb;
  $target = $_REQUEST['path'];
  $files = array_diff(scandir($target), array('..', '.'));  
  $data = array();
  $log_file = $_REQUEST['blog_id'].'_'.date('d-m-y-H-i-s',time()).'_log.txt';
  $log_path = get_home_path().'tmp/logs/'.$log_file;
  $log_url = get_site_url().'?download_import_log='.$log_file;
  foreach($files as $key=>$file){
    $table = basename($file, ".csv");
    chmod($target.'/'.$file, 01777);
    $table_name = $wpdb->prefix.$_REQUEST['blog_id'].'_'.$table;
    $records = import_csv_data_to_table($target.'/'.$file,$table_name,$table,$_REQUEST['blog_id'],$log_path);    
    $data[$table_name] = $records;
  }

   deleteDir($target);

$response = json_encode(array('status'=>'success','data'=>$data,'log_url'=>$log_url));
header("content-type: text/javascript; charset=utf-8");
header("access-control-allow-origin: *");
echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
exit;
}



function import_csv_data_to_table($filepath,$table,$filename,$blog_id,$log_path){
  global $wpdb;
  $col = $wpdb->get_col( "DESC " . $table, 0 );
  $row = 1;
  $records = array();

  $wpdb->show_errors     = true;
  $wpdb->suppress_errors = false;

  $logs = array();

  if (($handle = fopen($filepath, "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
      $num = count($data);
      $row++;
      $rowdata = array();
      for ($c=0; $c < $num; $c++) {
        if($col[$c] !== 'sync' && $data[$c] !== ''){
            $rowdata[$col[$c]] = $data[$c];
        }        
      }

      unset($rowdata['']);

      switch ($filename) {
        case 'question_response':
          $index_query = "SELECT * FROM $table WHERE ref_id='".$rowdata['ref_id']."' AND content_piece_id = ".$rowdata['content_piece_id']."";
          break;
        case 'question_response_meta':
          $index_query = "SELECT * FROM $table WHERE qr_ref_id='".$rowdata['qr_ref_id']."'";
          break;
        case 'quiz_question_response':
          $index_query = "SELECT * FROM $table WHERE qr_id='".$rowdata['qr_id']."'";
          break;
        case 'quiz_response_summary':
          $index_query = "SELECT * FROM $table WHERE summary_id='".$rowdata['summary_id']."'";
          break;
        case 'quiz_schedules':
          $index_query = "SELECT * FROM $table WHERE quiz_id=".$rowdata['quiz_id']." AND division_id = ".$rowdata['division_id']."";
          break;
        }

      $index_data = $wpdb->get_row( $index_query );
      if($index_data){

        $log = generate_import_log($filename,'update',$rowdata,$blog_id);

       switch ($filename) {
        case 'question_response':
          $update_ref = array( 'ref_id' => $rowdata['ref_id'], 'content_piece_id' => $rowdata['content_piece_id'] );
          break;
        case 'question_response_meta':
          $update_ref = array( 'qr_ref_id' => $rowdata['qr_ref_id'] );
          break;
        case 'quiz_question_response':
          $update_ref = array( 'qr_id' => $rowdata['qr_id'] );
          break;
        case 'quiz_response_summary':
          $update_ref = array( 'summary_id' => $rowdata['summary_id'] );
          break;
        case 'quiz_schedules':
          $update_ref = array( 'quiz_id' => $rowdata['quiz_id'], 'division_id' => $rowdata['division_id'] );
          break;
        } 

        $wpdb->update( $table, $rowdata, $update_ref );
        $import_type = var_export( $wpdb->last_error, true );
      }else{
        $log = generate_import_log($filename,'insert',$rowdata,$blog_id);
        $wpdb->insert($table,$rowdata);
        $import_type = var_export( $wpdb->last_error, true );
      }

      if(count($log)>0){
        $logs[] = $log;
      }

      //$records[] = $import_type; 
      $records[] = $rowdata;       
      unset($rowdata);
    }
    fclose($handle);
  }


  if(count($logs)>0){

    switch ($filename) {
      case 'quiz_response_summary':
        $logheader = 'QUIZ RESPONSE LOG';              
        break;
      case 'quiz_schedules':
        $logheader = 'QUIZ SCHEDULE LOG'; 
        break;
      case 'question_response':
        $logheader = 'TEACHING MODULE LOG'; 
        break;
      default:
      $logheader = 'LOG';
    }
    $sublogheader = str_repeat("=", strlen ($logheader));       

    $logfile = fopen($log_path, "a") or die("Unable to open file!");
    fwrite($logfile, "\n\n\n". $logheader);
    fwrite($logfile, "\n". $sublogheader);
    fwrite($logfile, "\n". print_r(arr2textTable($logs),true));
    fclose($logfile);
  }


  //return $logs;
  return $records;
}









function generate_import_log($filename,$type,$data,$blog_id){ 
    switch ($filename) {
        case 'quiz_response_summary':
          $log = generate_quiz_response_log($data,$blog_id);
          $log['TYPE'] = $type;     
          break;
        case 'question_response':
          $log = generate_teaching_module_log($data,$blog_id);
          $log['TYPE'] = $type;     
          break;
        case 'quiz_schedules':
          $log = generate_quiz_schedule_log($data,$blog_id);
          $log['TYPE'] = $type;  
          break;
        default:
            $log = array();
    }
    return $log;
}




function generate_quiz_response_log($data,$blog_id){
    global $wpdb;
    $log = array();
    $collection_table = $wpdb->prefix.'content_collection';
    $collection_meta_table = $wpdb->prefix.'collection_meta';
    $division_table = $wpdb->prefix.$blog_id.'_'.'class_divisions';
    $collection = $wpdb->get_row( "SELECT * FROM $collection_table WHERE id=".$data['collection_id']."" );
    $quiz_type = $wpdb->get_col( $wpdb->prepare("SELECT meta_value FROM $collection_meta_table WHERE collection_id=".$data['collection_id']." AND meta_key='quiz_type'" ));
    $term_ids = maybe_unserialize($collection->term_ids);
    $textbook_id = $term_ids['textbook'];
    $textbook = get_term( $textbook_id, 'textbook' );
    $textbook_name = $textbook->name;
    $student = get_userdata( $data['student_id'] );
    $student_name = $student->user_nicename;
    $division_id = get_user_meta($data['student_id'],'student_division',true);
    $division = $wpdb->get_row( $wpdb->prepare("SELECT * FROM $division_table WHERE id = %d", $division_id) );
    //$attempts_data = get_quiz_status($data['collection_id'],$data['student_id']);
        
    $log['DIVISION'] = $division->division;
    $log['TEXTBOOK'] = $textbook_name;
    $log['QUIZ'] = $collection->name;
    $log['QUIZ TYPE'] = $quiz_type[0];
    $log['STUDENT'] = $student_name;
    $log['LAST TAKEN'] = $collection->last_modified_on;
    $log['ATTEMPTS'] = get_quiz_attempts_custom($data['collection_id'],$data['student_id'],$blog_id); 
    return $log;
}


function generate_quiz_schedule_log($data,$blog_id){
    global $wpdb;
    $log = array();
    $collection_table = $wpdb->prefix.'content_collection';
    $collection_meta_table = $wpdb->prefix.'collection_meta';
    $division_table = $wpdb->prefix.$blog_id.'_'.'class_divisions';
    $collection = $wpdb->get_row( "SELECT * FROM $collection_table WHERE id=".$data['quiz_id']."" );
    $query_meta = $wpdb->prepare("SELECT meta_value FROM $collection_meta_table WHERE collection_id = %d AND meta_key = 'quiz_type'",$data['quiz_id']);
    $quiz_type = $wpdb->get_col($query_meta);
    $term_ids = maybe_unserialize($collection->term_ids);
    $textbook_id = $term_ids['textbook'];
    $textbook = get_term( $textbook_id, 'textbook' );
    $textbook_name = $textbook->name;
    $division = $wpdb->get_row( $wpdb->prepare("SELECT * FROM $division_table WHERE id = %d", $data['division_id']) );

    $log['DIVISION'] = $division->division;
    $log['TEXTBOOK'] = $textbook_name;
    $log['QUIZ'] = $collection->name;
    $log['QUIZ TYPE'] = $quiz_type[0];
    $log['SCHEDULE FROM'] = $data['schedule_from'];
    $log['SCHEDULE TO'] = $data['schedule_to'];
    return $log;
}


function generate_teaching_module_log($data,$blog_id){
    global $wpdb;
    $log = array();
    $collection_table = $wpdb->prefix.'content_collection';
    $division_table = $wpdb->prefix.$blog_id.'_'.'class_divisions';
    $collection = $wpdb->get_row( "SELECT * FROM $collection_table WHERE id=".$data['collection_id']."" );    
    $term_ids = maybe_unserialize($collection->term_ids);
    $textbook_id = $term_ids['textbook'];
    $textbook = get_term( $textbook_id, 'textbook' );
    $textbook_name = $textbook->name;
    $teacher = get_userdata( $data['teacher_id'] );
    $teacher_name = $teacher->user_nicename;
    $division = $wpdb->get_row( "SELECT * FROM $division_table WHERE id=".$data['division']."" );

    $log['DIVISION'] = $division->division;
    $log['TEXTBOOK'] = $textbook_name;
    $log['MODULE'] = $collection->name;
    $log['TEACHER'] = $teacher_name;     
    $log['STATUS'] = $data['status'];
    return $log;
}







function arr2textTable($a, $b = array(), $c = 0) {
    $d = array();
    $e = "+";
    $f = "|";
    $g = 0;
    foreach ($a as $h)
        foreach ($h AS $i => $j) {
            $j = substr(str_replace(array("\n","\r","\t","  "), " ", $j), 0, 48);
            $k = strlen($j);
            $l = strlen($i);
            $k = $l > $k ? $l : $k;
            if (!isset($d[$i]) || $k > $d[$i])
                $d[$i] = $k;
        }
    foreach ($d as $m => $h) {
        $e .= str_pad("", $h + 2, "-") . "+";
            if (strlen($m) > $h)
                $m = substr($m, 0, $h - 1);
            $f .= " " . str_pad($m, $h, " ", isset($b[$g]) ? $b[$g] : $c) . " |";
            $g++;
    }
    $n = "{$e}\n{$f}\n{$e}\n";
    foreach ($a as $h) {
        $n .= "|";
        $g = 0;
        foreach ($h as $i => $o) {
            $n .= " " . str_pad($o, $d[$i], " ", isset($b[$g]) ? $b[$g] : $c) . " |";
            $g++;
        }
        $n .= "\n";
    }
    $p = array(
        "`((?:https?|ftp)://\S+[[:alnum:]]/?)`si",
        "`((?<!//)(www\.\S+[[:alnum:]]/?))`si"
    );
    $q = array(
        "<a href=\"$1\" rel=\"nofollow\">$1</a>",
        "<a href=\"http://$1\" rel=\"nofollow\">$1</a>"
    );
    return preg_replace($p, $q, "{$n}{$e}\n");
}



function get_quiz_attempts_custom($quiz_id,$user_id,$blog_id){
    global $wpdb;
    
    $response_summary_table = $wpdb->prefix.$blog_id.'_'.'quiz_response_summary';

    $query= $wpdb->prepare("SELECT taken_on, quiz_meta 
        FROM $response_summary_table qrs
        WHERE collection_id = %d
            AND student_id = %d",
        array($quiz_id,$user_id)
    );

    $result= $wpdb->get_results($query);

    if($result){        
        $attempts= sizeof($result);
    }

    else $attempts = 'not started';

    return $attempts;
}




add_action('init','import_log_download');
function import_log_download() {

  if (isset($_REQUEST['download_import_log'])) {

    if(!empty($_REQUEST['download_import_log'])){

    $filename = $_REQUEST['download_import_log'];    

    $base = dirname(__FILE__);
    $path = dirname(dirname(dirname($base)))."/tmp/logs/";
    
    $logpath = $path.$_REQUEST['download_import_log'];    

    header("Content-Type: text/plain");
    header("Content-Description: File Transfer");
    header("Content-Disposition: attachment; filename= logs.txt");
    header('Content-Length: '.filesize($logpath));
    header("Content-Transfer-Encoding: binary");
    header('Pragma: no-cache'); 
    header('Expires: 0');
    set_time_limit(0);     
    readfile($logpath);
    exit;
  }else{
    echo "<h2>Permission Denied</h2>";
    wp_die();
  }
  }
}











//add extra fields to custom taxonomy edit form callback function

function upload_attachment( $file_handler, $post_id, $set_thumb = 'false' ) {

    // check to make sure its a successful upload
    if ($_FILES[$file_handler]['error'] !== UPLOAD_ERR_OK)
        __return_false();

    require_once(ABSPATH . "wp-admin" . '/includes/image.php');
    require_once(ABSPATH . "wp-admin" . '/includes/file.php');
    require_once(ABSPATH . "wp-admin" . '/includes/media.php');

    $attach_id = media_handle_upload( $file_handler, $post_id );

    if ($set_thumb)
        update_post_meta( $post_id, '_thumbnail_id', $attach_id );

    return $attach_id;
}


if(!function_exists('str_putcsv'))
{
    function str_putcsv($input, $delimiter = ',', $enclosure = '"')
    {
        // Open a memory "file" for read/write...
        $fp = fopen('php://temp', 'r+');
        // ... write the $input array to the "file" using fputcsv()...
        fputcsv($fp, $input, $delimiter, $enclosure);
        // ... rewind the "file" so we can read what we just wrote...
        rewind($fp);
        // ... read the entire line into a variable...
        $data = fread($fp, 1048576);
        // ... close the "file"...
        fclose($fp);
        // ... and return the $data to the caller, with the trailing newline from fgets() removed.
        return $data;
    }
}

if (!is_multisite()) {

    // define empty functions for standalone installation to ignore multisite functions
    function switch_to_blog(){}
    function restore_current_blog(){}
    function get_blog_option(){}
    function get_active_blog_for_user(){}
    function get_blog_details(){}

    // function to replace media urls incase of standalone site
    function replace_media_urls($url){

        $url = str_replace(REMOTE_SERVER_URL, get_site_url(), $url);
        $url = str_replace('media-web/videos-web', 'videos', $url);
        $url = str_replace('media-web/audio-web', 'audios', $url);

        return $url;

    }

}



