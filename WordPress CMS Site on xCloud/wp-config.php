<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'db1_cms_proswppp' );

/** Database username */
define( 'DB_USER', 'u1_cms_proswppp' );

/** Database password */
define( 'DB_PASSWORD', 'SjZZCSFYwbTFl5ui' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'PBi{I@m[UYuZ?ZH s{T`:<J1@+uepQ7WlF^Fqc1dOeuM(bFDe?d$:E%dZ=IzQ&w&' );
define( 'SECURE_AUTH_KEY',   'a7>Yi&I)7FCWASyFf||6zKg3ekDb3y5Sz&N8/84hDa_@JmA,JH(;VN!e_ogP([Sr' );
define( 'LOGGED_IN_KEY',     'VELdFLr3:%8O^/O`f{W(0Dp_67Xvbg8C}%RMTWZjKs/wZ=GUQ`RM3@t,AO-8aN3>' );
define( 'NONCE_KEY',         'FW#F?o^+iU-veNLwY`5;Tt%FiRTQm+E2:mcX^7GZ%D>oL><jh=A5 Kx7HhPOMm,4' );
define( 'AUTH_SALT',         'mdSsTV3I8v5fg)O^Z}}lo.nfnAl H yXUftA_I~SN{<]b>,c4,K[/dkj*~F(=K3Q' );
define( 'SECURE_AUTH_SALT',  '<{|$&W*8_^t$xG>F;zkj V]<.0[+h3)cvXJ(rzQISt<z;y&(1MbVj%v$_--W+^;/' );
define( 'LOGGED_IN_SALT',    '?7T:Rixbh>SFy+$7u`8_KwWm[2fWZjyjF:|?nb,5qd!w _C.P9j]oyoyt/HshCuk' );
define( 'NONCE_SALT',        'LXV:3;4Gc.pjK)hP2UM|*iDQ:b!7fI);{k#^igtG7[ }b/dKcM%8d3_zO}[)[9)u' );
define( 'WP_CACHE_KEY_SALT', '<P Sb+mKq 0?Yv2wFCO84oolv_].W<*g-3.pm`QWv0:m-Vv.AzbUN{HcA9Q^A10V' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'dihf_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'WP_DEBUG_DISPLAY', false );
}

define( 'RT_WP_NGINX_HELPER_CACHE_PATH', '/etc/nginx/cache/cms.proswppp.com' );
define( 'WP_REDIS_PASSWORD', ["u1_cms_proswppp", "btsRqAWjF4N8434WDfjhlRgGklSZKZSA"] );
define( 'WP_REDIS_DISABLE_BANNERS', 'true' );
define( 'WP_REDIS_PREFIX', 'redis:44631:212640:cms-proswppp-com' );
define( 'DISABLE_WP_CRON', true );
define( 'WP_HOME', 'https://cms.proswppp.com' );
define( 'WP_SITEURL', 'https://cms.proswppp.com' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
