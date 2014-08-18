<?php
function extra_tax_fields( $tag ) {
    //check for existing taxonomy meta for term ID

    global $wpdb;
    $t_id = $tag->term_id;
    $term_meta = get_option( "taxonomy_$t_id" );
    $res = $wpdb->get_results( "select class_id, tags from {$wpdb->prefix}textbook_relationships where textbook_id=" . $t_id, ARRAY_A );
    $classes = maybe_unserialize( $res[0]['class_id'] );
    $subjects = maybe_unserialize( $res[0]['tags'] );

    $textbook_fields = '';
    if ($tag->parent != 0)
        $textbook_fields = 'style="display:none"';
    ?>
    <tr class="form-field textbook_fields" <?= $textbook_fields ?>>
        <th scope="row" valign="top"><label for="cat_Image_url"><?php _e( 'Textbook Image Url' ); ?></label></th>
        <td>
            <div class="row form-input">
                <div class="col-md-12 labels">
                    <input id="image-upload" type="file" name="files" class="inline image-upload"/>

                    <div id="progress" class="progress" style="display:none">
                        <img src="<?= site_url() ?>/wp-content/themes/walnut/images/loader.gif">
                    </div>
                    <div id="image-container" class="success_container">
                        <?php echo $term_meta['attachmenturl'] ? '<img src="' . $term_meta['attachmenturl'] . '" height=100px>' : ''; ?>

                    </div>

                    <input type="hidden" class="attachment_id"
                           value="<?php echo $term_meta['attachmentid'] ? $term_meta['attachmentid'] : ''; ?>"
                           name="term_meta[attachmentid]" placeholder="" class="col-md-3">
                    <input type="hidden" class="attachment_url"
                           value="<?php echo $term_meta['attachmenturl'] ? $term_meta['attachmenturl'] : ''; ?>"
                           name="term_meta[attachmenturl]" placeholder="" class="col-md-3">
                </div>

                <div class="form-actions">

                </div>
            </div>
        </td>
    </tr>
    <tr class="form-field  textbook_fields" <?= $textbook_fields ?>>
        <th scope="row" valign="top"><label for="extra1"><?php _e( 'Author Name' ); ?></label></th>
        <td>
            <input type="text" name="term_meta[author]" id="term_meta[extra1]" size="25" style="width:60%;"
                   value="<?php echo $term_meta['author'] ? $term_meta['author'] : ''; ?>"><br/>
            <span class="description"><?php _e( 'author name' ); ?></span>
        </td>
    </tr>
    <tr class="form-field textbook_fields" <?= $textbook_fields ?>>
        <th scope="row" valign="top"><label for="extra2"><?php _e( 'Classes Suitable For' ); ?></label></th>
        <td><?
            global $class_ids;
            for ($i = 1; $i <= sizeof( $class_ids ); $i++) {
                $selected = '';

                if ($classes)
                    $selected = in_array( $i, $classes ) ? "checked" : '';
                ?>
                <input style="width:20px" type="checkbox" name="classes[]"
                       value="<?= $i ?>" <?= $selected ?> /> <?= $class_ids[$i]['label'] ?><br>
            <? } ?>
            <br>
            <span class="description"><?php _e( 'classes for which this textbook is suitable for' ); ?></span>
        </td>
    </tr>
    <tr>
        <td>Subject :</td>
        <td>
            <?
            global $all_subjects;
            for ($i = 0; $i < sizeof( $all_subjects ); $i++) {
                $selected = '';

                if ($subjects)
                    $selected = in_array( $all_subjects[$i], $subjects ) ? "checked" : '';
                ?>
                <input style="width:20px" type="checkbox" name="term_tags[]"
                       value="<?= $all_subjects[$i] ?>" <?= $selected ?> /> <?= $all_subjects[$i] ?><br>
            <? } ?>
            <br>
            <span class="description"><?php _e( 'subjects which this textbook belongs to' ); ?></span>

        </td>

    </tr>
<?php
}