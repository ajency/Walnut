<?php 

/*
 * Configuring the communication module
 */

require_once "teaching_modules/functions.php";

//Registering communication components
function add_communication_components($defined_comm_components){

    $preferences = array('preference'=>0);

    $ajcm_components['teaching_modules'] = array(
        'taught_in_class_student_mail'=>$preferences,
        'taught_in_class_parent_mail'=>$preferences
        );

    return $ajcm_components;

}
add_filter('add_commponents_filter','add_communication_components',10,1);

function ajax_add_communication_to_queue() {

    $functionName = 'add_'.$_POST['communication_type'];

    if (function_exists($functionName)){

        unset($_POST['action']);
        $data = $_POST;

        $comm_data = array(
            'component'             => $data['component'], 
            'communication_type'    => $data['communication_type']
        );

        $comm   = $functionName($data,$comm_data);

        if( is_wp_error( $comm ) ) {

            $error= $comm->get_error_message();

            $response=array('error'=>$error);
        }
        else
            $response=array(
                'communication_id'=>$comm,
                'status'=>'OK'
                ); 

    }
    else
        $response=array('error'=>"function $functionName doesnt exist");

    wp_send_json($response);
}

add_action('wp_ajax_create-communications', 'ajax_add_communication_to_queue');