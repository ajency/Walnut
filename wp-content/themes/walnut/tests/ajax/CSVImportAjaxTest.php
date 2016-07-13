<?php
/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 05/06/14
 * Time: 5:19 PM
 */

namespace ajax;


class CSVImportAjaxTest extends \WP_Ajax_UnitTestCase {

    public function setUp() {
        parent::setUp();

        $_POST['blog_additional'] = array( "some school data" );
        $this->school_id = $this->factory->blog->create();
        switch_to_blog( $this->school_id );
    }

    public function tearDown() {
        restore_current_blog();
        wpmu_delete_blog( $this->school_id, true );
        parent::tearDown();
    }

    public function test_csv_file_upload_ajax() {

        $_POST['action'] = 'sync-app-data';
        //$_POST['blog_id'] = $this->school_id;

        $this->_handleAjax( 'sync-app-data' );

        $this->setExpectedException( 'WPAjaxDieStopException', 'hello' );

    }
} 