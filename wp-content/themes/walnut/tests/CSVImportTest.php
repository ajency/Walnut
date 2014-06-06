<?php

/**
 * Created by PhpStorm.
 * User: surajair
 * Date: 05/06/14
 * Time: 3:00 PM
 */
class CSVImportTest extends WP_UnitTestCase {

    protected $id = 0;

    /**
     * Tear down the test fixture.
     */
    public function tearDown() {
        // Cleanup
        wp_delete_attachment( $this->id, true );

        $uploads = wp_upload_dir();
        foreach (scandir( $uploads['basedir'] ) as $file)
            _rmdir( $uploads['basedir'] . '/' . $file );

        parent::tearDown();
    }

    function _make_attachment( $upload, $parent_post_id = 0 ) {
        $type = '';
        if (!empty($upload['type'])) {
            $type = $upload['type'];
        } else {
            $mime = wp_check_filetype( $upload['file'] );
            if ($mime)
                $type = $mime['type'];
        }

        $attachment = array(
            'post_title' => basename( $upload['file'] ),
            'post_content' => '',
            'post_type' => 'attachment',
            'post_parent' => $parent_post_id,
            'post_mime_type' => $type,
            'guid' => $upload['url'],
        );

        // Save the data
        $id = wp_insert_attachment( $attachment, $upload['file'], $parent_post_id );
        wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
        $this->id = $id;
    }

    public function test_something() {

        $this->assertEquals( 2, 2 );
    }

} 