<?php

/**
 * wp admin dashboard custom menu for csv data import and functions school module
 */

require_once 'school_data_import.php';

function school_csv_import_menu() {
    if(!is_main_site()){
        add_options_page( 'CSV Import Options', 'CSV Data Import', 'manage_options', 'school_csv_import', 
                'school_csv_import_options' );
    }
}
add_action( 'admin_menu', 'school_csv_import_menu' );

/*
 * function to display the csv import interface
 */
function school_csv_import_options() {
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
    
   $import_status = array();
   
    if(isset($_POST['submit']) && !empty($_POST)){
            $allowedExts = array("csv");
            check_admin_referer( 'school-csvdata-import' );
            $temp = explode(".", $_FILES["student_csv_file"]["name"]);
            $extension = end($temp);
            
            if($_FILES["student_csv_file"]["error"] > 0){
                $import_status = array('success'=>false,'msg'=>'No file added');
            }
            elseif(($_FILES["student_csv_file"]["type"] == "text/comma-separated-values" || $_FILES["student_csv_file"]["type"] == "text/csv" || $_FILES["student_csv_file"]["type"] == "application/vnd.ms-excel") 
                    && in_array($extension, $allowedExts)){   
                $import_status = import_student_csv($_FILES["student_csv_file"]);
            }else{
                $import_status = array('success'=>false,'msg'=>'Invalid file.');
            }

    }
    
    //print_r($import_status);
    if ( !empty($import_status) &&  !$import_status['success']) { ?>
        <div id="message" class="error"><p><strong><?php echo $import_status['msg']; ?></strong></p></div>
    <?php }

    if ( !empty($import_status) &&  $import_status['success']) { ?>
        <div id="message" class="updated"><p><strong><?php echo $import_status['msg']; ?></strong></p></div>
        <table>
            <tr>
                <td>Students Added:</td>   <td><?php echo $import_status['added']; ?></td> <td><?php echo $import_status['added_report']; ?></td> 
            </tr>
            <tr>
                <td>Students Updated:</td> <td><?php echo $import_status['updated']; ?></td> <td><?php echo $import_status['updated_report']; ?></td> 
            </tr>
            <tr>
                <td>Students Failed:</td> <td><?php echo $import_status['failed']; ?></td> <td><?php echo $import_status['failed_report']; ?></td> 
            </tr>
        </table>
    <?php } ?>
        
    <form action="" method="post" enctype="multipart/form-data">
         <label for="studentfile">Add Student File :</label>
         <input type="file" name="student_csv_file" id="student_csv_file"><br>
         <?php wp_nonce_field( 'school-csvdata-import' ); ?>
        <input type="submit" value="Import Data" class="button button-primary" id="submit" name="submit">
    </form>
    </div>
    <?php 
}

/*
 * function to import user provided student csv file
 */
