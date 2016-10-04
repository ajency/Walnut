<?php
/*
  Template Name: Quiz Listview Student
 */
?>
<?php
	get_header('student');
?>
<?php
$textbook_id = $_GET['textbook_id'];
$textbook    = get_book($textbook_id);
$chapters    = student_fetch_chapters($textbook_id);
$quizzes     = student_fetch_quizzes_by_textbook_id($textbook_id);

$chapter_id_to_name_map = array();
foreach ($chapters['data'] as $key => $value) {
    $chapter_id_to_name_map[$value->term_id] = $value->name;
}

?>
<h3 id="dynamic_filter"></h3>
<input type="hidden" id="filter_status"/>
<input type="hidden" id="filter_type"/>
<input type="hidden" id="filter_chapter"/>
<div class="container-fluid walnut-content">
    <!-- Welcome text -->
    <div class="row text-center">
        <section class="col-sm-9 col-md-9 col-lg-9 quiz-subj lecture-data">
            <div class="row">
                <div class="col-md-12 col-lg-12">
                    <div class="direction text-center">
                        <div class="icon"><a href="<?php echo get_site_url();?>/dashboard-student" class="btn fab-content"><i class="fa fa-hand-o-left"></i></a></div>
                        <p class="welcome-text">You're on <a href="javascript:"><?php echo $textbook->name ?></a> quiz listing</p>
                    </div>
                </div>
            </div>
            <!-- All Lectures -->
            <h4 class="text-danger" id="danger" style="display:<?php echo count($quizzes)>0?'none':'block'; ?>">There is no quiz for this filter, select other filter for quiz listings.</h4>
            <div class="row">
                <?php foreach($quizzes as $key => $quiz): ?>
                <div class="col-sm-6 col-md-6 col-lg-6 quiz_tiles <?php echo "S".$quiz['status'] ?> <?php echo "T".$quiz['quiz_type'] ?> <?php echo "C".$quiz['chapter_id'] ?>">
                    <div class="l-q-cards animated bounceIn">
                        <div class="l-q-cards__title">
                            <div class="lecture">
                                <span>Quiz :</span>
                                <span><?php echo $quiz['quiz_name'] ?></span>
                            </div>
                            <div class="chapter">
                                <span>Chapter :</span>
                                <span><?php echo $chapter_id_to_name_map[$quiz['chapter_id']] ?></span>
                            </div>
                                                        <div class="last-seen">
                                                        <?php if($quiz['taken_on']!='NA'): ?>
                                                        <div>
                                                            <span>Taken On :</span>
                                                            <span><?php echo $quiz['taken_on'] ?></span>
                                                        </div>
                                                        <div>
                                                            <span>Marks Obtained :</span>
                                                            <span><?php echo $quiz['total_marks_scored'] ?></span>
                                                        </div>
                                                        <?php endif; ?>
                                                        <?php if($quiz['taken_on']=='NA'): ?>
                                            
                                                            <span>Not Yet Taken</span>
                                             
                                                        <?php endif; ?>                                                
                                                        </div>                               
                            <div class="view">
                                <a href="<?php echo get_site_url();?>/#students/dashboard/textbook/<?php echo $quiz['chapter_id'] ?>/quiz/<?php echo $quiz['quiz_id'] ?>"><img src="<?php echo STUDENT_ASSET_PATH ;?>images/view.png" class="img-responsive center-block">
                                </a>
                            </div>
                        </div>
                        <div class="l-q-cards__details">
                            <div class="timing">
                                <span><i class="fa fa-clock-o"></i></span>
                                <span class="total-time"><?php echo $quiz['duration'] ?> MINS</span>
                            </div>
                            <div class="attempts">
                                <span><?php echo $quiz['attempts'] ?></span>
                                <span>Attempt<?php echo $quiz['attempts']== 1 ? "" : "s"; ?></span>
                            </div>
                        </div>                        
                    </div>
                </div>  
                <?php endforeach; ?>              
            </div>
        </section>


        <!-- Filters for chapters -->
        <aside class="col-sm-3 col-md-3 col-lg-3 sidebar spacing">
            <div class="panel-group sidebar-panel" id="accordion_1" role="tablist" aria-multiselectable="true">
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingOne">
                        <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        All Status
                        <span class="drop-icon pull-right">
                        <i class="fa fa-angle-right fa-lg"></i>
                        </span>
                        </a>
                        </h4>
                    </div>
                    <div id="collapseOne" class="panel-collapse collapse tick" role="tabpanel" aria-labelledby="headingOne">
                        <?php $statuses = array('In Progress', 'Not Started', 'Completed'); ?>
                        <?php foreach ($statuses as $key => $status):?>
                        <div class="panel-body statuses" id="<?php echo "status_".$key ?>">
                            <div class="chapter-names">
                                <?php echo $status ?>                                
                            </div>
                            <div class="checked">
                                <i class="fa fa-check"></i>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <div class="panel-group sidebar-panel" id="accordion_2" role="tablist" aria-multiselectable="true">
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingOne">
                        <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseOne">
                        All Types
                        <span class="drop-icon pull-right">
                        <i class="fa fa-angle-right fa-lg"></i>
                        </span>
                        </a>
                        </h4>
                    </div>
                    <div id="collapseTwo" class="panel-collapse collapse tick" role="tabpanel" aria-labelledby="headingOne">
                        <?php $types = array('Practice Quiz', 'Take at Home', 'Class Test'); ?>
                        <?php foreach ($types as $key => $type):?>
                        <div class="panel-body types" id="<?php echo "type_".$key ?>">
                            <div class="chapter-names">
                                <?php echo $type ?>                                
                            </div>
                            <div class="checked">
                                <i class="fa fa-check"></i>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <div class="panel-group sidebar-panel" id="accordion_3" role="tablist" aria-multiselectable="true">
                <div class="panel panel-default">
                    <div class="panel-heading" role="tab" id="headingOne">
                        <h4 class="panel-title">
                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="true" aria-controls="collapseOne">
                        All Chapters
                        <span class="drop-icon pull-right">
                        <i class="fa fa-angle-right fa-lg is-open"></i>
                        </span>
                        </a>
                        </h4>
                    </div>
                    <div id="collapseThree" class="panel-collapse collapse in tick" role="tabpanel" aria-labelledby="headingOne">
                    	<?php foreach ($chapters['data'] as $key => $chapter):?>
                        <div class="panel-body chapters" id="<?php echo "chapter_".$chapter->term_id ?>">
                            <div class="chapter-names">
                                <?php echo $chapter->name ?>                                
                            </div>
                            <div class="checked">
                                <i class="fa fa-check"></i>
                            </div>
                        </div>
                    	<?php endforeach; ?>
                    </div>
                </div>
            </div>
        </aside>
    </div>
