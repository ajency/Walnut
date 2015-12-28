<!DOCTYPE html>
<html>
<head>
    <title>Walnut Learning System</title>


    <?php wp_head();?>
</head>
<body class="">
<div id="site_main_container">
    <div>
        <div id="header-region"></div>
        <div class="page-container row-fluid">
            <div id="left-nav-region"></div>
            <a href="#" class="scrollup">Scroll</a>

            <div class="page-content">
                <div class="content">
                    <?php if(!is_multisite()) :?>
                        <?php if(!school_is_syncd()) : ?>
                        <p>You may not see any data if you have not synced. If you are a school admin then go to your link <a href="<?php echo admin_url().'options-general.php?page=school_data_sync' ?>">School Data Sync</a> <p>
                        <?php endif; ?>
                    <?php endif;?>
                            
                    <div id="login-region"></div>
                    <div id="breadcrumb-region"></div>
                    <div id="main-content-region"></div>
                </div>
            </div>
        </div>
    </div>

    <div id="dialog-region">
    </div>
</div>
<?php global $class_ids;
global $chorus_options; ?>
<script>
    AJAXURL = '<?php echo admin_url("admin-ajax.php") ?>';
    SITEURL = '<?php echo site_url() ?>';
    THEMEURL = '<?php echo get_template_directory_uri()?>';

    <?php print_r(getLoggedInUserModel())?>

    CLASS_LABEL = {};
    <?php foreach($class_ids as $class): ?>
    CLASS_LABEL[<?php echo $class['id']?>] = '<?php echo $class['label']?>';
    <?php endforeach; ?>

    CHORUS_OPTIONS = {};
    <?php foreach($chorus_options as $key=>$value){ ?>
    CHORUS_OPTIONS['<?php echo $key?>'] = '<?php echo $value?>';
    <?php } ?>

</script>
<script type="text/javascript" src="/wp-content/themes/walnut/walnut/dev/js/plugins/pace.js"></script>
<script>
    Pace.on('hide', function () {
        document.getElementById("site_main_container").setAttribute('class', 'showAll');
    })
</script>
<?php

if (ENV == 'dev') {
    ?>
    <script type="text/javascript"
            data-main="/wp-content/themes/walnut/walnut/dev/js/walnut-main.js?ver=<?php echo DEV_VERSION ?>"
            src="/wp-content/themes/walnut/walnut/dev/js/plugins/require.js"></script>
<?php
} else {

?>
    <script type="text/javascript"
            src="/wp-content/themes/walnut/walnut/production/walnut-main.js?ver=<?php echo VERSION ?>"></script>
<?php } ?>

</body>
</html>