function import_student_csv($file_path){
    global $wpdb;
    $updated_records = $new_records = $failed_records = array();
    // get json from parsed csv data
    $csv_json = parseCSV($file_path['tmp_name']);
    
    $csvData = json_decode($csv_json);
    
    $student_csv_headers = array('USERNAME',
                                 'FIRST_NAME',
                                 'LAST_NAME',
                                 'ROLL_NO',
                                 'BLOG_ID',
                                 'EMAIL_ID',
                                 'DIVISION',
                                 'DIVISION_ID',
                                 'PARENT_EMAIL_ID_1',
                                 'PARENT_MOBILE_1',
                                 'PARENT_EMAIL_ID_2',
                                 'PARENT_MOBILE_2');

    $i=1;
    $update_count = $insert_count = $failed_count = 0;
    
    if($student_csv_headers !== $csvData[0] ){
            $imp_status = array('success'=>false,'msg'=>'Column Headers incorrect.');
            return $imp_status;
    }
 
  //While there is an entry in the CSV data    
    while ($i <= count($csvData)-1 ) {
        
        if( count($csvData[$i]) !== 12  || $csvData[$i][8] == '' || !is_email($csvData[$i][8]) || $csvData[$i][9] == '' ){
            $csvData[$i][] = get_failed_status($csvData[$i]);
            $failed_records[] = $csvData[$i];
            $failed_count++;
            $i++;
            continue;
        }
        
	$user_table = $wpdb->prefix ."users";
        $user_pass = "ajency";
        $user_login = $csvData[$i][0];
        $first_name = $csvData[$i][1];
        $last_name = $csvData[$i][2];
        $meta_value_rollno = $csvData[$i][3];
        $blogId = $csvData[$i][4];
        $user_email = $csvData[$i][5];

        $meta_value_division =(int) $csvData[$i][7];
        
        $parent_email1 = $csvData[$i][8];
        $parent_phone1 = $csvData[$i][9];
        $parent_email2 = $csvData[$i][10];
        $parent_phone2 = $csvData[$i][11];
        $role = "student";

        //Check if $user_email is present in users table
        $userExists = $wpdb->get_row( "select * from $user_table where user_email ='" . $user_email . "' OR user_login ='" . $user_login . "' "  );
		
		if( $userExists != null ){ 
		
			$user_id = $userExists->ID; 
			$userdata = array(
				'ID'            => $user_id,
				'user_pass'     => wp_hash_password($user_pass),
				'user_login'    => $user_login,
				'user_email'    => $user_email

			);
	
                        wp_insert_user( $userdata ) ;
                        $updated_records[] = $csvData[$i];
                        $update_count++;
		}
		else{
			$userdata = array(
				'user_pass'     => $user_pass,
				'user_login'    => $user_login,
				'user_email'    => $user_email

			);

			$user_id = wp_insert_user( $userdata ) ;
                        
                        if( is_wp_error( $user_id ) ){
                            $csvData[$i][] = get_failed_status($csvData[$i]);
                            $failed_records[] = $csvData[$i];
                            $failed_count++;
                            $i++;
                            continue;
                        }
                        
                        $new_records[] = $csvData[$i];
                        $insert_count++;

		}
		
                if(! is_wp_error( $user_id ) ){
                    //Insert/Update user meta table
                    update_user_meta( $user_id, 'first_name', $first_name );
                    update_user_meta( $user_id, 'last_name', $last_name );
                    update_user_meta( $user_id, 'student_division', $meta_value_division );
                    update_user_meta( $user_id, 'roll_no', $meta_value_rollno);
                    update_user_meta( $user_id, 'parent_phone1', $parent_phone1 );
                    update_user_meta( $user_id, 'parent_phone2', $parent_phone2);

                    //add student to blog
                    add_user_to_blog( $blogId, $user_id, $role );

                    $parent_emails = array('parent_email1' =>$parent_email1,'parent_email2' =>$parent_email2);
                    add_update_student_parents($user_id,$parent_emails);
                }
                
                
        $i++;

    }
    
    $import_log_filepaths = get_import_log_status_files($student_csv_headers,$updated_records,$new_records,$failed_records);
    $imp_status = array('success'=>true,'msg'=>'Import Completed.','updated'=>$update_count,'added'=>$insert_count,
                        'failed'=>$failed_count,'added_report'=>$import_log_filepaths['added_records_log'],
                        'updated_report'=>$import_log_filepaths['updated_records_log'],
                        'failed_report'=>$import_log_filepaths['failed_records_log']);
    return $imp_status;
}

function add_update_student_parents($user_id,$parent_emails = array()){
    global $wpdb;   
    
    foreach($parent_emails as $key => $email_address){
        
        if( $parent_id = email_exists( $email_address )) {
            update_user_meta( $user_id, $key, $email_address );
            update_user_meta( $parent_id, 'parent_of', $user_id );
           }
        elseif(is_email($email_address)){
            $password = wp_generate_password( 12, true );
            $new_parent_id = wp_create_user ( $email_address, $password, $email_address);
            wp_update_user( array(
                             'ID'       => $new_parent_id,
                             'nickname' => $email_address
                           )
                         );
            add_user_to_blog(get_current_blog_id(), $new_parent_id, 'parent' );
            //avoiding sending notification incase of bulk new parent users
            //wp_new_user_notification($new_parent_id, $password);

            update_user_meta( $user_id, $key, $email_address  );
            update_user_meta( $new_parent_id, 'parent_of', $user_id );

        }
        
    }
}

