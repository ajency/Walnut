<?php


class ExportCSVFunctionsTest extends WP_UnitTestCase {

    public function testIfTablesToExportArrayIsProper() {

        $blog_id = 35;

        switch_to_blog($blog_id);
        $last_sync='2014-05-20 10:34:44';


        $tables = get_tables_to_export($blog_id,$last_sync);

        print_r($tables);

        $this->assertInternalType('array', $tables);
    }

    public function testPostTableResponse() {

        $user_id = 1;

        $last_sync='2014-05-20 10:34:44';


        $post_tables = get_posts_table_query($last_sync, $user_id);

        //print_r($post_tables);

        $this->assertInternalType('array', $post_tables);
    }

    public function testCollectionIDsForUser() {

        $user_id = 1;

        $last_sync='2014-05-20 10:34:44';


        $collection_ids = get_collection_ids_for_user($user_id);

        //print_r($collection_ids);

        $this->assertInternalType('array', $collection_ids);
    }

    public function testContentPiecesForUser() {

        $user_id = 1;

        $last_sync='2014-05-20 10:34:44';


        $content_pieces = get_content_pieces_for_user($user_id);

        print_r($content_pieces);

        print_r(get_template_directory());

        $this->assertInternalType('array', $content_pieces);
    }

    public function testDownSync() {

        $blog_id = 35;

        $last_sync='2014-05-20 10:34:44';

        $export_details = export_tables_for_app($blog_id,$last_sync);

        print_r($export_details);

        $this->assertInternalType('array', $export_details);
    }


}
