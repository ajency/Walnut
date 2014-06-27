<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 25/06/14
 * Time: 6:29 PM
 */

add_filter( 'wp_mail_content_type', 'set_html_content_type' );


/*send mail*/
function send_mail( $subject, $text, $to, $comm_id ) {

    global $wpdb;
    $comm_table = $wpdb->prefix."comm_module" ;
    $headers = 'From: Synapse Learning <admin@synapsedu.info>' . "\r\n";
    $wpdb->update(
        $comm_table,
        array(
            'status' => 'sent' // string

        ),
        array( 'id' => $comm_id )
    );

    add_filter('wp_mail_content_type', create_function('', 'return "text/html";'));
    wp_mail( $to, $subject, $text, $headers );
}

/*set email content*/
function set_html_content_type() {
    return 'text/html';
}