function get_import_log_status_files($csv_headers,$updated,$new,$failed){
    $ret_data = array('updated_records_log' => '',
                      'added_records_log' => '',
                      'failed_records_log' => '');
     
    clear_csv_import_logs();
    
    $uploads_dir = wp_upload_dir();

    $upload_directory = str_replace('/images', '', $uploads_dir['basedir']);
    $upload_url = str_replace('/images', '', $uploads_dir['baseurl']);
    
    if(!file_exists($upload_directory.'/tmp/'))
        mkdir($upload_directory.'/tmp',0755);

    if(!file_exists($upload_directory.'/tmp/csv_import_logs'))
        mkdir($upload_directory.'/tmp/csv_import_logs',0755);

    if(count($updated) > 0){
        $random= rand(9999,99999);
        $log_path= '/tmp/csv_import_logs/updated-'.$random.date('Ymdhis').'.csv';
        $csv_handler = fopen($upload_directory.$log_path, 'w');
        
        fputcsv($csv_handler, $csv_headers);
        foreach ($updated as $fields) 
        {
            fputcsv($csv_handler, $fields);
        }

        fclose($csv_handler);    
        
        $ret_data['updated_records_log'] = "<a href='".$upload_url.$log_path."' target='_blank'>View Records</a>";
    }
    
    if(count($new) > 0){
        $random= rand(9999,99999);
        $log_path= '/tmp/csv_import_logs/added-'.$random.date('Ymdhis').'.csv';
        $csv_handler = fopen($upload_directory.$log_path, 'w');
        
        fputcsv($csv_handler, $csv_headers);
        foreach ($new as $fields) 
        {
            fputcsv($csv_handler, $fields);
        }

        fclose($csv_handler);  
        
        $ret_data['added_records_log'] = "<a href='".$upload_url.$log_path."' target='_blank'>View Records</a>";
    }
    
    if(count($failed) > 0){
        $random= rand(9999,99999);
        $log_path= '/tmp/csv_import_logs/failed-'.$random.date('Ymdhis').'.csv';
        $csv_handler = fopen($upload_directory.$log_path, 'w');
        $tmp_csv_headers = $csv_headers;
        $tmp_csv_headers[] = 'REASON';
        fputcsv($csv_handler, $tmp_csv_headers);
        foreach ($failed as $fields) 
        {
            fputcsv($csv_handler, $fields);
        }

        fclose($csv_handler);  
        $ret_data['failed_records_log'] = "<a href='".$upload_url.$log_path."' target='_blank'>View Records</a>";
    }
    
    return $ret_data;
}

function clear_csv_import_logs(){
    
    $uploads_dir = wp_upload_dir();
    
    $log_dir_path = str_replace('/images', '', $uploads_dir['path']) . '/tmp/csv_import_logs';
    if(file_exists($log_dir_path)){
        $files = glob($log_dir_path.'/*'); // get all file names from csv_import_logs folder
        foreach($files as $file){ // iterate files
            if(is_file($file))
                unlink($file); // delete file
        }
    }
}

function get_failed_status($csvDataRecord){

    if(count($csvDataRecord) !== 12)
        $status = 'Columns Not Equal';
    elseif($csvDataRecord[8] == '' )
         $status = 'Parent Email required';
    elseif(!is_email($csvDataRecord[8]))
         $status = 'Invalid Parent Email';
    elseif($csvDataRecord[9] == '')
         $status = 'Parent Mobile required';
    else
         $status = '-';
    
    return $status;
}
