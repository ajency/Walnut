<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 22/05/14
 * Time: 5:15 PM
 */

/**
 * @param array $args= array(
 *           'user_id'       => $user_id,
 *           'blog_id'       => $blog_id,
 *           'last_sync'     => $last_sync,
 *           'device_type'   => $device_type,
 *           'sync_type'     => $sync_type
 *       );
 * if last_sync is blank returns full data in the tables mentioned in get_tables_to_export function
 * else returns the data from that time forward
 * @param string $device_type uniques device type for app|'standalone' for a standalone site 
 * @param string $user_id # todo: sync by textbook id. Its not going to be by user
 * @return mixed
 */

// Exit if accessed directly
if (!defined('ABSPATH'))
    exit;


function debug_export(){
    $args= array(
            'sync_type' => 'student_app',
            'user_id'     => 5,
            'blog_id'      => 8
        );

    $exObject = new ExportTables($args);
    $ex= $exObject->export_tables_for_app();
    print_r($ex);
    exit;
}

#add_action('init', 'debug_export');

#$br='<br><br>';

class ExportTables {

    var $user_id;
    var $blog_id;
    var $last_sync;
    var $device_type;
    var $sync_type;

    function __construct($args = '') {
        global $user_ID;

        // Default arguments
        $defaults = array(
            'user_id'       => $user_ID,
            'blog_id'       => get_current_blog_id(),
            'last_sync'     => '',
            'device_type'   => 'standalone',
            'sync_type'     => 'teacher_app',
            'textbook_ids'  => array()
        );

        $r = wp_parse_args($args, $defaults);
        extract($r, EXTR_SKIP);

        if($user_id){
            $blog = get_active_blog_for_user( $user_id );
            $blog_id=$blog->blog_id;            
        }
        
        
        switch_to_blog($blog_id);

        $textbook_ids=get_assigned_textbooks($user_id);
        
        switch_to_blog($blog_id);
        
        $this->user_id      = $user_id;
        $this->blog_id      = $blog_id;
        $this->textbook_ids = $textbook_ids;
        $this->last_sync    = $last_sync;
        $this->device_type  = $device_type;
        $this->sync_type    = $sync_type;
        
    }

    function export_tables_for_app() {

        $tables_to_export= $this->get_tables_to_export();

        $exported_tables= $this->prepare_csvs_for_export($tables_to_export);

        $uploads_dir=wp_upload_dir();

        $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
        $upload_url = str_replace('/images', '', $uploads_dir['baseurl']);

        $random= rand(9999,99999);

        if(!file_exists($upload_directory.'/tmp/'))
            mkdir($upload_directory.'/tmp',0755);

        if(!file_exists($upload_directory.'/tmp/downsync'))
            mkdir($upload_directory.'/tmp/downsync',0755);

        if(!file_exists($upload_directory.'/tmp/upsync'))
            mkdir($upload_directory.'/tmp/upsync',0755);

        $upload_path= '/tmp/downsync/csvs-'.$random.date('Ymdhis').'.zip';

        $result = create_zip($exported_tables, $upload_directory.$upload_path);

        restore_current_blog();

        $export_details = array();

        $export_details['blog_expired'] = $this->is_blog_expired();
        
        if($result === false){
            $export_details['error'] = true;
            $export_details['message'] = 'Failed to create export file';
        }

        else{
            $uploaded_url= $upload_url.$upload_path;
            $export_details['exported_csv_url'] = $uploaded_url;
            $export_details['last_sync']=date('Y-m-d h:i:s',strtotime('+5 hours 30 minutes',current_time( 'timestamp', 0 )));  // adding +5.30 hours as current_time function returns same result 
            $this->create_sync_device_log($export_details['last_sync']);
        }

        return $export_details;

    }

