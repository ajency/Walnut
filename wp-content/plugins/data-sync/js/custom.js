

jQuery(document).ready(function() {


  jQuery("#vsync-data").on('click',function(){

    //jQuery("#upsyncstatus").empty();
    jQuery("#downsyncstatus").empty();

    //jQuery("#upsyncstatus").append('<h3>Up-Sync</h3>');
    jQuery("#downsyncstatus").append('<h3>Down-Sync</h3>');

    //initiate_up_sync();

    initiate_down_sync()
    .then(generate_terms)
    .then(generate_term_relationships)
    .then(generate_term_taxonomy)
    .then(generate_textbook_relationships)
    .then(generate_class_divisions)
    .then(generate_quiz_schedules)
    .then(generate_question_response)
    .then(generate_question_response_meta)
    .then(generate_quiz_question_response)
    .then(generate_quiz_response_summary)
    .then(generate_content_collection)
    .then(generate_collection_meta)
    .then(generate_posts)
    .then(generate_postmeta)
    .then(generate_users)
    .then(generate_usermeta)
    .then(generate_options)

    .then(download_terms)
    .then(download_term_relationships)
    .then(download_term_taxonomy)
    .then(download_textbook_relationships)
    .then(download_class_divisions)
    .then(download_quiz_schedules)
    .then(download_question_response)
    .then(download_question_response_meta)
    .then(download_quiz_question_response)
    .then(download_quiz_response_summary)
    .then(download_content_collection)
    .then(download_collection_meta)
    .then(download_posts)
    .then(download_postmeta)
    .then(download_users)
    .then(download_usermeta)
    .then(download_options)

    .then(extract_data)
    .then(import_downloaded_data)
    .then(complete_sync_process);
  });





jQuery("#usync-data").on('click',function(){
    jQuery("#upsyncstatus").empty();
    jQuery("#upsyncstatus").append('<h3>Up-Sync</h3>');

    initiate_up_sync()
    .then(generate_upsync_question_response)
    .then(generate_upsync_question_response_meta)
    .then(generate_upsync_quiz_question_response)
    .then(generate_upsync_quiz_response_summary)
    .then(generate_upsync_quiz_schedules)
    .then(upload_upsync_question_response)
    .then(upload_upsync_question_response_meta)
    .then(upload_upsync_quiz_question_response)
    .then(upload_upsync_quiz_response_summary)
    .then(upload_upsync_quiz_schedules)
    .then(extract_upsync_data)
    .then(import_upsync_data)
    .then(complete_upsync_process);

});






jQuery.ajaxSetup({
  type: 'GET',
  dataType: "jsonp",
  delay: 1,
  cache: false,
  crossDomain: true
});





// Starting Upsync
function initiate_up_sync() {
  jQuery("#usync-data").attr('disabled', 'disabled');
  writeProgressMessageUpsync("Initiating upsync process ","initiate");
  return jQuery.ajax({
        url: ajaxurl+'?action=upsync_initiate',
    });
}

function generate_upsync_question_response(promiseResult) {
  var table = 'question_response';
  writeProgressMessageUpsync("Generating <span class='curreentugtable'></span> <span class='generateustatus'></span> ","generating");
  jQuery(".generating").prev().addClass('done');
  jQuery(".generateustatus").text('(1/5)');
    jQuery(".curreentugtable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_generate&table='+table,
    });
}

function generate_upsync_question_response_meta(promiseResult) {
  var table = 'question_response_meta';
  jQuery(".generateustatus").text('(2/5)');
    jQuery(".curreentugtable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_generate&table='+table+'&path='+promiseResult.path,
    });
}

function generate_upsync_quiz_question_response(promiseResult) {
  var table = 'quiz_question_response';
  jQuery(".generateustatus").text('(3/5)');
    jQuery(".curreentugtable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_generate&table='+table+'&path='+promiseResult.path,
    });
}

function generate_upsync_quiz_response_summary(promiseResult) {
  var table = 'quiz_response_summary';
  jQuery(".generateustatus").text('(4/5)');
    jQuery(".curreentugtable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_generate&table='+table+'&path='+promiseResult.path,
    });
}

function generate_upsync_quiz_schedules(promiseResult) {
  var table = 'quiz_schedules';
  jQuery(".generateustatus").text('(5/5)');
    jQuery(".curreentugtable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_generate&table='+table+'&path='+promiseResult.path,
    });
}


function upload_upsync_question_response(promiseResult) {
  jQuery(".generateustatus").empty();
  jQuery(".curreentugtable").text('data');
  var table = 'question_response';
  writeProgressMessageUpsync("Uploading <span class='curreentutable'></span> <span class='uploadstatus'></span> ","uploading");
  jQuery(".uploading").prev().addClass('done');
  jQuery(".uploadstatus").text('(1/5)');
    jQuery(".curreentutable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_upload&table='+table+'&path='+promiseResult.path,
    });
}


