<?php
   /*
     Template Name: Login Page
    */
   ?>
 <?php if(!is_user_logged_in()): ?>  
<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="">
      <meta name="author" content="">
      <title>Synapse Learning Institute</title>
      <?php
         global $post;
         $page_slug=$post->post_name;
         $current_user = wp_get_current_user();
         $login_header_pages = array('register-redirect-student', 'login','dashboard');
         if ( is_user_logged_in() ) {
             array_pop($login_header_pages);
         }
         define("STUDENT_ASSET_PATH", get_template_directory_uri()."/walnut_student_assets/dev/");
         define("ANIMATED_LIBRARY", get_template_directory_uri()."/walnut/dev/");
         ?>        
      <script type="text/javascript">
         function logout(){
           y = confirm("Do you really wish to logout?");    
           if(y){
             location.href="<?php echo wp_logout_url(); ?>";
           }
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
      <?php
         wp_head();
         //240935906580-i8f78p42fftas8p4llu8d6va4ldbnp0g.apps.googleusercontent.com
         //mQWjHa1kosS0LofU3NrgG-F-
         ?>
   </head>
   <body>
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

                <!-- Signin/Signup -->
                <div class="signin-card">
                    <div class="signin-wrapper">
                        <div class="container-fluid">
                            <form action="">
                                <div class="row">
                                    <div class="col-sm-6 col-sm-offset-3 col-lg-6 col-lg-offset-3 wrapped">
                                        <div class="row text-center">
                                            <div class="col-md-12 reg-login">
                                                <h4>Welcome to Synapse Learning Institute</h4>
                                                <h5>Signin/Signup into your account</h5>
                                            </div>
                                        </div>                                    
                                        <div class="row text-center">
                                            <div class="col-xs-6 col-sm-6 col-lg-6 border-rl">
                                                <div class="school-details">
                                                    <div class="profile-pic">
                                                        <a href="http://walnut.synapsedu.info"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/shivane.png" alt="" class="img-responsive center-block"></a>
                                                    </div>                                              
                                                    <h5><a href="http://walnut.synapsedu.info">Login at Shivane</a></h5>
                                                </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-6 col-lg-6">
                                                <div class="school-details">
                                                    <div class="profile-pic">
                                                          <a href="http://walnut.synapsedu.info"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/fursungi.png" alt="" class="img-responsive center-block"></a>
                                                    </div>   
                                                    <h5><a href="http://walnut.synapsedu.info">Login at Fursungi</a></h5>
                                                </div>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="row text-center">
                                            <div class="col-md-12 reg-login">
                                                <h4>Come join the Synapse Learning Universal Community</h4>
                                                <h5>Lets start up your account here</h5>
                                            </div>
                                        </div>                                          
                                        <div class="row text-center">
                                            <div class="col-xs-6 col-sm-6 col-lg-6 border-rl">
                                              <div class="social-signup">
                                                 <div class="the_champ_login_container">
                                                    <ul class="the_champ_login_ul">
                                                       <i id="theChampGoogleButton" class="fa fa-google-plus btn g-plus " alt="Login with Google" title="Login with Google" onclick="theChampInitiateLogin(this)" >
                                                       Sign in with google
                                                       </i>
                                                    </ul>
                                                 </div>
                                              </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-6 col-lg-6">
                                              <div class="social-signup">
                                                 <div class="the_champ_login_container">
                                                    <ul class="the_champ_login_ul">
                                                       <i id="theChampFacebookButton" class="fa fa-facebook btn fb " alt="Login with Facebook" title="Login with Facebook" onclick="theChampInitiateLogin(this)" >
                                                       Sign in with facebook
                                                       </i>
                                                    </ul>
                                                 </div>
                                              </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            

                            <!-- Support Emails     -->
                            <div class="row text-center">
                                <div class="col-sm-12 col-lg-12">
                                    <div class="support-email">
                                        <h5>Support Emails</h5>
                                        <h5><a href="mailto:walnut@info.com">walnut@info.com</a>/<a href="mailto:helpdesk@walnut.com">helpdesk@walnut.com</a></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
        <?php 
         wp_footer();         
         ?>

      <?php
         global $chorus_options; 
         ?>
      <script>
         AJAXURL = '<?php echo admin_url("admin-ajax.php") ?>';
         SITEURL = '<?php echo site_url() ?>';
         THEMEURL = '<?php echo get_template_directory_uri()?>';
         
         
         <?php print_r(getLoggedInUserModel())?>
         
         CLASS_LABEL = {};
         <?php foreach($class_ids as $class){ ?>
         CLASS_LABEL[<?php echo $class['id']?>] = '<?php echo $class['label']?>';
         <?php } ?>
         
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

      <script src="<?php echo STUDENT_ASSET_PATH ;?>js/jquery-1.11.3.min.js"></script>
      <!-- Bootstrap Core JavaScript -->
      <script src="<?php echo STUDENT_ASSET_PATH ;?>js/bootstrap.min.js"></script>
      <script src="<?php echo STUDENT_ASSET_PATH ;?>js/script.js"></script>
      <script src="<?php echo STUDENT_ASSET_PATH ;?>js/scrollReveal.js"></script>
      <script src="<?php echo STUDENT_ASSET_PATH ;?>js/nprogress.js"></script>

   </body> 
</html>
<?php endif; ?>

 <?php if(is_user_logged_in()): ?>
<?php require_once('home.php'); ?>
 <?php endif;?>