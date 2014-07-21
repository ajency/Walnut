<?php

/**
 * wp admin dashboard custom menu for csv data import and functions school module
 */

require_once 'school_data_import.php';

function school_csv_import_menu() {
    add_options_page( 'CSV Import Options', 'CSV Data Import', 'manage_options', 'school_csv_import', 
            'school_csv_import_options' );
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
            elseif($_FILES["student_csv_file"]["type"] == "text/comma-separated-values" && in_array($extension, $allowedExts)){   
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

function import_student_csv($file_path){
    global $wpdb;
    // get json from parsed csv data
    $csv_json = parseCSV($file_path['tmp_name']);
    $csvData = json_decode($csv_json);
    
    $student_csv_headers = array('NAME',
                                 'ROLL_NO',
                                 'BLOG_ID',
                                 'EMAIL_ID',
                                 'DIVISION',
                                 'DIVISION_ID',
                                 'PARENT_EMAIL_ID_1',
                                 'PARENT_MOBILE_1',
                                 'PARENT_EMAIL_ID_2',
                                 'PARENT_MOBILE_2');
    //print_r($csvData);
    
    //While there is an entry in the CSV data
    $i=1;
    
    if($student_csv_headers !== $csvData[0] ){
            $imp_status = array('success'=>false,'msg'=>'Column Headers incorrect.');
            return $imp_status;
    }
    
    while ($i <= count($csvData)-1 ) {
        
        if(count($csvData[$i]) !== 10){
            $imp_status = array('success'=>false,'msg'=>'Column Count incorrect.');
            return $imp_status;
        }
        
	$user_table = $wpdb->prefix ."users";
        $user_pass = "ajency";
        $user_login = $csvData[$i][0];
        $meta_value_rollno = $csvData[$i][1];
        $blogId = $csvData[$i][2];
        $user_email = $csvData[$i][3];

        $meta_value_division =(int) $csvData[$i][5];
        
        $parent_email1 = $csvData[$i][6];
        $parent_phone1 = $csvData[$i][7];
        $parent_email2 = $csvData[$i][8];
        $parent_phone2 = $csvData[$i][9];
        $role = "student";

        //Check if $user_email is present in users table
        $userExists = $wpdb->get_row( "select * from $user_table where user_email like '%" . $user_email . "%' OR user_login like '%" . $user_login . "%' "  );
		
		if( $userExists != null ){ 
		
			$user_id = $userExists->ID; 
			$userdata = array(
				'ID'            => $user_id,
				'user_pass'     => $user_pass,
				'user_login'    => $user_login,
				'user_email'    => $user_email

			);
	
                        wp_insert_user( $userdata ) ;
		}
		else{
			$userdata = array(
				'user_pass'     => $user_pass,
				'user_login'    => $user_login,
				'user_email'    => $user_email

			);

			$user_id = wp_insert_user( $userdata ) ;
                        
                        if( is_wp_error( $user_id ) ){
                                $imp_status = array('success'=>false,'msg'=>'User Could not be created at row:'.$i);
                                return $imp_status;
                        }

		}
		
		//Insert/Update user meta table	
		update_user_meta( $user_id, 'student_division', $meta_value_division );
		update_user_meta( $user_id, 'roll_no', $meta_value_rollno);
                update_user_meta( $user_id, 'parent_phone1', $parent_phone1 );
		update_user_meta( $user_id, 'parent_phone2', $parent_phone2);
		//add student to blog
		add_user_to_blog( $blogId, $user_id, $role );
                
                $parent_emails = array('parent_email1' =>$parent_email1,'parent_email2' =>$parent_email2);
                add_update_student_parents($user_id,$parent_emails);
                
        $i++;

    }
    
    $imp_status = array('success'=>true,'msg'=>'Students imported.');
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
            wp_new_user_notification($new_parent_id, $password);

            update_user_meta( $user_id, $key, $email_address  );
            update_user_meta( $new_parent_id, 'parent_of', $user_id );

        }
        
    }
}