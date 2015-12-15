<?php
global $chorus_options; 
?>
<script>
    AJAXURL = '<?php echo admin_url("admin-ajax.php") ?>';
    SITEURL = '<?php echo site_url() ?>';
    THEMEURL = '<?php echo get_template_directory_uri()?>';

    <?php if(is_multisite()){?>
        IS_STANDALONE_SITE = false
    <? }
    else { ?>
        IS_STANDALONE_SITE = true
    <?php }?>

    <?=getLoggedInUserModel()?>

    CLASS_LABEL = {};
    <?php foreach($class_ids as $class){ ?>
    CLASS_LABEL[<?php echo $class['id']?>] = '<?php echo $class['label']?>';
    <?php } ?>

    CHORUS_OPTIONS = {};
    <?php foreach($chorus_options as $key=>$value){ ?>
    CHORUS_OPTIONS['<?php echo $key?>'] = '<?php echo $value?>';
    <?php } ?>

</script>


               <!-- <div class="card">
                    <button class="page-trans">

                    </button>
                    <div class="card__content">
                        CLOSE ME
                    </div>
                    one
                </div> -->
                <!-- jQuery -->
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/jquery-1.11.3.min.js"></script>
                <!-- Bootstrap Core JavaScript -->
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/bootstrap.min.js"></script>
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/script.js"></script>
                <script src="<?php echo STUDENT_ASSET_PATH ;?>js/scrollReveal.js"></script>

                <script>

            //     $(function(){
            //     $(".page-trans1").on('click', function(e){
            //         e.preventDefault();
            //     $('.card1').toggleClass('overflow-h');
            //     $(this).find('img').delay(2000).toggleClass('visibility');
            //     $(this).toggleClass('f');
            //     // $(this).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().toggleClass("is-expandend");
            //     $('body').find('.card1').toggleClass('is-expandend');
            //     $("body").toggleClass("is-expandend");
            //     var $rows = $('.scroll-bar , .mCustomScrollBox , .mCSB_container');
            //     setTimeout(function() {
            //         $rows.toggleClass('kill-overflow');
            //     }, 200);
            //     });
            // });
                </script>
         
            </body>
        </html>