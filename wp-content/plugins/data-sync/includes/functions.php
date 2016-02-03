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


    $html .= '<button type="button" id="vsync-data" style="margin:10px 0px;">Update</button>';

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







//Initiating sync
add_action( 'wp_ajax_sync_initiate', 'sync_initiate_process' );
add_action( 'wp_ajax_sync_initiate', 'sync_initiate_process' );

function sync_initiate_process(){
global $wpdb;

$wpdb->insert(
    $wpdb->prefix.'sync_data',
    array(
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
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
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
foreach($files as $key=>$file){
chmod($target.'/'.$file, 01777);


$table = $wpdb->prefix . pathinfo($file)['filename'];

if($file !== 'options.csv'){
$wpdb->query("TRUNCATE TABLE ".$table."");

$tables[] = load_csv_to_table($target.'/'.$file,$table);
}

}

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
        FIELDS TERMINATED BY ',' ENCLOSED BY '\"'";
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
