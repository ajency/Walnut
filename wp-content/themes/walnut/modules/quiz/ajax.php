<?php
/**
 * Created by PhpStorm.
 * User: Asus-Elroy
 * Date: 7/9/14
 * Time: 6:30 PM
 */

require_once 'functions.php';

require_once get_theme_root().'/contentsite/modules/content-pieces/classes/PHPExcel.php';

//file_put_contents("c.txt", get_theme_root().'/contentsite/modules/content-pieces/classes/PHPExcel.php');

function ajax_fetch_single_quiz ()
{

    $id = $_GET['id'];
    $quiz_module = get_single_quiz_module ($id);
    if(!is_wp_error($quiz_module))
        wp_send_json (array('code' => 'OK', 'data' => $quiz_module));
    else
        wp_send_json (array('code' => 'ERROR', 'error_msg' =>$quiz_module->get_error_message()));
}

add_action ('wp_ajax_read-quiz', 'ajax_fetch_single_quiz');


function ajax_fetch_all_quizes(){

    $args = $_GET;
    $defaults = array(
        'textbook' => '',
        'post_status' => 'published', // published
        'quiz_type' => ''
    );
    $args = wp_parse_args($args,$defaults);

    if (is_array($args['textbook']))
        $quiz_modules = get_required_quiz_modules($args);
    else
        $quiz_modules = get_all_quiz_modules($args);
    wp_send_json(array('code' => 'OK', 'data' =>$quiz_modules));
}

add_action('wp_ajax_get-quizes','ajax_fetch_all_quizes');

/* function to get archived quizes*/
function ajax_fetch_archived_quizes(){

    $args = $_GET;
    $defaults = array(
        'textbook' => '',
        'post_status' => 'archive',
        'quiz_type' => ''
    );
    $args = wp_parse_args($args,$defaults);
    $quiz_modules = get_all_quiz_modules($args);
    wp_send_json(array('code' => 'OK', 'data' =>$quiz_modules));
}

add_action('wp_ajax_get-archived-quizes','ajax_fetch_archived_quizes');


function save_quiz_response_summary(){
    
    $args = $_POST;
    // print_r($_POST['status']);exit;
    unset($args['action']);

    $summary_id = write_quiz_response_summary($args);

    wp_send_json(array('summary_id' => $summary_id));

}

add_action('wp_ajax_create-quiz-response-summary','save_quiz_response_summary');

add_action('wp_ajax_update-quiz-response-summary','save_quiz_response_summary');

function fetch_quiz_response_summary(){

    unset($_GET['action']);
    $args = $_GET;
       # file_put_contents("quiz.txt", $_GET);

    $quiz_summary = array();

    if(isset($args['collection_id']) && isset($args['student_id']) && isset($args['taken_on'])){
        $quiz_id = $_GET['collection_id'];
        $quiz_summary = get_quiz_summaries_for_student($_GET['student_id'],$quiz_id);
    }

    else if(isset($_GET['summary_id']))
        $quiz_summary = read_quiz_response_summary($_GET['summary_id']);

    else{
        $quiz_id = $_GET['collection_id'];

        if(isset($_GET['student_ids']))
            foreach($_GET['student_ids'] as $student)
                $quiz_summary = array_merge($quiz_summary, get_quiz_summaries_for_student($student,$quiz_id));
        
        else
            $quiz_summary = get_quiz_summaries_for_student($_GET['student_id'],$quiz_id);
    }

    wp_send_json(array('code' => 'OK','data' => $quiz_summary));
}

add_action('wp_ajax_read-quiz-response-summary', 'fetch_quiz_response_summary');

add_action('wp_ajax_get-quiz-response-summary', 'fetch_quiz_response_summary');

function save_quiz_question_response(){
    $args = $_POST;

    unset($args['action']);

    $logged_in_user_data = wp_get_current_user();

    if($logged_in_user_data->roles[0] == 'administrator' || $logged_in_user_data->roles[0] == 'school-admin')
        wp_send_json(array('qr_id' => '1'));
    else
        $qr_id = write_quiz_question_response($args);

    if($qr_id)
        wp_send_json(array('qr_id' => $qr_id));
    else
        wp_send_json(array('code' => 'error'));
}

