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
                        <!-- <p>You may not see any data if you have not synced. If you are a school admin then go to your link <a href="<?php echo admin_url().'options-general.php?page=school_data_sync' ?>">School Data Sync</a> <p>  -->
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


</body>
</html>