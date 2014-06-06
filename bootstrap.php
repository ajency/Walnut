<?php
// Load WordPress test environment
// https://github.com/nb/wordpress-tests
//
$_SERVER['SERVER_PROTOCOL'] = 'HTTP/1.1';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
$_SERVER['SERVER_NAME'] = 'localhost';
$_SERVER['HTTP_HOST'] = 'localhost';
$PHP_SELF = $GLOBALS['PHP_SELF'] = $_SERVER['PHP_SELF'] = '/index.php';
// These are still needed
global $wpdb, $current_site, $current_blog, $wp_rewrite, $shortcode_tags, $wp;
require_once 'wp-config.php';

/*
  Base Unit Test class for wordpress
 */
class WP_UnitTestCase extends PHPUnit_Framework_TestCase {

    function setUp() {
            global $wpdb;
            $wpdb->suppress_errors = false;
            $wpdb->show_errors = true;
            $wpdb->db_connect();
            ini_set('display_errors', 1 );
            $this->clean_up_global_scope();
            //$this->start_transaction();
    }

    function clean_up_global_scope() {
            $_GET = array();
            $_POST = array();
            $this->flush_cache();
    }

    function flush_cache() {
            global $wp_object_cache;
            $wp_object_cache->group_ops = array();
            $wp_object_cache->stats = array();
            $wp_object_cache->memcache_debug = array();
            $wp_object_cache->cache = array();
            if ( method_exists( $wp_object_cache, '__remoteset' ) ) {
                    $wp_object_cache->__remoteset();
            }
            wp_cache_flush();
    }
}