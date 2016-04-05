<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'synapselearning');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');
define('WP_MEMORY_LIMIT', '64M');
/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '@*~)ED|!qa&P=INXjTO)8MXidEAHqrPO]I|d<H!rHVUU^M+*h[1o&Kk80FvZES 7');
define('SECURE_AUTH_KEY',  '8:x&dx%7jO#Ig*L@gi$+5%i%%JOO|NFd|Y|PF2%#%FJHk|Uc6[y35]=xIXd=+-Rw');
define('LOGGED_IN_KEY',    'lPQy4VWU%V|0j,-kP=?2V|L5Rn%b ]}|xr5yo2eh6GN!)81G3 :nMIlij-exBQfx');
define('NONCE_KEY',        'v2Xf`5fL*}XAQH[@0>m-|#+yRaF,@FsUWG$<2+-&L%A I`;>0A<l3VL<(q0x!TJp');
define('AUTH_SALT',        '#h)>xV`HF$>+d;4K kHjPk4lTpCmlabkQQ&6N~#>I3!#A:Js7+$3KnL.B:k$G.52');
define('SECURE_AUTH_SALT', '4Vr4{p&[|^$_=+p|K+pYK8IV$9hHv9@f(&H{|vVQ+}5@aTlmSX1eGv!6!wSo8`VS');
define('LOGGED_IN_SALT',   '}S#_:(5|%?Ij`&Z|{9[DtgRRK,`![>#n]#NOBiGl0j;o#zE9Ms0CiU!mw[<3gHqH');
define('NONCE_SALT',       '^%$N}|<VrA7tc>j`5fdl[VA1+<crP+4dI>(53444zS[(mwpW.GKHuuGQluhS4X,R');





/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 *
 */

/*
Test comments
sfds fds
fds
fds

 */

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */

define('ENV','dev');
define( 'WP_ALLOW_MULTISITE', true );

define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', true);
define('DOMAIN_CURRENT_SITE', 'synapselearning.dev');
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);

 // Enable WP_DEBUG mode
define('WP_DEBUG', true);

// Enable Debug logging to the /wp-content/debug.log file
define('WP_DEBUG_LOG', true);

// Disable display of errors and warnings
define('WP_DEBUG_DISPLAY', false);

// Use dev versions of core JS and CSS files (only needed if you are modifying these core files)
define('SCRIPT_DEBUG', true);

define('VERSION','2.0');
define('DEV_VERSION',time());
/* That's all, stop editing! Happy blogging. */






define( 'COOKIEHASH', md5( 'synapselearning.dev' ) );
define( 'COOKIE_DOMAIN', 'synapselearning.dev' );
define( 'ADMIN_COOKIE_PATH', '/' );
define( 'COOKIEPATH', '/' );
define( 'SITECOOKIEPATH', '/' );
define( 'TEST_COOKIE', 'thing_test_cookie' );
define( 'AUTH_COOKIE', 'thing_' . COOKIEHASH );
define( 'USER_COOKIE', 'thing_user_' . COOKIEHASH );
define( 'PASS_COOKIE', 'thing_pass_' . COOKIEHASH );
define( 'SECURE_AUTH_COOKIE', 'thing_sec_' . COOKIEHASH );
define( 'LOGGED_IN_COOKIE', 'thing_logged_in' . COOKIEHASH );




//define('COOKIE_DOMAIN', false);

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
