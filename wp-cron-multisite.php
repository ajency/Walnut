<?php

#the call to this file is done via server cron
#this file inturn makes a call to each blog's crons via curl 

require('wp-load.php');

global $wpdb;

$sql = $wpdb->prepare("SELECT domain, path FROM $wpdb->blogs WHERE archived='0' AND deleted ='0' LIMIT 0,300", '');
 
$blogs = $wpdb->get_results($sql);
 
foreach($blogs as $blog) {
    $command = "http://" . $blog->domain . ($blog->path ? $blog->path : '/') . 'wp-cron.php?doing_wp_cron';
    $ch = curl_init($command);
    $rc = curl_setopt($ch, CURLOPT_RETURNTRANSFER, FALSE);
    $rc = curl_exec($ch);
    curl_close($ch);
}