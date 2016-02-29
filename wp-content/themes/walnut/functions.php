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

















//Added for testing

//Generating table data
add_action( 'wp_ajax_sync_generate', 'generate_sync_data' );
add_action( 'wp_ajax_nopriv_sync_generate', 'generate_sync_data' );

function generate_sync_data(){
    global $wpdb;
    $table = $_REQUEST['table'];

    $network_url = preg_replace('#^https?://#', '', rtrim(get_site_url(),'/'));

    
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

    $filename = $target.'/'.$table.'.csv';



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
    }else{
      if($table=='users'){
        $data = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}users WHERE 1=1 AND {$wpdb->prefix}users.ID IN (
         SELECT {$wpdb->prefix}usermeta.user_id FROM {$wpdb->prefix}usermeta 
         WHERE {$wpdb->prefix}usermeta.meta_key = 'primary_blog'
         AND {$wpdb->prefix}usermeta.meta_value = {$_REQUEST['blog_id']})",ARRAY_A );

      }else if($table=='options'){
        /*$data= $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$prefix}$table
                WHERE option_name LIKE %s OR option_name LIKE %s",
            'taxonomy%', '%user_roles%'
        ),ARRAY_A);*/

      $optionprefix = $wpdb->prefix.$_REQUEST['blog_id'].'_';

      $data= $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM {$optionprefix}options"
        ),ARRAY_A);

      }else{
        $data = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$prefix}$table"), ARRAY_A );
      }



      if($table=='posts'){
        $f = fopen($filename, 'w');
        foreach ($data as $line) {
          $newline = str_replace($network_url, $_REQUEST['school'], $line);
          fputcsv($f, $newline,',','"');
        }
        fclose($f);

      }else if($table=='postmeta'){
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

          /*if(strpos($line['meta_value'],$network_url) !== false){
            $raw_element = maybe_unserialize($line['meta_value']);
            $newelement = str_replace_deep($network_url, $_REQUEST['school'], $raw_element);
            $line['meta_value'] = maybe_serialize($newelement);
          }*/

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

   }

    





//Compressing file to gzip
  gzCompressFile($target.'/'.$table.'.csv');

//Removing csv file
  unlink($target.'/'.$table.'.csv');

//converting path to url
  $filePath = str_replace('\\','/',$target);
  $ssl = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? true : false;
  $sp = strtolower($_SERVER['SERVER_PROTOCOL']);
  $protocol = substr($sp, 0, strpos($sp, '/')) . (($ssl) ? 's' : '');
  $port = $_SERVER['SERVER_PORT'];
  $stringPort = ((!$ssl && $port == '80') || ($ssl && $port == '443')) ? '' : ':' . $port;
  $host = isset($_SERVER['HTTP_X_FORWARDED_HOST']) ? $_SERVER['HTTP_X_FORWARDED_HOST'] : isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
  $fileUrl = str_replace($_SERVER['DOCUMENT_ROOT'] ,$protocol . '://' . $host . $stringPort, $filePath);

  $response = json_encode(array('status'=>'success','path'=>$target, 'url'=>$fileUrl, 'prefix'=>$prefix));
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





function check_social_login_redirect($userId, $provider, $hybridauth_user_profile){
  $school_site_name = 'universal';
  $universal_id = get_id_from_blogname( $school_site_name );
  $universal_url = get_site_url($universal_id);

  $meta = get_user_meta($userId);
  if(isset($meta['primary_blog'])){
    update_user_meta( $userId, 'primary_blog', $universal_id);
  }else{
    add_user_meta( $userId, 'primary_blog', $universal_id);
  }

  if(isset($meta['source_domain'])){
    update_user_meta( $userId, 'source_domain', $school_site_name.'.'.$_SERVER['SERVER_NAME']);
  }else{
    add_user_meta( $userId, 'source_domain', $school_site_name.'.'.$_SERVER['SERVER_NAME']);
  }

  if(isset($meta['wp_'.$universal_id.'_capabilities'])){
    update_user_meta( $userId, 'wp_'.$universal_id.'_capabilities', array('parent'=>true));
  }else{
    add_user_meta( $userId, 'wp_'.$universal_id.'_capabilities', array('parent'=>true));
  }

  if(isset($meta['wp_'.$universal_id.'_user_level'])){
    update_user_meta( $userId, 'wp_'.$universal_id.'_user_level', '0');
  }else{
    add_user_meta( $userId, 'wp_'.$universal_id.'_user_level', '0');
  }


  if(isset($meta['wp_user_level'])){
    delete_user_meta( $userId, 'wp_user_level');
  }
   if(isset($meta['wp_capabilities'])){
    delete_user_meta( $userId, 'wp_capabilities');
  }
}
add_action( 'wsl_hook_process_login_after_wp_insert_user', 'check_social_login_redirect',10,3 );






