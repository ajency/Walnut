<?php

function get_content_pieces_import_page_html_data(){
   
	if(isset($_POST['submit']) && !empty($_POST)){
		check_admin_referer( 'content-pieces-import' );
		import_content_piece($_POST['type']);
	}
	?>
   <h2>Content Pieces Import</h2>
   
   <form method="post" action="">
   		
   		<label>MCQ</label>: 
   		<input type="file">
   		<?php wp_nonce_field( 'content-pieces-import' );?>
   		<input name="type" type="hidden" value="mcq">
   		<input name="submit" type="submit">
   		
   </form>
   
   <?php
}

function import_content_piece($type, $file){
	echo $type;
	echo "test import"; exit;
}