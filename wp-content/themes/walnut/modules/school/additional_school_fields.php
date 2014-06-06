<?php
    $blog_dets = get_blog_option($blog_id, 'blog_meta','');
    $blog_dets=  maybe_unserialize($blog_dets);
        ?>
        <tr class="form-field form-required">
            <th scope="row">Additional Admins</th>
            <td><input name="blog_additional[admins]" type="text" value="<?=$blog_dets['admins']?>" 
                       class="regular-text" title="Additional Admins"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">Address</th>
            <td><input name="blog_additional[address]" type="text" value="<?=$blog_dets['address']?>" 
                       class="regular-text" title="Address"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">City</th>
            <td><input name="blog_additional[city]" type="text" value="<?=$blog_dets['city']?>" 
                       class="regular-text" title="City"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">State</th>
            <td><input name="blog_additional[state]" type="text" value="<?=$blog_dets['state']?>" 
                       class="regular-text" title="State"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">Zip Code</th>
            <td><input name="blog_additional[zipcode]" type="text" value="<?=$blog_dets['zipcode']?>" 
                       class="regular-text" title="Zip Code"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">Contact Number</th>
            <td><input name="blog_additional[contact_no]" type="text" value="<?=$blog_dets['contact_no']?>" 
                       class="regular-text" title="Contact Number"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">Licency Number</th>
            <td><input name="blog_additional[licence_no]" type="text" value="<?=$blog_dets['licence_no']?>" 
                       class="regular-text" title="Licency Number"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">Valid From <span style="color:#ff0000; font-size:11px; font-style:italic">(required)</span></th>
            <td><input id="validfrom" name="blog_additional[validfrom]" type="text" value="<?=$blog_dets['validfrom']?>" 
                       class="regular-text date-field" title="Valid From"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">Valid To <span style="color:#ff0000; font-size:11px; font-style:italic">(required)</span></th>
            <td><input id="validto" name="blog_additional[validto]" type="text" value="<?=$blog_dets['validto']?>" 
                       class="regular-text date-field" title="Valid To"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">No. of Quizzes</th>
            <td><input name="blog_additional[no_of_quizzes]" type="text" value="<?=$blog_dets['no_of_quizzes']?>" 
                       class="regular-text" title="No. of Quizzes"/></td>
        </tr>
        <tr class="form-field form-required">
            <th scope="row">Individual Server Authentication</th>
            <td><input name="blog_additional[server_authentication]" type="text" 
                       value="<?=$blog_dets['server_authentication']?>" value="testest" 
                       class="regular-text" title="Individual Server Authentication"/></td>
        </tr>