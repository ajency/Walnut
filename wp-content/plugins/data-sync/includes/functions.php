<?php
function school_data_sync_screen_new(){
    global $wpdb;

    $last_sync = $wpdb->get_var( "SELECT last_sync FROM ".$wpdb->prefix."sync_data WHERE status='success' ORDER BY id DESC LIMIT 1" );

    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }

    $school_url = preg_replace('#^https?://#', '', rtrim(get_site_url(),'/'));

    ?>
    <script>
    SERVER_AJAXURL = '<?php echo NETWORK_SERVER_URL; ?>/wp-admin/admin-ajax.php';
    BLOG_ID = '<?php echo get_option("blog_id"); ?>';
    SCHOOL_URL = '<?php echo $school_url; ?>';
    </script>
    <?php



    $html = '<h3>School Data Update</h3>';

    $html .= '<div class="wrap">';

    //$html .= '<div>There are 15 new content since you last updated.</div>';

    if($last_sync){
     $html .= '<div>Last successfull update on: '.date('H:i a F j, Y', strtotime($last_sync)).'.</div>';
    }


    $html .= '<button type="button" class="button" id="usync-data" style="margin:10px 10px;">UpSync</button>';
    $html .= '<button type="button" class="button" id="vsync-data" style="margin:10px 10px;">DownSync</button>';
    

    $html .= '<div style="clear:both"></div>';
    $html .= '<div id="upsyncstatus" style="float:left;width:50%"></div>';
    $html .= '<div id="downsyncstatus" style="float:left;width:50%"></div>';
    $html .= '<div style="clear:both"></div>';

    $html .= '</div>';

    echo $html;

}



function sds_admin_scripts_new($hook) {

    /*if( 'settings_page_school_data_sync' != $hook )
        return;*/
    wp_enqueue_style( 'sds_custom_style', plugins_url( '../css/custom.css', __FILE__ ));
    wp_enqueue_script( 'sds_custom_new', plugins_url( '../js/custom.js', __FILE__ ), array(), false, true );
}
add_action( 'admin_enqueue_scripts', 'sds_admin_scripts_new',100 );





