<?php
/**
 * Represents the view for the administration tools menu upload interface step 1
 *
 * The User Interface to the end user.
 *
 * @package   csv-import
 * @author    Team Ajency <talktous@ajency.in>
 * @license   GPL-2.0+
 * @link      http://ajency.in
 * @copyright 9-22-2014 Ajency.in
 */
global $ajci_components;

?>
        <form method="post" enctype="multipart/form-data">
            <table>
            <tr>
            <td>
            <label>Component: 
            </label></td>	
            <td>
                <select  name='csv_component' id='csv_component'/>
                
                <?php 
                foreach ($ajci_components as $key=>$value){  ?>
                    <option value="<?php echo $key  ?>"><?php echo $key ?></option>
                <?php } ?>
                </select>
            </td>
            </tr>
            <tr>
            <td><label>Select Textbook: </label></td>
            <td>
                <?php
                    $textbooks = $textbook = $texts = array();
                    $texts = text_data();
                 ?>
                <select name="textbook_list" id="textbook_list">
                    <option value='-1' id="select">--Select Textbook--</option>
                    <?php foreach ($texts['data'] as $textbook): ?>
                        <option value="<?php echo $textbook->term_id; ?>"><?php echo $textbook->name; ?></option>
                    <?php endforeach ?>
                </select>
                <input type="hidden" id="hiddenTextId" value="-1" />
            </td>
            </tr>
            <tr ><td></td>
                <td><div id="invalidText" style="color: red;"></div></td>
            </tr> 
            <tr>
            <td>Export Template excel</td>
            <td><button name="export" id="template_export" type="button">Export</button></td>
            </tr>                 
            <tr>
            <td>
            <label>Upload a file: 
            </label></td>	
            <td>
            <input type="file"
            name="csv_file" />
            <span>File type(.csv)</span>
            </td>
            </tr>
            </table>
            <input type='hidden' name='import_step' id='import_step' value='1' />
            <!--input type='hidden' name='csv_component' id='csv_component' value='pincodes' /-->
            <input type="submit"
            name="submit"
            value="Upload" /> 
        </form>
