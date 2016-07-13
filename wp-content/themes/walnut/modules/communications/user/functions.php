<?php

function add_user_reset_password_mail($user){

    global $aj_comm;

    $meta_data = array();

    $recipients[] = array(
                'user_id'   => $user->ID,
                'type'      => 'email',
                'value'     => $user->user_email
            );

    $comm_data = array(
            'component'             => 'user', 
            'communication_type'    => 'reset_password',
            'user_id' 				=> $user->ID
        );

    $comm= $aj_comm->create_communication($comm_data,$meta_data,$recipients);

    return $comm;

}