function get_domain($url)
{
  $pieces = parse_url($url);
  $domain = isset($pieces['host']) ? $pieces['host'] : '';
  if (preg_match('/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $regs)) {
    return $regs['domain'];
  }
  return false;
}





function copyRemoteFile($url, $localPathname){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    $data = curl_exec($ch);
    curl_close($ch);

    if ($data) {
        $fp = fopen($localPathname, 'wb');

        if ($fp) {
            fwrite($fp, $data);
            fclose($fp);
        } else {
            fclose($fp);
            return false;
        }
    } else {
        return false;
    }

    return true;
}









//Initiating Upsync
add_action( 'wp_ajax_upsync_initiate', 'upsync_initiate_process' );
add_action( 'wp_ajax_upsync_initiate', 'upsync_initiate_process' );

function upsync_initiate_process(){
global $wpdb;

$wpdb->insert(
    $wpdb->prefix.'sync_data',
    array(
        'type' => 'upsync',
        'status' => 'pending'
    ));

$response = json_encode(array('status'=>'success'));
header("content-type: text/javascript; charset=utf-8");
header("access-control-allow-origin: *");
echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
exit;
}


add_action( 'wp_ajax_upsync_generate', 'generate_upsync_data' );
add_action( 'wp_ajax_nopriv_upsync_generate', 'generate_upsync_data' );

function generate_upsync_data(){
global $wpdb;
$table = $_REQUEST['table'];
$table_name = $wpdb->prefix.$table;

/*$blog_id = get_option('blog_id');
$params = "action=upsync_records_count&query_table=".$table.'&blog_id='.$blog_id;

$ch = curl_init(NETWORK_SERVER_URL.'/wp-admin/admin-ajax.php');                                                                      
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);                                                                  
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$remote = json_decode(curl_exec($ch));
curl_close($ch);

$records = $wpdb->get_results("SELECT * FROM ".$table_name."");
$local_count = count($records);
$remote_count = $remote->{'row_count'};*/

if($table == 'question_response'){
        $id = uniqid();
        $target = get_home_path().'tmp/'.$id;
        $oldumask = umask(0);
        mkdir($target, 0777);
        umask($oldumask);
    }else{
        $target = $_REQUEST['path'];
    }

$filename = $target.'/'.$table.'.csv';

/*if($local_count > $remote_count){

$limit = $local_count-$remote_count;
$data = $wpdb->get_results("SELECT * FROM ".$table_name." LIMIT ".$limit." OFFSET ".$remote_count."", ARRAY_A);*/

$data = $wpdb->get_results("SELECT * FROM ".$table_name." WHERE sync=0", ARRAY_A);

if(count($data)>0){

$f = fopen($filename, 'w');

foreach($data as $row){
    fputcsv($f, $row,',','"');
}
fclose($f);

//Compressing file to gzip
  gzCompressFile($filename);

//Removing csv file
  unlink($filename);

$response = json_encode(array('status'=>'success','path'=>$target,'local_count'=>$local_count,'remote_count'=>$remote_count));
}else{
$response = json_encode(array('status'=>'skipped','path'=>$target,'local_count'=>$local_count,'remote_count'=>$remote_count)); 
}

header("content-type: text/javascript; charset=utf-8");
header("access-control-allow-origin: *");
echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
exit;
}




add_action( 'wp_ajax_upsync_upload', 'upload_upsync_data' );
add_action( 'wp_ajax_nopriv_upsync_upload', 'upload_upsync_data' );

function upload_upsync_data(){

$file = $_REQUEST['path'].'/'.$_REQUEST['table'].'.csv.gz';

if(file_exists($file)){

$post = array('action' => 'save_upsync_upload','file'=>'@'.$file,'folder_id'=>basename($_REQUEST['path']));
$ch = curl_init();
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_VERBOSE, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-type: multipart/form-data"));
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (X11; Linux i686; rv:6.0) Gecko/20100101 Firefox/6.0Mozilla/4.0 (compatible;)");
curl_setopt($ch, CURLOPT_URL,NETWORK_SERVER_URL.'/wp-admin/admin-ajax.php');
curl_setopt($ch, CURLOPT_POST,true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
$upload_status=curl_exec ($ch);
curl_close ($ch);
$resp_decode = json_decode($upload_status,true);

    $response = json_encode(array('status'=>'success','path'=>$_REQUEST['path'],'upload_status'=>$resp_decode,'folder_id'=>basename($_REQUEST['path'])));
}else{
    $response = json_encode(array('status'=>'skipped','path'=>$_REQUEST['path'],'folder_id'=>basename($_REQUEST['path'])));
}

if(isset($_REQUEST['last_table'])){
    deleteDir($_REQUEST['path']);
}

header("content-type: text/javascript; charset=utf-8");
header("access-control-allow-origin: *");
echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
exit;
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





















//Initiating Down sync
add_action( 'wp_ajax_sync_initiate', 'sync_initiate_process' );
add_action( 'wp_ajax_sync_initiate', 'sync_initiate_process' );

function sync_initiate_process(){
global $wpdb;

$wpdb->insert(
    $wpdb->prefix.'sync_data',
    array(
        'type' => 'downsync',
        'status' => 'pending'
    ));

$response = json_encode(array('status'=>'success'));
    header("content-type: text/javascript; charset=utf-8");
    header("access-control-allow-origin: *");
    echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';

    // IMPORTANT: don't forget to "exit"
    exit;
}











//Downloading individual database
add_action( 'wp_ajax_download_tables', 'download_each_tables' );
add_action( 'wp_ajax_nopriv_download_tables', 'download_each_tables' );

function download_each_tables(){
    $r_url = $_REQUEST['url'];
    $table = $_REQUEST['table'];
    $url = $r_url.'/'.$table.'.csv.gz';

    set_time_limit(0);


    if($table == 'terms'){
        $id = uniqid();
        $local = get_home_path().'tmp/'.$id;
        $oldumask = umask(0);
        mkdir($local, 0777);
        umask($oldumask);
    }else{
        $local = $_REQUEST['local_path'];
    }

    $dir = $local.'/';
    $zipFile = $dir . basename($url);
    $zipResource = fopen($zipFile, "w");
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FAILONERROR, true);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_AUTOREFERER, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER,true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch, CURLOPT_FILE, $zipResource);
    curl_exec($ch);
    curl_close($ch);
    chmod($dir . basename($url), 0777);
    $response = json_encode(array('status'=>'success','url'=>$r_url,'localpath'=>$local));
    header("content-type: text/javascript; charset=utf-8");
    header("access-control-allow-origin: *");
    echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
    exit;
}








//Extracting backup
add_action( 'wp_ajax_sync_extract_data', 'extract_downloaded_data' );
add_action( 'wp_ajax_nopriv_sync_extract_data', 'extract_downloaded_data' );

function extract_downloaded_data(){
    global $wpdb;
    $target = $_REQUEST['local_path'];
    $files = array_diff(scandir($target), array('..', '.'));
    foreach($files as $key=>$file){
        chmod($target.'/'.$file, 01777);
        uncompress_gzip($target.'/'.$file);
        unlink($target.'/'.$file);
    }
    $response = json_encode(array('status'=>'success','localpath'=>$target));
    header("content-type: text/javascript; charset=utf-8");
    header("access-control-allow-origin: *");
    echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
    exit;
}


$tobeimported = array(
'posts.csv',
'postmeta.csv'
    );




//Importing backup
add_action( 'wp_ajax_sync_import_backup', 'generate_sync_backup_import' );
add_action( 'wp_ajax_nopriv_sync_import_backup', 'generate_sync_backup_import' );

function generate_sync_backup_import(){
global $wpdb;

$target = $_REQUEST['local_path'];

$tables = array();
$files = array_diff(scandir($target), array('..', '.'));


$myfile = fopen(get_home_path()."log.txt", "a") or die("Unable to open file!");
foreach($files as $key=>$file){
chmod($target.'/'.$file, 01777);



$table = $wpdb->prefix . pathinfo($file)['filename'];



if($file !== 'options.csv'){

$txt = $table." - truncate start..";
fwrite($myfile, "\n". $txt);
$wpdb->query("TRUNCATE TABLE ".$table."");
$txt = $table." - truncate finished..";
fwrite($myfile, "\n". $txt);


$txt = $table." - started data load.";
fwrite($myfile, "\n". $txt);
$tables[] = load_csv_to_table($target.'/'.$file,$table);
$txt = $table." - finished data load..";
fwrite($myfile, "\n". $txt);
}



}

fclose($myfile);

//set homepage
$homepage = get_page_by_title( 'Dashboard' );
if ( $homepage )
{
    update_option( 'page_on_front', $homepage->ID );
    update_option( 'show_on_front', 'page' );
}

//Update User Roles
$optioncsv = array_map('str_getcsv', file($target.'/options.csv'));
$rolekey = array_search('wp_'.get_option("blog_id").'_user_roles', array_column($optioncsv,1));
$user_roles = unserialize($optioncsv[$rolekey][2]);
//update_option( 'wp_user_roles', $user_roles );

// Default Roles
$default_roles = 'a:5:{s:13:"administrator";a:2:{s:4:"name";s:13:"Administrator";s:12:"capabilities";a:68:{s:13:"switch_themes";b:1;s:11:"edit_themes";b:1;s:16:"activate_plugins";b:1;s:12:"edit_plugins";b:1;s:10:"edit_users";b:1;s:10:"edit_files";b:1;s:14:"manage_options";b:1;s:17:"moderate_comments";b:1;s:17:"manage_categories";b:1;s:12:"manage_links";b:1;s:12:"upload_files";b:1;s:6:"import";b:1;s:15:"unfiltered_html";b:1;s:10:"edit_posts";b:1;s:17:"edit_others_posts";b:1;s:20:"edit_published_posts";b:1;s:13:"publish_posts";b:1;s:10:"edit_pages";b:1;s:4:"read";b:1;s:8:"level_10";b:1;s:7:"level_9";b:1;s:7:"level_8";b:1;s:7:"level_7";b:1;s:7:"level_6";b:1;s:7:"level_5";b:1;s:7:"level_4";b:1;s:7:"level_3";b:1;s:7:"level_2";b:1;s:7:"level_1";b:1;s:7:"level_0";b:1;s:17:"edit_others_pages";b:1;s:20:"edit_published_pages";b:1;s:13:"publish_pages";b:1;s:12:"delete_pages";b:1;s:19:"delete_others_pages";b:1;s:22:"delete_published_pages";b:1;s:12:"delete_posts";b:1;s:19:"delete_others_posts";b:1;s:22:"delete_published_posts";b:1;s:20:"delete_private_posts";b:1;s:18:"edit_private_posts";b:1;s:18:"read_private_posts";b:1;s:20:"delete_private_pages";b:1;s:18:"edit_private_pages";b:1;s:18:"read_private_pages";b:1;s:12:"delete_users";b:1;s:12:"create_users";b:1;s:17:"unfiltered_upload";b:1;s:14:"edit_dashboard";b:1;s:14:"update_plugins";b:1;s:14:"delete_plugins";b:1;s:15:"install_plugins";b:1;s:13:"update_themes";b:1;s:14:"install_themes";b:1;s:11:"update_core";b:1;s:10:"list_users";b:1;s:12:"remove_users";b:1;s:9:"add_users";b:1;s:13:"promote_users";b:1;s:18:"edit_theme_options";b:1;s:13:"delete_themes";b:1;s:6:"export";b:1;s:10:"reset_quiz";b:1;s:13:"schedule_quiz";b:1;s:17:"sync_site_content";b:1;s:16:"view_all_quizzes";b:1;s:18:"view_all_textbooks";b:1;s:19:"manage_capabilities";b:1;}}s:12:"school-admin";a:2:{s:4:"name";s:12:"School Admin";s:12:"capabilities";a:67:{s:13:"switch_themes";b:1;s:11:"edit_themes";b:1;s:16:"activate_plugins";b:1;s:12:"edit_plugins";b:1;s:10:"edit_users";b:1;s:10:"edit_files";b:1;s:14:"manage_options";b:1;s:17:"moderate_comments";b:1;s:17:"manage_categories";b:1;s:12:"manage_links";b:1;s:12:"upload_files";b:1;s:6:"import";b:1;s:15:"unfiltered_html";b:1;s:10:"edit_posts";b:1;s:17:"edit_others_posts";b:1;s:20:"edit_published_posts";b:1;s:13:"publish_posts";b:1;s:10:"edit_pages";b:1;s:4:"read";b:1;s:8:"level_10";b:1;s:7:"level_9";b:1;s:7:"level_8";b:1;s:7:"level_7";b:1;s:7:"level_6";b:1;s:7:"level_5";b:1;s:7:"level_4";b:1;s:7:"level_3";b:1;s:7:"level_2";b:1;s:7:"level_1";b:1;s:7:"level_0";b:1;s:17:"edit_others_pages";b:1;s:20:"edit_published_pages";b:1;s:13:"publish_pages";b:1;s:12:"delete_pages";b:1;s:19:"delete_others_pages";b:1;s:22:"delete_published_pages";b:1;s:12:"delete_posts";b:1;s:19:"delete_others_posts";b:1;s:22:"delete_published_posts";b:1;s:20:"delete_private_posts";b:1;s:18:"edit_private_posts";b:1;s:18:"read_private_posts";b:1;s:20:"delete_private_pages";b:1;s:18:"edit_private_pages";b:1;s:18:"read_private_pages";b:1;s:12:"delete_users";b:1;s:12:"create_users";b:1;s:17:"unfiltered_upload";b:1;s:14:"edit_dashboard";b:1;s:14:"update_plugins";b:1;s:14:"delete_plugins";b:1;s:15:"install_plugins";b:1;s:13:"update_themes";b:1;s:14:"install_themes";b:1;s:11:"update_core";b:1;s:10:"list_users";b:1;s:12:"remove_users";b:1;s:9:"add_users";b:1;s:13:"promote_users";b:1;s:18:"edit_theme_options";b:1;s:13:"delete_themes";b:1;s:6:"export";b:1;s:13:"schedule_quiz";b:1;s:17:"sync_site_content";b:1;s:16:"view_all_quizzes";b:1;s:18:"view_all_textbooks";b:1;s:10:"reset_quiz";b:1;}}s:7:"teacher";a:2:{s:4:"name";s:7:"Teacher";s:12:"capabilities";a:3:{s:10:"reset_quiz";b:1;s:16:"view_all_quizzes";b:1;s:7:"level_0";b:1;}}s:7:"student";a:2:{s:4:"name";s:7:"Student";s:12:"capabilities";a:0:{}}s:6:"parent";a:2:{s:4:"name";s:6:"Parent";s:12:"capabilities";a:0:{}}}';
update_option( 'wp_user_roles', unserialize($default_roles) );

$front_page_id = get_option( 'page_on_front' );
update_post_meta($front_page_id,'_wp_page_template','dashboard.php');
update_custom_template_pages();


deleteDir($target);


$last_sync_id = $wpdb->get_var( "SELECT id FROM ".$wpdb->prefix."sync_data ORDER BY id DESC LIMIT 1" );
$wpdb->update(
    $wpdb->prefix.'sync_data',
    array(
        'status' => 'success'
    ),
    array( 'id' => $last_sync_id ));

$response = json_encode(array('status'=>'success','last_id'=>$last_sync_id));
    header("content-type: text/javascript; charset=utf-8");
    header("access-control-allow-origin: *");
    echo htmlspecialchars($_GET['callback']) . '(' . $response . ')';
    exit;
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






function load_csv_to_table($file,$table){
global $wpdb;
$sql = "LOAD DATA INFILE '".$file."' INTO TABLE ".$table." CHARACTER SET UTF8
        FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n'";
return $wpdb->query($sql);
}


function deleteDir($path) {
    if (empty($path)) {
        return false;
    }
    return is_file($path) ?
            @unlink($path) :
            array_map(__FUNCTION__, glob($path.'/*')) == @rmdir($path);
}




function update_options_csv($file) {

$delimiter = ',';
$enclosure = '"';

if (($handle = fopen($file, "r")) !== FALSE) {
    $i = 0;
    while (($lineArray = fgetcsv($handle, 4000, $delimiter, $enclosure)) !== FALSE) {

        update_option( $lineArray[1], $lineArray[2], $lineArray[3] );

        $i++;
    }
    fclose($handle);
}

}






//Custom page tempalate
function update_custom_template_pages(){
$data = array(
    array(
        'post_data'  => array(
            "post_title" => 'Student Quize List',
            "post_name"  => 'quiz-listview-student'
            ),
        'meta'  => array('_wp_page_template' => 'quiz-listview-student.php')
    ),
    array(
        'post_data'  => array(
            "post_title" => 'Student Lectures List',
            "post_name"  => 'lecture-listview-student'
            ),
        'meta'  => array('_wp_page_template' => 'lecture-listview-student.php')
    ),
    array(
        'post_data'  => array(
            "post_title" => 'Student Dashboard',
            "post_name"  => 'dashboard-student'
            ),
        'meta'  => array('_wp_page_template' => 'dashboard-student.php')
    ),
    array(
        'post_data'  => array(
            "post_title" => 'Change Password',
            "post_name"  => 'change-password-student'
            ),
        'meta'  => array('_wp_page_template' => 'change_password_student.php')
    )

    );

foreach($data as $key=>$value){
    $value['post_data']['post_type'] = 'page';
    $value['post_data']['post_status'] = 'publish';
    $post_id = wp_insert_post($value['post_data']);
    foreach($value['meta'] as $metakey=>$metavalue){
        update_post_meta($post_id,$metakey,$metavalue);
    }
}

}


