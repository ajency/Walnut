<?php
/**
 * Created by PhpStorm.
 * User: ajency
 * Date: 25/06/14
 * Time: 6:11 PM
 */
require_once "message-types/modules_completed.php";

function send_pending_communications() {

    global $wpdb;

    $comm_table = $wpdb->base_prefix . "comm_module";

    $pending_comms_query = $wpdb->prepare(
            "SELECT * FROM $comm_table
                WHERE status=%s",
            'pending'
    );

    $pending_comms=$wpdb->get_results($pending_comms_query);

    foreach ((array) $pending_comms as $comm){

        $recipients=maybe_unserialize($comm->recipients);

        if ($comm->mode === 'email')

            send_emails(
                $comm->id,
                $comm->message_type,
                $recipients,
                $comm->blog,
                $comm->mode
            );

    }
}

function send_emails($comm_id, $message_type, $recipients, $blog, $mode) {
    switch ($message_type) {

        case "modules_completed":

            if($mode === 'email')
                send_modules_completed_mail($comm_id, $recipients, $blog);

            else
                send_modules_completed_sms($comm_id, $recipients, $blog);

            break;
    }
}

function get_communications_meta($comm_id, $meta_key){

    global $wpdb;

    $comm_meta_table = $wpdb->base_prefix . "comm_module_meta";

    $comm_meta_table_query = $wpdb->prepare(
        "SELECT meta_value FROM $comm_meta_table
                WHERE comm_module_id = %d AND meta_key=%s",
        array($comm_id, $meta_key)
    );


    $meta_value=$wpdb->get_var($comm_meta_table_query);

    $meta_value = maybe_unserialize($meta_value);

    return $meta_value;
}

function get_communications_footer($blog_id=0){

    if(!$blog_id)
        $blog_id = get_current_blog_id();

    $blog_name = get_blog_option($blog_id, 'blogname');

    $admins= get_users(array('role'=>'school-admin', 'blog_id'=>$blog_id));

    $admin_emails=array();
    foreach($admins as $admin){
        $admin_emails[] = $admin->user_email;
    }

    $admin_emails= join(', ',$admin_emails);

    $footer_txt = "For enquiries or support, email us at $admin_emails<br><br>
                Regards,
                $blog_name";

    return $footer_txt;

}