add_action('wp_ajax_create-quiz-question-response','save_quiz_question_response');


function update_quiz_question_response(){
    $args = $_POST;

    unset($args['action']);

    $logged_in_user_data = wp_get_current_user();

    if($logged_in_user_data->roles[0] == 'administrator' || $logged_in_user_data->roles[0] == 'school-admin')
        wp_send_json(array('qr_id' => '1'));
    else
        $qr_id = write_quiz_question_response($args);

    if($qr_id)
        wp_send_json(array('qr_id' => $qr_id));
    else
        wp_send_json(array('code' => 'error'));
}

add_action('wp_ajax_update-quiz-question-response','update_quiz_question_response');

function fetch_quiz_question_response(){
    $id = $_GET['qr_id'];
    $quiz_question_response = read_quiz_question_response($id);
    wp_send_json(array('code' => 'OK','data' => $quiz_question_response));
}

add_action('wp_ajax_read-quiz-question-response','fetch_quiz_question_response');

function ajax_get_all_quiz_question_responses(){
    $summary_id = $_GET['summary_id'];
    $quiz_question_response = get_all_quiz_question_responses($summary_id);

    wp_send_json(array('code' => 'OK','data' => $quiz_question_response));
}

add_action('wp_ajax_get-all-quiz-question-responses','ajax_get_all_quiz_question_responses');

function ajax_delete_quiz_response_summary(){

    $summary_id = $_POST['summary_id'];

    $delete = delete_quiz_response_summary($summary_id);

    if($delete)
        wp_send_json(array('code' => 'OK','summary_id' => $summary_id));

    else
        wp_send_json(array('code' => 'ERROR','error_msg' => 'Some error occurred'));



}
add_action('wp_ajax_delete-quiz-response-summary','ajax_delete_quiz_response_summary');

function ajax_save_quiz_schedule(){

    if(!isset($_POST['quiz_id']) || !isset($_POST['division']) ||  !isset($_POST['schedule']) || !isset($_POST['schedule']['from']) || !isset($_POST['schedule']['to']))
        wp_send_json(array('code' => 'ERROR','error_msg' => 'Invalid Data Passed'));

    else{
        $schedule = save_quiz_schedule($_POST);
        wp_send_json(array('code' => 'OK','data' => $schedule)); 
    }

}
add_action('wp_ajax_save-quiz-schedule','ajax_save_quiz_schedule');

function ajax_clear_quiz_schedule(){

    if(!isset($_POST['quiz_id']) || !isset($_POST['division']))
        wp_send_json(array('code' => 'ERROR','error_msg' => 'Invalid Data Passed'));
    else{
        $delete = clear_quiz_schedule($_POST['quiz_id'], $_POST['division']);

        if($delete)
            wp_send_json(array('code' => 'OK','data' => true));
        else
            wp_send_json(array('code' => 'ERROR','error_msg' => 'Some error occured'));

    }
}
add_action('wp_ajax_clear-quiz-schedule', 'ajax_clear_quiz_schedule');


function wp_ajax_add_textbook(){

    #wp_handle_upload( $file, $overrides, $time );
    $data = apply_filters('wp_ajax_add_tag', $_POST);
    return $data;

}

add_action('wp_ajax_add-textbook', 'wp_ajax_add_textbook');


function generate_xls(){
    
    if(isset($_GET['data'])){
        date_default_timezone_set('Asia/Kolkata');
        require_once 'ExcelGenerate.php';
        //create object of class ExcelGenerate
        $data = $_GET['data'];
        $division = $_GET['division'];

        $xclObj = new ExportExcel();
        $excel = $xclObj->excel($data,$division);

    }
        
}

add_action('init','generate_xls');

function ajax_generate_excel_report(){
    date_default_timezone_set('Asia/Kolkata');
    require_once 'ExcelGenerate.php';
    //create object of class ExcelGenerate
    $data = $_GET['data'];
    $division = $_GET['division'];

    $xclObj = new ExportExcel();
    $excel = $xclObj->excel($data,$division);

    //wp_send_json(array('code' => 'OK','data' => $excel));

}

add_action('wp_ajax_generate-xl-report', 'ajax_generate_excel_report');