<?php 

/*
 * Configuring the communication module
 */

require_once "teaching_modules/functions.php";
require_once "quiz/functions.php";
require_once "quiz/quiz-report.php";
require_once "user/functions.php";

//Registering communication components
function add_communication_components($defined_comm_components){

    $preferences = array('preference'=>0);

    $ajcm_components['teaching_modules'] = array(
        'taught_in_class_student_mail'  => $preferences,
        'taught_in_class_parent_mail'   => $preferences,
        'teaching_modules_report'        => $preferences,
    );

    $ajcm_components['quiz'] = array(
        'quizzes_taken_report' => $preferences,
        'quiz_completed_student_mail' => $preferences,
        'quiz_completed_parent_mail' => $preferences,
        'quiz_published_parent_mail' => $preferences,
        'quiz_summary_parent_mail' => $preferences,
    );

    $ajcm_components['user'] = array(
        'reset_password' => $preferences
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

function get_student_recipients($division){

    $students=get_students_by_division( $division );

    $recipients= array();

    foreach($students as $student){
        $recipients[] = array(                
                'user_id'   => $student->ID,
                'type'      => 'email',
                'value'     => $student->user_email
            );
    }

    return $recipients;
}

function get_parent_recipients($division){

    $students = get_students_by_division($division);

    $parents = array();

    if(is_array($students)){
        $studentIDs = __u::pluck($students, 'ID');
        $parents = get_parents_by_student_ids($studentIDs);
    }

    $recipients= array();

    foreach($parents as $user){
        $recipients[] = array(                
                'user_id'   => $user->ID,
                'type'      => 'email',
                'value'     => $user->user_email
            ); 
    }

    return $recipients;
}

function get_mail_header($blog_id){

    $header_img = 'http://synapsedu.info/wp-content/themes/walnut/images/synapse-logo-main.png';

    $blog= get_blog_details($blog_id, true);

    $site_url = $blog->siteurl;

    $header = "<a href='$site_url'><img src='$header_img'/></a>";

    return array(
        'name'      => 'HEADER',
        'content'   => $header
    );

}


function get_mail_footer($blog_id){

    $support_mail = "<a href='mailto:support@synapsedu.info'>support@synapsedu.info</a>";

    $footer = "If you are facing any difficulty in accessing the site simply mail us at $support_mail.<br><br>
                Regards,<br>
                Synapse Learning";

    return array(
        'name'      => 'FOOTER',
        'content'   => $footer
    );

}

function format_communication_recipients($users=array()){
        
    $recipients = array();

    if(sizeof($users)>0){

        foreach($users as $user){

            $recipients[] = array(                
                    'user_id'   => $user->ID,
                    'type'      => 'email',
                    'value'     => $user->user_email
                ); 
        }
    }

    return $recipients;
}

function ajax_get_communication_recipients(){

    $functionName = 'prepare_'.$_POST['communication_type'].'_recipients';

    if (function_exists($functionName)){

        unset($_POST['action']);
        $data = $_POST;

        $recipients   = $functionName($data);

        if( is_wp_error( $comm ) ) {

            $recipients= $comm->get_error_message();

            $response=array('error'=>$recipients);
        }
        else
            $response=$recipients;

    }
    else
        $response=array('error'=>"function $functionName doesnt exist");

    wp_send_json($response);

}
add_action('wp_ajax_get-communication-recipients', 'ajax_get_communication_recipients');

function ajax_get_communication_preview(){
    
    global $aj_comm;


    $functionName = $_POST['communication_type'].'_preview';

    if (function_exists($functionName)){

        unset($_POST['action']);
        $data = $_POST;

        $template_data  = $functionName($data);

        switch_to_blog(1);

        $response= $aj_comm->get_email_preview($template_data);

        restore_current_blog();

    }
    else
        $response=array('error'=>"function $functionName doesnt exist");

    wp_send_json($response);

}
add_action('wp_ajax_get-communication-preview','ajax_get_communication_preview');

