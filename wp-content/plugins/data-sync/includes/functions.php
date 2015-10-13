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
    

    $html .= '<button type="button" id="vsync-data" style="margin-top:10px;">Update</button>';

    $html .= '<div id="syncstatus"></div>';

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
}

$tables[] = load_csv_to_table($target.'/'.$file,$table);


}

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
$sql = "LOAD DATA INFILE '".$file."' INTO TABLE ".$table."
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