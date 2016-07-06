<?php
    $remote_url = 'http://synapselearning.dev/wp-admin/admin-ajax.php';
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_VERBOSE, 0);
    curl_setopt($ch, CURLOPT_URL, $remote_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    $post = array(
        'data[txtusername]' => $_POST['data']['txtusername'],
        'data[txtpassword]' => $_POST['data']['txtpassword'],
        'action' => 'get-user-profile'
    );
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    $response = curl_exec($ch);
    curl_close($ch);
    //$resp_decode = json_decode($response,true);
    echo $response;
    