function upload_upsync_question_response_meta(promiseResult) {
  var table = 'question_response_meta';
  jQuery(".uploadstatus").text('(2/5)');
    jQuery(".curreentutable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_upload&table='+table+'&path='+promiseResult.path,
    });
}

function upload_upsync_quiz_question_response(promiseResult) {
  var table = 'quiz_question_response';
  jQuery(".uploadstatus").text('(3/5)');
    jQuery(".curreentutable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_upload&table='+table+'&path='+promiseResult.path,
    });
}


function upload_upsync_quiz_response_summary(promiseResult) {
  var table = 'quiz_response_summary';
  jQuery(".uploadstatus").text('(4/5)');
    jQuery(".curreentutable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_upload&table='+table+'&path='+promiseResult.path,
    });
}

function upload_upsync_quiz_schedules(promiseResult) {
  var table = 'quiz_schedules';
  jQuery(".uploadstatus").text('(5/5)');
    jQuery(".curreentutable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=upsync_upload&table='+table+'&path='+promiseResult.path+'&last_table=yes',
    });
}


function extract_upsync_data(promiseResult) {
  jQuery(".uploadstatus").empty();
  jQuery(".curreentutable").text('data');
  var current = 'extract';
    writeProgressMessageUpsync("Extracting data ",current);
    jQuery("." + current).prev().addClass('done');
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=upsync_extract_data&folder_id='+promiseResult.folder_id,
    });
}

function import_upsync_data(promiseResult) {
  var current = 'import_data';
    writeProgressMessageUpsync("Importing upsync data ",current);
    jQuery("." + current).prev().addClass('done');
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=import_uploaded_data&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}


function complete_upsync_process(promiseResult) {
  var current = 'sync_complete';
    writeProgressMessageUpsync("Upsync process completed ",current);
    jQuery("." + current).prev().addClass('done');
    jQuery("." + current).css('background','none');
    jQuery("#usync-data").attr('disabled', false);
    jQuery("#upsyncstatus").append('<div><a class="button" href="'+promiseResult.log_url+'" target="_blank">Download Log</a></div>');
}


function writeProgressMessageUpsync(msg,msgact) {
    jQuery("#upsyncstatus").append("<div class='syncstat "+msgact+"'>"+msg + "</div>");
    console.log(msg);
}













// Starting Downsync
function initiate_down_sync() {
  jQuery("#vsync-data").attr('disabled', 'disabled');
  writeProgressMessage("Initiating downsync process ","initiate");
  return jQuery.ajax({
        url: ajaxurl+'?action=sync_initiate',
    });
}

function generate_terms(promiseResult) {
  var table = 'terms';
    writeProgressMessage("Generating <span class='curreentgtable'></span> <span class='generatestatus'></span> ","generating");
    jQuery(".generating").prev().addClass('done');
    jQuery(".generatestatus").text('(1/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table,
    });
}


function generate_term_relationships(promiseResult) {
  var table = 'term_relationships';
  jQuery(".generatestatus").text('(2/17)');
  jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path,
    });
}


function generate_term_taxonomy(promiseResult) {
  var table = 'term_taxonomy';
    jQuery(".generatestatus").text('(3/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path,
    });
}

function generate_textbook_relationships(promiseResult) {
  var table = 'textbook_relationships';
    jQuery(".generatestatus").text('(4/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path,
    });
}