function login_site_redirect ( $redirect_to ) {
  global $user;
  $primary_blog_id = get_usermeta($user->ID, 'primary_blog');
  $blog_details = get_blog_details($primary_blog_id);
  $redirect_url = $blog_details->siteurl;
  return $redirect_url;

}

//add_filter ( 'login_redirect', 'login_site_redirect', 10, 3 ) ;





add_filter('login_redirect', function($redirect_to, $request_redirect_to, $user)
{
    if (!is_wp_error($user) && $user->ID != 0)
    {
        $user_info = get_userdata($user->ID);
        if ($user_info->primary_blog)
        {
            $primary_url = get_blogaddress_by_id($user_info->primary_blog) . 'wp-admin/';
            if ($primary_url) {
                wp_redirect($primary_url);
                die();
            }
        }
    }
    return $redirect_to;
}, 100, 3);




function login_social_redirect($login_user, $user){
  global $wpdb;

//$user_info = get_userdata($user->ID);

//$user = new WP_User( $user->ID );

$user_info = get_userdata($user->ID);

if ($user_info->primary_blog){

$capabilities = maybe_unserialize(get_user_meta($user->ID,$wpdb->base_prefix.$user_info->primary_blog.'_capabilities',true));
$school_url = get_site_url($user_info->primary_blog);

if(array_key_exists('parent',$capabilities)){

$students = $wpdb->get_results( "SELECT * FROM $wpdb->usermeta WHERE meta_key = 'parent_email1' AND meta_value = '".$user_info->user_email."'");
if(count($students)>0){
    $redirect_url = $school_url.'/dashboard-student';
}else{
  $redirect_url = $school_url.'/register-redirect-student';
}

wp_redirect($redirect_url);
die();
}


}
}
add_action('wp_login','login_social_redirect',10,2);



function check_user_capabilities(){
  global $wpdb;
  $user_id = 2450;
  $user_info = get_userdata($user_id);

if ($user_info->primary_blog){

$capabilities = maybe_unserialize(get_user_meta($user_id,$wpdb->base_prefix.$user_info->primary_blog.'_capabilities',true));
if(array_key_exists('parent',$capabilities)){
 
  $students = $wpdb->get_results( "SELECT * FROM $wpdb->usermeta WHERE meta_key = 'parent_email1' AND meta_value = '".$user_info->user_email."'");
  if(count($students)>0){
    $total_students = count($students);
  }
}

}
}
//add_action('init','check_user_capabilities');






function change_all_postmeta(){
  global $wpdb;
  $results = $wpdb->get_results( "SELECT * FROM wp_postmeta_test WHERE meta_key = 'content_element'",ARRAY_A);

  foreach($results as $key=>$value){
    $rawdata = $value['meta_value'];
    $data = unserialize(str_replace("walnutedu.org","synapselearning.net",$rawdata));
    $finaldata = json_decode(str_replace('synapselearning.net', 'walnutedu.org', json_encode($data)), true);
    $finaldata = serialize($finaldata);

    $wpdb->update( 'wp_postmeta_test', array('meta_value' => $finaldata), array( 'meta_id' => $value['meta_id'] ));

  }
}

//add_action('template_redirect','change_all_postmeta');