    private function get_tables_to_export(){

        global $wpdb;

        $tables_list= array(

            // THIS FOLLOWING LIST IS OF TABLES WHOSE FULL DATA WILL BE EXPORTED EVERY TIME

            //PARENT SITE TABLE QUERIES
            //"{$wpdb->base_prefix}options",
            "{$wpdb->base_prefix}terms",
            "{$wpdb->base_prefix}term_relationships",
            "{$wpdb->base_prefix}term_taxonomy",
            "{$wpdb->base_prefix}textbook_relationships",

            //CHILD SITE TABLE QUERIES
            "{$wpdb->prefix}class_divisions"

        );

        #if a standalone site is requesting data
        if($this->device_type == 'standalone'){
            $tables_list[]="{$wpdb->prefix}question_response";
            $tables_list[]="{$wpdb->prefix}question_response_meta";
            $tables_list[]="{$wpdb->prefix}quiz_question_response";
            $tables_list[]="{$wpdb->prefix}quiz_response_summary";
        }
        #if a student/teacher app device is requesting data
        else {
            if($this->sync_type=='student_app'){
                $tables_list[]="{$wpdb->prefix}quiz_question_response";
                $tables_list[]="{$wpdb->prefix}quiz_response_summary";
            }
            else{
                $tables_list[]="{$wpdb->prefix}question_response";
                $tables_list[]="{$wpdb->prefix}question_response_meta";
            }
        }

        // ONLY THE RECORDS REGARDING TEXTBOOKS ADDITIONAL DATA
        // LIKE AUTHOR AND IMAGE FROM WP_OPTIONS TABLE ARE FETCHED
        $tables_list[]= $this->get_options_table_query();

        // USER AND USERMETA TABLES ARE CUSTOM QUERIED AND ONLY BLOG RELATED RECORDS ARE FETCHED
        $tables_list[]= $this->get_user_table_query();
        $tables_list[]= $this->get_usermeta_table_query();

        // POST, POST META, COLLECCTION and COLLECTION META TABLES ARE FETCHED BASED ON LAST SYNCED

        $tables_list[]= $this->get_posts_table_query();
        $tables_list[]= $this->get_postmeta_table_query();
        $tables_list[]= $this->get_collection_table_query();
        $tables_list[]= $this->get_collectionmeta_table_query();

        return $tables_list;
    }

