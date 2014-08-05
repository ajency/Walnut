/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';

	// config.extraPlugins = 'confighelper';
	// config.extraPlugins = 'justify';
// 
	config.placeholder = 'Type here...';


	config.floatSpaceDockedOffsetX = 30;
	config.floatSpaceDockedOffsetY = 15;


    config.toolbar = [
					// # 			# { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates' ] },
                        {name: 'clipboard',
                        groups: [ 'clipboard', 'undo' ],
                        items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ]}
                    ,
                        {name: 'editing',
                        groups: [ 'find', 'selection', 'spellchecker' ],
                        items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] }
					,
						'/'
                    ,
                        {name: 'basicstyles',
                        groups: [ 'basicstyles', 'cleanup' ,'align'],
                        items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-','RemoveFormat']}

                    ,
                        {name: 'paragraph',
                        groups: [ 'list', 'indent', 'blocks','align' ],
                    items: [
                        // 'NumberedList', 'BulletedList', '-',
                        // 'Outdent', 'Indent', '-',
                        // 'Blockquote',  '-',
                        'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock']}

                    ,
            // # 			# { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                        {name: 'insert',
                        items: [ 'SpecialChar', 'EqnEditor' ]}
                    ,
                        '/'
                    ,
                        {name: 'styles',
                        items: [ 'Styles',  'Font', 'FontSize' ] }
                    ,
                        {name: 'colors',
                        items: [ 'TextColor', 'BGColor' ] }
            // # 			# { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
            // # 			# { name: 'others', items: [ '-' ] },
            // # 			# { name: 'about', items: [ 'About' ] }
                    ]



    config.font_names = config.font_names+' ;Chelsea Market; Indie Flower; Just Another Hand; Sacramento'
    config.fontSize_defaultLabel = '22';
};


