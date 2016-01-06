<?php 

require_once 'modules/content-pieces/ajax.php';
require_once 'modules/content-modules/ajax.php';
require_once 'modules/quiz/ajax.php';
require_once 'modules/student-training/ajax.php';
require_once 'functions-openschool-student.php';

add_action('wp_logout','student_go_login');
function student_go_login(){
	wp_redirect(MAIN_SITE."/login" );
	exit();
}