<?php

require_once 'functions.php';

function save_question_response() {
    global $user_ID;
    
    print_r($_POST);
    
    //$menu=get_site_menu($user_role);
    //wp_send_json($menu);
}
add_action( 'wp_ajax_save-question-response', 'save_question_response' );