    private function get_options_table_query(){

        global $wpdb;

        $options_table_name= $wpdb->base_prefix.'options';

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

    private function get_user_table_query(){

        global $wpdb;

        $blog_users= $this->get_all_user_ids();

        $user_ids= join(',',$blog_users);

        $user_table_query= $wpdb->prepare(
            "SELECT u.* FROM
                {$wpdb->base_prefix}users u,
                {$wpdb->base_prefix}usermeta um
                    WHERE u.ID= um.user_id
                        AND um.meta_key=%s
                        AND um.meta_value=%d
                        AND u.ID in (".$user_ids.")",
            array('primary_blog', $this->blog_id)
        );
        $user_table= array(
            'query'=> $user_table_query,
            'table_name'=> "{$wpdb->base_prefix}users"
        );

        return $user_table;

    }

    private function get_all_user_ids(){

        $args= array('role'=>'student','fields'=>'ID');
        $students= get_users($args);


        $args= array('role'=>'teacher','fields'=>'ID');
        $teacher= get_users($args);

        $args = array('role'=>'parent','fields'=>'ID');
        $parents= get_users($args);

        $args = array('role'=>'school-admin','fields'=>'ID');
        $school_admins= get_users($args);

        $users = array_merge($students, $teacher,$parents,$school_admins);

        return $users;

    }

    private function get_usermeta_table_query(){

        global $wpdb;

        $blog_users= $this->get_all_user_ids();
        $user_ids= join(',',$blog_users);

        $user_meta_query = $wpdb->prepare(
            "SELECT * FROM
                {$wpdb->base_prefix}usermeta WHERE user_id in ($user_ids)",
            array('primary_blog', $this->blog_id)
        );

        $usermeta_table= array(
            'query'=> $user_meta_query,
            'table_name'=> "{$wpdb->base_prefix}usermeta"
        );

        return $usermeta_table;
    }

    private function get_posts_table_query(){

        global $wpdb;

        if($this->last_sync)
            $posts_table_query=$wpdb->prepare(
                "SELECT * FROM {$wpdb->base_prefix}posts
                        WHERE post_type <> %s AND post_modified > '%s'",
                array('page', $this->last_sync)
            );

        else 
            $posts_table_query=$wpdb->prepare(
                "SELECT * FROM {$wpdb->base_prefix}posts
                        WHERE  post_type <> %s",
                'page'
            );

        if($this->sync_type === 'student_app'){

            $posts_table_query=$wpdb->prepare(
                "SELECT p.* FROM {$wpdb->base_prefix}posts p,  {$wpdb->base_prefix}postmeta pm
                        WHERE  post_type LIKE %s 
                        AND p.ID = pm.post_id 
                        AND pm.meta_key LIKE %s 
                        AND pm.meta_value LIKE %s
                UNION SELECT * FROM {$wpdb->base_prefix}posts
                        WHERE post_type LIKE %s",
                array('content-piece', 'content_type', 'student_question', 'attachment')
            );
        }

        $posts_table= array(
            'query'=> $posts_table_query,
            'table_name'=> "{$wpdb->base_prefix}posts"
        );

        return $posts_table;
    }

    private function get_postmeta_table_query(){

        global $wpdb;

        if(!$this->last_sync)
            $postmeta_table_query="SELECT * FROM {$wpdb->base_prefix}postmeta";
        
        else{
            $post_ids_query = $wpdb->prepare(
                    "SELECT DISTINCT p.ID FROM
                    {$wpdb->base_prefix}posts p, {$wpdb->base_prefix}postmeta pm
                    WHERE p.post_modified > %s 
                        AND p.ID = pm.post_id
                        AND p.post_status in ('publish','archive')",
                    array($this->last_sync)
                );

            $post_ids= $wpdb->get_col($post_ids_query);

            if($post_ids)
                $post_ids_str=join(',', $post_ids);
            else
                $post_ids_str=-1;

            $meta_ids_str = $this->get_meta_ids_str();
            
            if(!$meta_ids_str)
                $meta_ids_str = -1;
            
            $postmeta_table_query="SELECT * FROM {$wpdb->base_prefix}postmeta
                        WHERE post_id in ($post_ids_str)
                        OR meta_id in ($meta_ids_str)";
                
        }    

        $postmeta_table= array(
            'query'=> $postmeta_table_query,
            'table_name'=> "{$wpdb->base_prefix}postmeta"
        );

        return $postmeta_table;
    }


    private function get_meta_ids_str(){

        global $wpdb;

        $element_metas=$wpdb->prepare(
            "SELECT pm.meta_value as layout FROM
            {$wpdb->base_prefix}posts p, {$wpdb->base_prefix}postmeta pm
            WHERE p.post_modified > %s AND p.ID = pm.post_id AND pm.meta_key like %s",
            array($this->last_sync,'layout_json')
        );

        $layouts= $wpdb->get_col($element_metas);

        if(is_array($layouts)){
            $meta_ids= array();
            foreach($layouts as $ele){
                $layout = maybe_unserialize($ele);
                $layout = maybe_unserialize($layout);

                if($layout){
                    foreach($layout as $l){
                        $meta_ids= $this->get_meta_ids($l, $meta_ids);
                    }
                }
            }
        }

        if(sizeof($meta_ids>0))
            $meta_ids_str = join(',',__u::compact($meta_ids));

        return $meta_ids_str;

    }


    private function get_meta_ids($layout, &$meta_ids)
    {
        $row_elements = array('Row','TeacherQuestion','TeacherQuestRow');

        if($layout['elements']){
            foreach ($layout['elements'] as &$column) {
                if($column['elements']){
                    foreach ($column['elements'] as &$ele) {
                        if (in_array($ele['element'],$row_elements)) {
                            $ele['columncount'] = count($ele['elements']);
                            $this->get_meta_ids($ele,$meta_ids);
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

    private function get_collection_table_query(){

        global $wpdb;

        $collectionStr = ' WHERE 1 ';

        if($this->last_sync)
            $collectionStr .= " AND last_modified_on > '%".$this->last_sync."%'";

        if($this->sync_type === 'student_app'){
            $collectionStr .= ' AND type LIKE "quiz" ';

            $collection_ids = $this->get_collection_ids_for_user();
            $collection_ids = join(',',$collection_ids);
            $collectionStr .= " AND id in ($collection_ids)";
        }

        $collection_table_query=$wpdb->prepare(
            "SELECT * FROM {$wpdb->base_prefix}content_collection ".$collectionStr, null
        );

        $collection_table= array(
            'query'=> $collection_table_query,
            'table_name'=> "{$wpdb->base_prefix}content_collection"
        );

        return $collection_table;
    }

    private function get_collectionmeta_table_query(){

        global $wpdb;

        $collectionStr = '';

        if($this->sync_type === 'student_app'){
            $collection_ids=$this->get_collection_ids_for_user($this->user_id);
            $collection_ids= join(',',$collection_ids);
            $collectionStr = " AND cm.collection_id in ($collection_ids)";
        }


        if($this->last_sync){
            $collectionmeta_table_query=$wpdb->prepare(
                "SELECT cm.* FROM {$wpdb->base_prefix}content_collection c, {$wpdb->base_prefix}collection_meta cm
                        WHERE c.last_modified_on > '%s' 
                        AND c.ID = cm.collection_id"
                .$collectionStr,
                $this->last_sync
            );
        }
        else{
            $collectionmeta_table_query=$wpdb->prepare("SELECT * FROM {$wpdb->base_prefix}collection_meta cm 
                WHERE 1 ".$collectionStr, null);
        }

        $collectionmeta_table= array(
            'query'=> $collectionmeta_table_query,
            'table_name'=> "{$wpdb->base_prefix}collection_meta"
        );

        return $collectionmeta_table;
    }

    private function get_collection_ids_for_user(){

        global $wpdb;
        
        $collection_ids=array();
        
        if(is_array($this->textbook_ids) and sizeof($this->textbook_ids)>0){
            foreach ($this->textbook_ids as $term_id) {
            
                $collection_table_query = $wpdb->prepare(
                    "SELECT id FROM
                       {$wpdb->base_prefix}content_collection cc
                       WHERE term_ids LIKE %s",
                    '%"'.$term_id.'";%'
                );
                $collection_ids[]= $wpdb->get_col($collection_table_query);
            }
        }

        $collection_ids= __u::flatten($collection_ids);

        return $collection_ids;
    }

    private function get_content_pieces_for_user(){

        global $wpdb;

        $content_pieces=array();

        $collection_ids=$this->get_collection_ids_for_user();

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
                if(is_array($content_pieces) && sizeof($content_pieces>0))
                    $content_pieces= __u::flatten($content_pieces);

                if(is_array($content_pieces) && sizeof($content_pieces>0))
                    $content_pieces= __u::compact($content_pieces);
            }

        }


        return $content_pieces;

    }

    // this function takes an array of tablenames as argument and makes an array of csv data for each table
    // this csv array is then returned
    private function prepare_csvs_for_export($tables_to_export){

        if(sizeof($tables_to_export)<1)
            return false;

        $csv_files= array();

        foreach($tables_to_export as $table)
            $csv_files[]= $this->export_table_to_csv($table);

        return $csv_files;
    }

    // individual table is taken one at a time and sent to exportMysqlToCsv function to create csv
    // this generated csv is then returned to prepare_csvs_for_export function.

    function export_table_to_csv($table){

        $csv_file='';

        if(is_array($table)){
            $table_name= $table['table_name'];
            $csv_data= $this->exportMysqlToCsv($table_name, $table['query']);
        }
        else{
            $csv_data= $this->exportMysqlToCsv($table);
            $table_name= $table;
        }

        if(trim($csv_data) != ''){
            $file['data']= $csv_data;
            $file['name']= $table_name;
            $csv_file=$file;
        }

        return $csv_file;
    }


    private function exportMysqlToCsv($table, $sql_query=''){
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

    

    function is_blog_expired(){
       $current_blog= get_current_blog_id(); 
       switch_to_blog($this->blog_id);
       
       $blog_meta = get_option('blog_meta');
       $blog_meta_array = maybe_unserialize($blog_meta);
       
       switch_to_blog($current_blog);
       if($blog_meta_array['validto'] != ''){
           if(strtotime('+24 hours',strtotime($blog_meta_array['validto'])) < time()){
               return true;
           }
       }
       
       return false; 
    }

    /*
     * insert device sync log entry on every sync
     */
    function create_sync_device_log($last_sync){
        global $wpdb;

        $device_meta = array('user_id' => $this->user_id);
        $record_data = array('blog_id'=>$this->blog_id,'device_type'=>$this->device_type,'sync_date' =>$last_sync,'meta' => maybe_serialize($this->device_meta)); 
        $wpdb->insert( $wpdb->base_prefix . "sync_device_log", $record_data );
        
    }
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
        if(isset($file['name']) &&  ($file['name'] != '') && isset($file['data']) && ($file['data'] !=''))
            $zip->addFromString ($file['name'].'.csv',$file['data']);

    }
    //debug
    //echo 'The zip archive contains ',$zip->numFiles,' files with a status of ',$zip->status;

    //close the zip -- done!
    $zip->close();

    return $destination;

}
