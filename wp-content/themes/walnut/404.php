<?php
$home_url = get_bloginfo('url');
header("HTTP/1.x 404 Not Found");//for search engines
header("Location: $home_url");

?>
