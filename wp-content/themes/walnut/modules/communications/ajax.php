<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 25/06/14
 * Time: 3:28 PM
 */

require_once 'functions.php';
require_once 'send_mail.php';
require_once 'communication_cron.php';

function ajax_save_communications() {

    unset($_POST['action']);
    $data = $_POST;

    $communication_details = save_communication($data);

    wp_send_json($communication_details);
}

add_action('wp_ajax_create-communications', 'ajax_save_communications');


function cron_send_communications() {
    $status_report= send_pending_communications();

}
add_action( 'start_communications_cron', 'cron_send_communications' );