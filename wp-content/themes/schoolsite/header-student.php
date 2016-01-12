<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>Walnut Learning System</title>
        <?php
            global $post;
            $page_slug=$post->post_name;
            $current_user = wp_get_current_user();
            $login_header_pages = array('register-redirect-student', 'social-login-student','dashboard');
            if ( is_user_logged_in() ) {
                array_pop($login_header_pages);
            }
            define("STUDENT_ASSET_PATH", get_template_directory_uri()."/walnut_student_assets/dev/");
            define("ANIMATED_LIBRARY", get_template_directory_uri()."/walnut/dev/");
        ?>        
        <script type="text/javascript">
        function logout(){
            event.preventDefault();
            $("#logout-modal").modal('hide');
            location.href="<?php echo wp_logout_url(); ?>";
        }
        function close_modal(){
            event.preventDefault();
            $("#logout-modal").modal('hide');
            return false;
        }
        </script>
        <!-- Sites Styles -->
        <!-- Bootstrap Core CSS -->
        <link rel="stylesheet" href="<?php echo STUDENT_ASSET_PATH ;?>css/bootstrap.min.css" type="text/css">
        <!-- Custom Css -->
        <link rel="stylesheet" href="<?php echo STUDENT_ASSET_PATH ;?>css/style.css">
        <!-- Animation library -->
        <link href="<?php echo ANIMATED_LIBRARY ;?>css/animate.min.css" rel="stylesheet" type="text/css">
        <!-- Custom Fonts -->
        <link rel="stylesheet" href="<?php echo STUDENT_ASSET_PATH ;?>css/font-awesome.min.css" type="text/css">

        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->

            </head>
            <body>
                <div class="modal fade" id="logout-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-body">
                        <h4>Do you really wish to logout?</h4>
                      </div>
                      <div class="modal-footer">
                        <form action="">
                            <button class="btn btn-default cancel" onclick="close_modal()">
                                Cancel
                            </button>
                            <button class="btn btn-default confirm" onclick="logout()">
                                Ok
                            </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>            
                <!-- Dashboard-Header -->
                <?php if(!in_array($page_slug,$login_header_pages)): ?>  
                <header class="body-push">
                    <nav class="navbar navbar-default wallnut-nav navbar-fixed-top">
                        <div class="container-fluid">
                            <div class="navbar-header">
                                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                </button>
                                <a class="navbar-brand" href="<?php echo site_url(); ?>/dashboard-student"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/walnut-logo.png" class="img-responsive center-block"></a>
                            </div>
                            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul class="nav navbar-nav">
                                    <li class="profile">
                                      <div class="profile-pic">
                                        <?php $initial = trim(student_fetch_name());echo $initial[0]; ?>
                                      </div>
                                    </li>
                                    <li><a class="profile" href="javascript:"><p class="profile-name"><?php echo student_fetch_name() ?><br><span><?php echo student_fetch_division(); ?> - <?php echo get_bloginfo() ?></span></p></a></li>
                                </ul>
                                <ul class="nav navbar-nav navbar-right walnut-account">
                                    
                                    <?php if($page_slug=='dashboard-student'): ?>
                                    <li class="reset-password">
                                    <div class="fixed-container">
                                      <a href="" class="btn fab-header btn-nav  btn-floating btn-large waves-effect waves-light circle"><i class="fa fa-cog"></i></a>
                                      <div class="circle-container">
                                        <div class="round-circle nav-circle waves-effect waves-teal first-circle">
                                          <a href="<?php echo site_url() ?>/change-password-student"><i class="fa fa-nav fa-key"></i></a>
                                        </div>                                     
                                      </div>
                                    </div>
                                    </li>
                                    <?php endif;?>

                                    <?php if(in_array($page_slug, array('dashboard','change-password-student','lecture-listview-student', 'quiz-listview-student', 'lecture-start-student', 'quiz-start-student'))): ?>
                                    <li class="log-session"><a href="<?php echo site_url() ?>/dashboard-student" class="btn fab-header"><i class="fa fa-home"></i></a></li>
                                    <?php endif;?>

                                    <?php if(in_array($page_slug, array('dashboard','change-password-student','dashboard-student','lecture-listview-student', 'quiz-listview-student', 'lecture-start-student', 'quiz-start-student'))): ?>
                                    <li class="log-session"><a id="logout" href="javascript:"  class="btn fab-header"><i class="fa fa-power-off"></i></a></li>
                                    <?php endif;?>

                       
                                </ul>
                            </div>
                        </div>
                    </nav>
                </header>
                <?php endif; ?>
                <?php if(in_array($page_slug, $login_header_pages)): ?>  
                <header>
                    <nav class="navbar navbar-default wallnut-nav">
                        <div class="container-fluid signin-header">
                            <div class="logo">
                                <img src="<?php echo STUDENT_ASSET_PATH ;?>images/walnut-logo.png" class="img-responsive center-block" alt="">
                            </div>
                            <div class="slogan">
                                 <img src="<?php echo STUDENT_ASSET_PATH ;?>images/walnut-tagline.png" class="img-responsive center-block" alt="">
                            </div>
                        </div>
                    </nav>
                </header>
                <?php endif;?>