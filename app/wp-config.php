<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wp-local-repos');

/** MySQL database username */
define('DB_USER', 'maiteth');

/** MySQL database password */
define('DB_PASSWORD', '1234');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

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
define('AUTH_KEY',         '1HfI]X`VA|ebDyM`_S7W3WKr+<s}o6,:ILY;Ky>lHx+5V01TSCD1)D4]+.NEQVq*');
define('SECURE_AUTH_KEY',  'x|.pJv/odVMsW*} f0A,h_prxBUcSiqPrpAMRM7>fNbv/v0di}WlJOqZ4rzSgXH&');
define('LOGGED_IN_KEY',    '[T;~;MR?oZlW2zy@^($R.gX cW?j_d7q~R!Z6CX1dseKjVMX~T{MJM>q|8=y78h~');
define('NONCE_KEY',        '`lN{-s}5 re,KOLl[8mQj83;t)Fv|-naE =!iW>lXo1_FjW<kC-7un9}/mt3DUa{');
define('AUTH_SALT',        '_pq{.|FzCBJhM&1?Q--,%?FCTHJ12>~fPM0fnp#bxurl^K$BN.Tfgil<<eVLd~]k');
define('SECURE_AUTH_SALT', '.`i>EH+F<3;<1y$Q|fka*MDF9|_8YGGw*|U}2ms%OpL(#w<A8>9#9O|:)v7AsF1/');
define('LOGGED_IN_SALT',   'ZDJ`)%nyJ!+*YkDh2g`FdO|Y_Wz0mK$1x7a7/,<KF-_DiOBdxH*n}H| Nrw3^HCo');
define('NONCE_SALT',       'Siho}uMj8dy>VE4S$[*I}*)T[I{(;ULU~Ep>^W}X_Mv_8~-p6XKhU1JAN,E;[(15');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
