<?php

/**
 * wp admin dashboard custom menus and functions
 */

function admin_scripts_division($hook) {
    if( 'settings_page_school_divisions' != $hook )
        return;
    wp_enqueue_script( 'school_divisions', get_template_directory_uri() .
            '/modules/divisions/js/school_divisions.js', array(), false, true );
}
add_action( 'admin_enqueue_scripts', 'admin_scripts_division',100 );

function school_divisions_addedit_menu() {
    add_options_page( 'School Divisions Options', 'School Divisions', 'manage_options', 'school_divisions', 
            'school_divisions_options' );
}
add_action( 'admin_menu', 'school_divisions_addedit_menu' );

/*
 * function to display the school divisions
 */
function school_divisions_options() {
    if ( !current_user_can( 'manage_options' ) )  {
        wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    }
    
    global $wpdb,$classids;
    
    $has_updated = false;

    if(isset($_POST['submit']) && !empty($_POST)){

            check_admin_referer( 'school-divisions-save' );
            // loop through the division rows to update/insert divisions
            for($i=1;$i<=$_POST['division_count'];$i++){
                if(isset($_POST['divisionid_'.$i]) && $_POST['divisionid_'.$i] != ""){
                    $update_data = array(
                        'division' => $_POST['divisionlabel_'.$i],
                        'class_id' => $_POST['divisionclass_'.$i]
                    );

                    $wpdb->update( $wpdb->prefix . 'class_divisions', $update_data,
                                    array( 'id' => $_POST['divisionid_'.$i] ) );
                }elseif(isset($_POST['divisionid_'.$i]) && $_POST['divisionclass_'.$i] !="" && $_POST['divisionlabel_'.$i] !=""){
                    $insert_data = array(
                        'division' => $_POST['divisionlabel_'.$i],
                        'class_id' => $_POST['divisionclass_'.$i]
                    );
                    $wpdb->insert( $wpdb->prefix . 'class_divisions', $insert_data,
                           array( '%s', '%d') );
                }
                
            }
            
            $has_updated = true;

    }

    if ( $has_updated ) { ?>
        <div id="message" class="updated"><p><strong><?php _e( 'Divisions Updated.' ); ?></strong></p></div>
    <?php } 
    
    $divisions_qry = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}class_divisions");
    
    //print_r($classids);
   ?>

   <div class="info updated" style="display:none"></div>

    <div class="wrap">
        
    <script>
    CLASS_LABEL = {};
    <?php foreach($classids as $class){ ?>
    CLASS_LABEL[<?php echo $class['id']?>] = '<?php echo $class['label']?>';
    <?php } ?>
    </script>
    
    <form action="" method="post">
     <table class="form-table" id="blog-division-table"> 
         <tr><th>Division ID</th><th>Class</th><th>Division Name</th></tr>
	<?php 
        $counter=1;
        foreach($divisions_qry as $division){?>

         <tr>
             <td><?php echo $division->id; ?></td>
             <td><?php get_class_dropdown($counter,$division->class_id); ?></td>
             <td>
             <input type='text' class='regular-text code' name='divisionlabel_<?php echo $counter;?>' 
                    id='divisionlabel_<?php echo $counter;?>' value='<?php echo $division->division; ?>'/>
             <input type='hidden' name='divisionid_<?php echo $counter;?>' id='divisionid_<?php echo $counter;?>' 
                    value='<?php echo $division->id; ?>'/>
             <a class='delete_division' id="del_division_<?php echo $division->id; ?>" href="javascript:void(0);" >
                 Delete</a>
             </td>   
         </tr>
        <?php $counter++;}
        
        wp_nonce_field( 'school-divisions-save' ); ?>
         
    </table>
        <input type="hidden" name="division_count" id="division_count" value="<?php echo $counter-1; ?>"/>
        <input type="button" value="Add Division" class="button button-primary" id="add-division" name="add-division">
        <br/>
        <br/>
        <input type="submit" value="Save Divisions" class="button button-primary" id="submit" name="submit">
    </form>
    </div>
    <?php 
}

function get_class_dropdown($index,$class_id = NULL){
    global $classids;
    $returnhtml ="<select name='divisionclass_".$index."' id='divisionclass_".$index."'>"; 
    foreach ($classids as $class){
        $selected = ($class['id'] == $class_id) ? 'selected':'';
        $returnhtml .="<option value='".$class['id']."' ".$selected.">".$class['label']."</option>";      
    }
    $returnhtml .="</select>"; 
    echo $returnhtml;
}

/**
 * delete a class division 
 */
function ajax_delete_school_division() {
    global $wpdb;
    if (isset($_POST['division_id']) && intval($_POST['division_id'])) {
        $delquery = $wpdb->prepare("DELETE FROM {$wpdb->prefix}class_divisions
                                    WHERE id = %d",
                                    $_POST['division_id'] 
                                  );
        $wpdb->query($delquery); 
        $response = json_encode(array('code' => 'OK', 'message' => 'Division Deleted'));
    } else {
        $response = json_encode(array('code' => 'ERROR', 'message' => 'Error!! Please try again.'));
    }
    echo $response;

    die;
}
add_action('wp_ajax_delete_school_division', 'ajax_delete_school_division');