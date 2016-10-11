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
      <title>Walnut Learning System</title>
      <?php
         global $post;
         $page_slug=$post->post_name;
         $current_user = wp_get_current_user();
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
      <link rel="stylesheet" href="<?php echo STUDENT_ASSET_PATH ;?>css/bootstrap.min.css" type="text/css">
      <link rel="stylesheet" href="<?php echo STUDENT_ASSET_PATH ;?>css/style.css">
      <link rel="stylesheet" href="<?php echo STUDENT_ASSET_PATH ;?>css/font-awesome.min.css" type="text/css">
      <?php wp_head(); ?>
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
                                                <h4>Welcome to Walnut Learning System</h4>
                                                <h5>Choose your school</h5>
                                            </div>
                                        </div>                                    
                                        <div class="row text-center">
                                            <div class="col-xs-6 col-sm-6 col-lg-6 border-rl">
                                                <div class="school-details">
                                                    <div class="profile-pic">
                                                        <a href="http://walnut.<?php echo $_SERVER['SERVER_NAME']; ?>"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/shivane.png" alt="" class="img-responsive center-block"></a>
                                                    </div>                                              
                                                    <h5><a href="http://walnut.<?php echo $_SERVER['SERVER_NAME']; ?>">Login at Shivane</a></h5>
                                                </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-6 col-lg-6">
                                                <div class="school-details">
                                                    <div class="profile-pic">
                                                          <a href="http://fursungi.<?php echo $_SERVER['SERVER_NAME']; ?>"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/fursungi.png" alt="" class="img-responsive center-block"></a>
                                                    </div>   
                                                    <h5><a href="http://fursungi.<?php echo $_SERVER['SERVER_NAME']; ?>">Login at Fursungi</a></h5>
                                                </div>
                                            </div>
                                        </div>
                                        <hr>
                                        <div class="row text-center">
                                            <div class="col-md-12 reg-login">
                                                <h4>Come join the Walnut Universal Tribe</h4>
                                                <h5>Lets start up your account here</h5>
                                            </div>
                                        </div>                                          
                                        <div class="row text-center">

                                            <div class="col-xs-6 col-sm-6 col-lg-6 border-rl">
                                              <div class="social-signup">
                                                 <div class="the_champ_login_container">
                                                    <ul class="the_champ_login_ul">
                                                       <!-- <i id="theChampGoogleButton" class="fa fa-google-plus btn g-plus " alt="Login with Google" title="Login with Google" onclick="theChampInitiateLogin(this)" >
                                                       Sign in with google
                                                       </i> -->
                                                       <a rel="nofollow" href="javascript:void(0);" title="Connect with Google" class="fa fa-google-plus btn g-plus wp-social-login-provider wp-social-login-provider-google" data-provider="Google"> Sign in with google</a>
                                                    </ul>
                                                 </div>
                                              </div>
                                            </div>
                                            <div class="col-xs-6 col-sm-6 col-lg-6">
                                              <div class="social-signup">
                                                 <div class="the_champ_login_container">
                                                    <ul class="the_champ_login_ul">
                                                       <!-- <i id="theChampFacebookButton" class="fa fa-facebook btn fb " alt="Login with Facebook" title="Login with Facebook" onclick="theChampInitiateLogin(this)" >
                                                       Sign in with facebook
                                                       </i> -->
                                                       <a rel="nofollow" href="javascript:void(0);" title="Connect with Facebook" class="fa fa-facebook btn fb wp-social-login-provider wp-social-login-provider-facebook" data-provider="Facebook"> Sign in with facebook</a>
                                                    </ul>
                                                 </div>
                                              </div>
                                            </div>


                                            <?php //do_action( 'wordpress_social_login' ); ?>

                                            <input type="hidden" id="wsl_popup_base_url" value="http://synapsedu.info/wp-login.php?action=wordpress_social_authenticate&#038;mode=login&#038;" />
                                            <input type="hidden" id="wsl_login_form_uri" value="http://synapsedu.info/wp-login.php" />


                                        </div>
                                    </div>
                                </div>
                            </form>
                            

                            <!-- Support Emails     -->
                            <div class="row text-center">
                                <div class="col-sm-12 col-lg-12">
                                    <div class="support-email">
                                        <h5>Support Emails</h5>
                                        <h5><a href="mailto:ask@walnutedu.in">ask@walnutedu.in</a></h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
        <?php 
         wp_footer();         
         ?>

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