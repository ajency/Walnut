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
define('DB_NAME', 'walnut');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', '127.0.0.1');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'O7 V1S}~jN+o+;n4AAU/K)7AY^l$]n0z{ 2#h+]_Wuq;ZpL<.WLeB!gI1tqH?4[G');
define('SECURE_AUTH_KEY',  'Vg sQTCCYFHhxYF7i=8~:Uq<Ki5Xo@oJSzl9r6r,tjnRvMDnM?E-X,PTck>@#6lW');
define('LOGGED_IN_KEY',    'lJjH#e4l>wX<:e/8yzW.>(E#uZ})>AZu93z]u;=w9z=Z3 Phh+)tN<A--C+Q$521');
define('NONCE_KEY',        'NKCJ+Z;XBiz6XZLUiPF]XRNhW0z.dyG/jv (Kb[]xZ+2:xEC5X!y}~1`Qf})lt:K');
define('AUTH_SALT',        '3/Pxf=net6)^Vi5S3?%qqB]S`5oep.!;1;W3USe4^KV+%e(4-4r5:o*.zC01#|$<');
define('SECURE_AUTH_SALT', ']HG^F2=5aV+J]U<0VTxvt()aMzdwe^vY9^QkR{v}Me>`75j2wnkBW2{1Z[l}MrtA');
define('LOGGED_IN_SALT',   '0jR7u%No+nD0_NI$y;|-QO(8|-h5YsCzgwNzsRXqo$!MHyGWLrRkTg8`s?`x>Enp');
define('NONCE_SALT',       'LZozHEm&k+Ik6Yk4.=UWlfu@1m>DNrX{TN<i$Rld2BO:,W ~|BcQ-AtbF]~^r o0');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';
define( 'WP_ALLOW_MULTISITE', true );
/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

define('ENV','dist');
define('VERSION', '1.01');

define('DEV_VERSION', date('dmyhis'));

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */

define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false);
define('DOMAIN_CURRENT_SITE', 'localhost');
define('PATH_CURRENT_SITE', '/walnutStudent/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);

define('WP_DEBUG', false);



/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
