<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme and one
 * of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query,
 * e.g., it puts together the home page when no home.php file exists.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Walnut
 * @since Walnut 1.0
 */
/*
  Template Name: Content Collection Template
 */
?>

<!DOCTYPE html>
<!DOCTYPE html>
<html>
    <head>
        <title>Walnut Learn</title>
        <meta http-equiv="content-type" content="text/html;charset=UTF-8" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta content="" name="description" />
        <meta content="" name="author" />

        <!-- NEED TO WORK ON -->
        <?php 
        $ver = date('YmdHis');
        if(ENV == 'dev'){
        ?>
        
        <link href="./wp-content/themes/walnut/walnut/dev/css/pace.coinspin.css" rel="stylesheet" type="text/css" media="screen"/>
        <link href="./wp-content/themes/walnut/walnut/dev/css/jquery.sidr.light.css" rel="stylesheet" type="text/css" media="screen"/>
        <!-- BEGIN CORE CSS FRAMEWORK -->
        <link href="./wp-content/themes/walnut/walnut/dev/css/bootstrap.min.css" rel="stylesheet" type="text/css">
        <link href="./wp-content/themes/walnut/walnut/dev/css/bootstrap-theme.css" rel="stylesheet" type="text/css"/>
        <link href="./wp-content/themes/walnut/walnut/dev/css/font-awesome.css" rel="stylesheet" type="text/css">
        <link href="./wp-content/themes/walnut/walnut/dev/css/animate.min.css" rel="stylesheet" type="text/css">
        <link href="./wp-content/themes/walnut/walnut/dev/css/select2.css" rel="stylesheet" type="text/css"/>
        <!-- END CORE CSS FRAMEWORK -->

        <!-- BEGIN CSS TEMPLATE -->
        <link href="./wp-content/themes/walnut/walnut/dev/css/style.css" rel="stylesheet" type="text/css">
        <link href="./wp-content/themes/walnut/walnut/dev/css/responsive.css" rel="stylesheet" type="text/css">
        <link href="./wp-content/themes/walnut/walnut/dev/css/custom-icon-set.css" rel="stylesheet" type="text/css">
        <link href="./wp-content/themes/walnut/walnut/dev/css/custom.css" rel="stylesheet" type="text/css"/>

        <!-- END CSS TEMPLATE -->

        <?php }
        else {
        ?>
            <link href="./wp-content/themes/walnut/walnut/production/css/walnut.min.css?ver=<?php echo $ver?>" rel="stylesheet" type="text/css"/>
        <?php }?>
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
                            <div id="login-region"></div>
                            <div id="breadcrumb-region"></div>
                            <div id="main-content-region"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="dialog-region"></div>
        </div>
        <script>
            AJAXURL = '<?php echo admin_url("admin-ajax.php") ?>';
            SITEURL = '<?php echo site_url() ?>';
        </script>
        <script type="text/javascript" src="./wp-content/themes/walnut/walnut/dev/js/plugins/pace.js"></script>
        <?php if (ENV == 'dev') { ?>
            <script type="text/javascript" data-main="./wp-content/themes/walnut/walnut/dev/js/content-collection-main" src="./wp-content/themes/walnut/walnut/dev/js/plugins/require.js"></script>
            <?php } else {
            ?>
                <script type="text/javascript"  src="./wp-content/themes/walnut/walnut/production/content-collection-main.js?ver=<?php echo $ver?>"></script>
        <?php } ?>

    </body>
</html>