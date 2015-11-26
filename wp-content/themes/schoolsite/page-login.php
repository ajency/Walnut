<?php
/*
  Template Name: Login Page
 */
?>
<?php
    get_header('student');
    wp_head();
    //240935906580-i8f78p42fftas8p4llu8d6va4ldbnp0g.apps.googleusercontent.com
    //mQWjHa1kosS0LofU3NrgG-F-
?>
                <div class="signin-card">
                    <div class="signin-wrapper">
                        <div class="container-fluid">
                            <form action="">
                                <div class="row">
                                    <div class="col-sm-6 col-sm-offset-3 col-lg-6 col-lg-offset-3 wrapped">
                                        <div class="row text-center">
                                            <div class="col-sm-6 col-lg-6 border-rl">
                                                <div class="school-details">
                                                    <div class="profile-pic">
                                                        <img src="<?php echo STUDENT_ASSET_PATH ;?>images/walnut-logo.png" alt="" class="img-responsive center-block">
                                                    </div>   
                                                    <h5><a href="">At Shivane</a></h5>
                                                </div>    
                                            </div>
                                            <div class="col-sm-6 col-lg-6">
                                                <div class="school-details">
                                                    <div class="profile-pic">
                                                        <img src="<?php echo STUDENT_ASSET_PATH ;?>images/walnut-logo.png" alt="" class="img-responsive center-block">
                                                    </div>   
                                                    <h5><a href="">At Fursungi</a></h5>
                                                </div>                                               
                                            </div>
                                        </div>
                                        <hr>
                                        <!--center>Sign In/ Sign Up for Open School</center-->
                                        <div class="row text-center">
                                            <div class="col-sm-6 col-lg-6">
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
                                            <div class="col-sm-6 col-lg-6">
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
    get_footer('student');
?>