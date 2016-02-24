<?php
global $chorus_options; 
?>
<script>
    AJAXURL = '<?php echo admin_url("admin-ajax.php") ?>';
    SITEURL = '<?php echo site_url() ?>';
    THEMEURL = '<?php echo get_template_directory_uri()?>';

    <?php if(is_multisite()){?>
        IS_STANDALONE_SITE = false;
    <?php }
    else { ?>
        IS_STANDALONE_SITE = true;
    <?php }?>

    <?php print_r(getLoggedInUserModel());?>
    MAIN_SITE='<?php echo MAIN_SITE?>';
    CLASS_LABEL = {};
    <?php foreach($class_ids as $class){ ?>
    CLASS_LABEL[<?php echo $class['id']?>] = '<?php echo $class['label']?>';
    <?php } ?>

    CHORUS_OPTIONS = {};
    <?php foreach($chorus_options as $key=>$value){ ?>
    CHORUS_OPTIONS['<?php echo $key?>'] = '<?php echo $value?>';
    <?php } ?>

</script>
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/jquery-1.11.3.min.js"></script>
                <!-- Bootstrap Core JavaScript -->
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/bootstrap.min.js"></script>
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/script.js"></script>
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/scrollReveal.js"></script>
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/nprogress.js"></script>
            </body>
        </html>