function generate_class_divisions(promiseResult) {
  var table = 'class_divisions';
    jQuery(".generatestatus").text('(5/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}

function generate_quiz_schedules(promiseResult) {
  var table = 'quiz_schedules';
   jQuery(".generatestatus").text('(6/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}

function generate_question_response(promiseResult) {
  var table = 'question_response';
  jQuery(".generatestatus").text('(7/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}

function generate_question_response_meta(promiseResult) {
  var table = 'question_response_meta';
  jQuery(".generatestatus").text('(8/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}

function generate_quiz_question_response(promiseResult) {
  var table = 'quiz_question_response';
  jQuery(".generatestatus").text('(9/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}

function generate_quiz_response_summary(promiseResult) {
  var table = 'quiz_response_summary';
  jQuery(".generatestatus").text('(10/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}


function generate_content_collection(promiseResult) {
  var table = 'content_collection';
  jQuery(".generatestatus").text('(11/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path,
    });
}

function generate_collection_meta(promiseResult) {
  var table = 'collection_meta';
  jQuery(".generatestatus").text('(12/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path,
    });
}

function generate_posts(promiseResult) {
  var table = 'posts';
  jQuery(".generatestatus").text('(13/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&school='+SCHOOL_URL,
    });
}

function generate_postmeta(promiseResult) {
  var table = 'postmeta';
  jQuery(".generatestatus").text('(14/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&school='+SCHOOL_URL,
    });
}

function generate_users(promiseResult) {
  var table = 'users';
  jQuery(".generatestatus").text('(15/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}

function generate_usermeta(promiseResult) {
  var table = 'usermeta';
  jQuery(".generatestatus").text('(16/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}

function generate_options(promiseResult) {
  var table = 'options';
  jQuery(".generatestatus").text('(17/17)');
    jQuery(".curreentgtable").text(table);
    return jQuery.ajax({
        url: SERVER_AJAXURL+'?action=sync_generate&table='+table+'&path='+promiseResult.path+'&blog_id='+BLOG_ID,
    });
}









function download_terms(promiseResult) {
  jQuery(".generatestatus").empty();
  jQuery(".curreentgtable").text('data');
  var table = 'terms';
    writeProgressMessage("Downloading <span class='curreentdtable'></span> <span class='downstatus'></span>","downloading");
    jQuery(".downloading").prev().addClass('done');
    jQuery(".downstatus").text('(1/17)');
    jQuery(".curreentdtable").text(table);
    return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url,
    });
}


function download_term_relationships(promiseResult) {
  var table = 'term_relationships';
  jQuery(".downstatus").text(' (2/17)');
  jQuery(".curreentdtable").text(table);
     return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}


function download_term_taxonomy(promiseResult) {
  var table = 'term_taxonomy';
  jQuery(".downstatus").text(' (3/17)');
  jQuery(".curreentdtable").text(table);
        return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_textbook_relationships(promiseResult) {
  var table = 'textbook_relationships';
  jQuery(".downstatus").text(' (4/17)');
  jQuery(".curreentdtable").text(table);
        return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_class_divisions(promiseResult) {
  var table = 'class_divisions';
  jQuery(".downstatus").text(' (5/17)');
  jQuery(".curreentdtable").text(table);
        return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_quiz_schedules(promiseResult) {
  var table = 'quiz_schedules';
  jQuery(".downstatus").text(' (6/17)');
  jQuery(".curreentdtable").text(table);
        return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_question_response(promiseResult) {
  var table = 'question_response';
  jQuery(".downstatus").text(' (7/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_question_response_meta(promiseResult) {
  var table = 'question_response_meta';
  jQuery(".downstatus").text(' (8/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_quiz_question_response(promiseResult) {
  var table = 'quiz_question_response';
  jQuery(".downstatus").text(' (9/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_quiz_response_summary(promiseResult) {
  var table = 'quiz_response_summary';
  jQuery(".downstatus").text(' (10/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}


function download_content_collection(promiseResult) {
  var table = 'content_collection';
  jQuery(".downstatus").text(' (11/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_collection_meta(promiseResult) {
  var table = 'collection_meta';
  jQuery(".downstatus").text(' (12/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_posts(promiseResult) {
  var table = 'posts';
  jQuery(".downstatus").text(' (13/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_postmeta(promiseResult) {
  var table = 'postmeta';
  jQuery(".downstatus").text(' (14/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_users(promiseResult) {
  var table = 'users';
  jQuery(".downstatus").text(' (15/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_usermeta(promiseResult) {
  var table = 'usermeta';
  jQuery(".downstatus").text(' (16/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}

function download_options(promiseResult) {
  var table = 'options';
  jQuery(".downstatus").text(' (17/17)');
  jQuery(".curreentdtable").text(table);
      return jQuery.ajax({
        url: ajaxurl+'?action=download_tables&table='+table+'&url='+promiseResult.url+'&local_path='+promiseResult.localpath,
    });
}









function extract_data(promiseResult) {
  jQuery(".downstatus").empty();
  jQuery(".curreentdtable").text('data');
  var current = 'extract';
    writeProgressMessage("Extracting data ",current);
    jQuery("." + current).prev().addClass('done');
    return jQuery.ajax({
        url: ajaxurl+'?action=sync_extract_data&local_path='+promiseResult.localpath,
    });
}

function import_downloaded_data(promiseResult) {
  var current = 'import_data';
    writeProgressMessage("Applying changes ",current);
    jQuery("." + current).prev().addClass('done');
    return jQuery.ajax({
        url: ajaxurl+'?action=sync_import_backup&local_path='+promiseResult.localpath,
    });
}


function complete_sync_process(promiseResult) {
  var current = 'sync_complete';
    writeProgressMessage("Update process completed ",current);
    jQuery("." + current).prev().addClass('done');
    jQuery("." + current).css('background','none');
    jQuery("#vsync-data").attr('disabled', false);
}



function writeProgressMessage(msg,msgact) {
    jQuery("#downsyncstatus").append("<div class='syncstat "+msgact+"'>"+msg + "</div>");
    console.log(msg);
}









jQuery("#testsync-data").on('click',function(){
var syncresponse = jQuery.ajax({
        url: ajaxurl+'?action=test_upsync_import',
    });
console.log(syncresponse);
})








});
