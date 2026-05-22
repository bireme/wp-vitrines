<?php
/**
 * Plugin Name: Vitrine Builder
 * Plugin URI:  https://2wp.com.br
 * Description: Editor visual drag-and-drop para criação de vitrines personalizadas.
 * Version:     1.53.3323
 * Author:      TONI LOPES
 * Author URI:  https://2wp.com.br
 * License:     GPL-2.0+
 * Text Domain: plugin-vitrine
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'VITRINE_VERSION', '1.65.0000' );
define( 'VITRINE_PATH', plugin_dir_path( __FILE__ ) );
define( 'VITRINE_URL', plugin_dir_url( __FILE__ ) );

require_once VITRINE_PATH . 'class-plugin.php';
require_once VITRINE_PATH . 'class-editor.php';
require_once VITRINE_PATH . 'class-render.php';

add_action( 'plugins_loaded', array( 'Vitrine_Plugin', 'init' ) );


add_filter('single_template', 'twowp_vitrine_single_template');

function twowp_vitrine_single_template($template) {

    if (is_singular('vitrine')) {

        $plugin_template = plugin_dir_path(__FILE__) . 'templates/single-vitrine.php';

        if (file_exists($plugin_template)) {
            return $plugin_template;
        }
    }

    return $template;
}