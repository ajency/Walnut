<?php
/**
 * Created by PhpStorm.
 * User: Asus-Elroy
 * Date: 7/9/14
 * Time: 6:30 PM
 */

require_once 'functions.php';

function ajax_create_quiz ()
{
    $data = array(
        'name' => $_POST['name'],
        'description' => $_POST['description'],
        'term_ids' => $_POST['term_ids'],
        'duration' => $_POST['duration'],
        'minshours' => $_POST['minshours'],
        'post_status' => $_POST['post_status'],
        'permissions' => $_POST['permissions'],
        'type' => $_POST['type'],
        'quiz_type' => $_POST['quiz_type'],
        'marks' => $_POST['marks'],
        'negMarksEnable' => $_POST['negMarksEnable'],
        'negMarks' => $_POST['negMarks'],
        'message' => $_POST['message']
    );
    $id = save_quiz_module ($data);


//    echo $id ;exit;

    wp_send_json (array('code' => 'OK', 'data' => array('id' => $id)));
}

add_action ('wp_ajax_create-quiz', 'ajax_create_quiz');

function ajax_update_quiz ()
{

    if (isset($_POST['changed']) && $_POST['changed'] == 'module_details') {

        $data = array(
            'id' => $_POST['id'],
            'name' => $_POST['name'],
            'description' => $_POST['description'],
            'term_ids' => $_POST['term_ids'],
            'duration' => $_POST['duration'],
            'minshours' => $_POST['minshours'],
            'post_status' => $_POST['post_status'],
            'permissions' => $_POST['permissions'],
            'type' => $_POST['type'],
            'quiz_type' => $_POST['quiz_type'],
            'marks' => $_POST['marks'],
            'negMarksEnable' => $_POST['negMarksEnable'],
            'negMarks' => $_POST['negMarks'],
            'message' => $_POST['message']
        );

        $id = save_quiz_module ($data);
    }
    if (isset($_POST['changed']) && ($_POST['changed']=='content_pieces')) {
        $data = array(
            'id' => $_POST['id'],
            'content_layout' => $_POST['content_layout']
        );
        update_quiz_content_layout($data);
    }

    wp_send_json (array('code' => 'OK', 'data' => array('id' => (int)$_POST['id'])));
}

add_action ('wp_ajax_update-quiz', 'ajax_update_quiz');

function ajax_fetch_single_quiz ()
{
    $id = $_GET['id'];
    $quiz_module = get_single_quiz_module ($id);

    wp_send_json (array('code' => 'OK', 'data' => $quiz_module));
}

add_action ('wp_ajax_read-quiz', 'ajax_fetch_single_quiz');


function ajax_fetch_all_quizes(){

    $args = $_GET;
    $defaults = array(
        'textbook' => '',
        'post_status' => 'publish',
        'quiz_type' => ''
    );
    $args = wp_parse_args($args,$defaults);
    $quiz_modules = get_all_quiz_modules($args);
    wp_send_json(array('code' => 'OK', 'data' =>$quiz_modules));
}

add_action('wp_ajax_get-quizes','ajax_fetch_all_quizes');




function save_quiz_response_summary(){
    
    $args = $_POST;
    // print_r($_POST['status']);exit;
    unset($args['action']);

    $summary_id = write_quiz_response_summary($args);

    wp_send_json(array('code' => 'OK',array('summary_id' => $summary_id)));

}

add_action('wp_ajax_save-quiz-response-summary','save_quiz_response_summary');

add_action('wp_ajax_undate-quiz-response-summary','save_quiz_response_summary');

function fetch_quiz_response_summary(){

    unset($_GET['action']);
    $args = $_GET;
    $quiz_summary = read_quiz_response_summary($args);

    wp_send_json(array('code' => 'OK','data' => $quiz_summary));
}

add_action('wp_ajax_read-quiz-response-summary', 'fetch_quiz_response_summary');


function save_quiz_question_response(){
    $args = $_POST;

    unset($args['action']);

    $qr_id = write_quiz_question_response($args);

    wp_send_json(array('code' => 'OK',array('qr_id' => $qr_id)));
}

add_action('wp_ajax_save-quiz-question-response','save_quiz_question_response');


function update_quiz_question_response(){
    $args = $_POST;

    unset($args['action']);

    $qr_id = write_quiz_question_response($args);

    if($qr_id)
        wp_send_json(array('code' => 'OK',array('qr_id' => $qr_id)));
    else
        wp_send_json(array('code' => 'error'));
}

add_action('wp_ajax_update-quiz-question-response','update_quiz_question_response');

function get_quiz_question_response(){
    $id = $_GET['qr_id'];
    $quiz_question_response = read_quiz_question_response($id);
    wp_send_json(array('code' => 'OK','data' => $quiz_question_response));
}

add_action('wp_ajax_read-quiz-question-response','get_quiz_question_response');