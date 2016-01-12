jQuery(document).ready(function($) {
  $('#add-new-site').next().find('table tbody').append('<tr class="form-field form-required"> <th scope="row">Additional Admins</th> <td><input name="blog_additional[admins]" type="text" class="regular-text" title="Additional Admins"/></td> </tr> <tr class="form-field form-required"> <th scope="row">Address</th> <td><input name="blog_additional[address]" type="text" class="regular-text" title="Address"/></td> </tr> <tr class="form-field form-required"> <th scope="row">City</th> <td><input name="blog_additional[city]" type="text" class="regular-text" title="City"/></td> </tr> <tr class="form-field form-required"> <th scope="row">State</th> <td><input name="blog_additional[state]" type="text" class="regular-text" title="State"/></td> </tr> <tr class="form-field form-required"> <th scope="row">Zip Code</th> <td><input name="blog_additional[zipcode]" type="text" class="regular-text" title="Zip Code"/></td> </tr> <tr class="form-field form-required"> <th scope="row">Contact Number</th> <td><input name="blog_additional[contact_no]" type="text" class="regular-text" title="Contact Number"/></td> </tr> <tr class="form-field form-required"> <th scope="row">Licency Number</th> <td><input name="blog_additional[licence_no]" type="text" class="regular-text" title="Licency Number"/></td> </tr> <tr class="form-field form-required"> <th scope="row">Valid From <span style="color:#ff0000; font-size:11px; font-style:italic">(required)</span></th> <td><input id="validfrom" name="blog_additional[validfrom]" type="text" class="regular-text date-field" title="Valid From"/></td> </tr> <tr class="form-field form-required"> <th scope="row">Valid To <span style="color:#ff0000; font-size:11px; font-style:italic">(required</span></th> <td><input id="validto" name="blog_additional[validto]" type="text" class="regular-text date-field" title="Valid To"/></td> </tr> <tr class="form-field form-required"> <th scope="row">No. of Quizzes</th> <td><input name="blog_additional[no_of_quizzes]" type="text" class="regular-text" title="No. of Quizzes"/></td> </tr> <tr class="form-field form-required"> <th scope="row">Individual Server Authentication</th> <td><input name="blog_additional[server_authentication]" type="text" class="regular-text" title="Individual Server Authentication"/></td> </tr>');
  $('.date-field').datepicker({
    dateFormat: 'dd-mm-yy'
  });
  $('#validfrom').change(function() {
    var mindate;
    mindate = $('#validfrom').val();
    $('#validto').val('');
    return $('#validto').datepicker('option', 'minDate', mindate);
  });
  return $('#add-site').closest('form').submit(function(e) {
    if (($('#validfrom').val() === '') || ($('#validto').val() === '')) {
      return false;
    }
  });
});
