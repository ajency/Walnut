/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;address;div';

	config.extraPlugins = 'confighelper';

	config.placeholder = 'Type here...'
};