</div>
<?php
	get_footer('student');
?>
<script type="text/javascript">
var textbook_id = '<?php echo $textbook_id ?>';

$(document).ready(function(){
   localStorage.textbook_id = textbook_id;

   $(".statuses").click(function(){
        var show_class = this.id;
        var is_checked = ($("#"+show_class +" div").hasClass('is-checked'));
        var id = show_class.split("_");
            id = id[1];
        if(is_checked){
            $("#filter_status").val("S"+id);
        }else{
            $("#filter_status").val("");
        }
        filter_it();
   });

   $(".types").click(function(){
        var show_class = this.id;
        var is_checked = ($("#"+show_class +" div").hasClass('is-checked'));
        var id = show_class.split("_");
            id = id[1];
        if(is_checked){
            $("#filter_type").val("T"+id);
        }else{
            $("#filter_type").val("");
        }
        filter_it();
   });

   $(".chapters").click(function(){
        var show_class = this.id;
        var is_checked = ($("#"+show_class +" div").hasClass('is-checked'));
        var id = show_class.split("_");
            id = id[1];
        if(is_checked){
            $("#filter_chapter").val("C"+id);
        }else{
            $("#filter_chapter").val("");
        }
        filter_it();
   });
});   
function filter_it(){
    var cl_1 = $("#filter_status").val();
    var cl_2 = $("#filter_type").val();
    var cl_3 = $("#filter_chapter").val();
    var tmp = [];
    if(cl_1!='')
        tmp.push(cl_1);
    if(cl_2!='')
        tmp.push(cl_2);
    if(cl_3!='')
        tmp.push(cl_3);            
 
    console.log(tmp);
     
    $( ".quiz_tiles" ).each(function( index ) {
        var flag = 0;
        for(var i=0; i<tmp.length;i++){
            if(!$(this).hasClass(tmp[i])){
                flag = 1;
            }
        }
        if(flag == 0){
            $(this).show();
        }else{
            $(this).hide();
        }
    });   

        var no_items = true;
        $( ".quiz_tiles" ).each(function( index ) {
            if( $(this).css("display")!='none' ){
                no_items = false;
            }
        });
        $("#danger").hide();
        if(no_items==true){
            $("#danger").show();
        }

    $("html, body").animate({ scrollTop: 0 }, "slow");
} 
</script>
