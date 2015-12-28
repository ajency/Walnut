<!DOCTYPE html>
<html>
<head>
    <title>Walnut Learning System</title>
    <meta http-equiv="content-type" content="text/html;charset=UTF-8"/>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>

    <link href="/wp-content/themes/walnut/walnut/dev/css/listnav.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/select2.css" rel="stylesheet" type="text/css"/>
    <link href="/wp-content/themes/walnut/walnut/dev/css/TimeCircles.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/video-js.min.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/panzer.css" rel="stylesheet" type="text/css">
    <link href="<?php get_site_url()?>/wp-content/themes/walnut/walnut/dev/css/panzerlist.css" rel="stylesheet" type="text/css">

    <link href="/wp-content/themes/walnut/walnut/dev/css/datepicker.css" rel="stylesheet" type="text/css"/>
    <link href="/wp-content/themes/walnut/walnut/dev/css/bootstrap-timepicker.css" rel="stylesheet" type="text/css"/>
    <link href="/wp-content/themes/walnut/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="/wp-content/themes/walnut/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <link href="/wp-content/themes/walnut/walnut/dev/css/jquery.mmenu.all.css" rel="stylesheet" type="text/css"
          media="screen"/>
    <!-- BEGIN CORE CSS FRAMEWORK -->
    <link href="/wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/bootstrap-theme.css" rel="stylesheet" type="text/css"/>
    <link href="/wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/bootstrap-spinedit.css" rel="stylesheet" type="text/css">


    <!-- END CORE CSS FRAMEWORK -->

    <!-- BEGIN CSS TEMPLATE -->
    <link href="/wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">

    <!-- BEGIN BOOK BLOCK -->
    <link href="/wp-content/themes/walnut/walnut/dev/css/bookBlock/custom.css" rel="stylesheet" type="text/css">
    <link href="/wp-content/themes/walnut/walnut/dev/css/bookBlock/bookblock.css" rel="stylesheet" type="text/css">
    <!-- END BOOK BLOCK -->
    
    <link href="/wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css"/>    


    <!-- Begin Additional CSS For Admin Fix -->
    <link href="/wp-content/themes/walnut/walnut/dev/css/admin.css" rel="stylesheet" type="text/css">
    <!-- END Additional CSS For Admin Fix -->


    <?php wp_head();?>
</head>
<body class="">

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