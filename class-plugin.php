<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Plugin {

    private static $instance = null;

    public static function init() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'init', array( $this, 'register_post_type' ) );
        add_filter( 'use_block_editor_for_post_type', array( $this, 'disable_gutenberg' ), 10, 2 );
        add_filter( 'single_template', array( $this, 'load_single_template' ) );

        if ( is_admin() ) {
            new Vitrine_Editor();
        }

        new Vitrine_Render();
    }

    /**
     * Registra o CPT "vitrine".
     */
    public function register_post_type() {
        $labels = array(
            'name'               => 'Vitrines',
            'singular_name'      => 'Vitrine',
            'add_new'            => 'Adicionar Nova',
            'add_new_item'       => 'Adicionar Nova Vitrine',
            'edit_item'          => 'Editar Vitrine',
            'new_item'           => 'Nova Vitrine',
            'view_item'          => 'Ver Vitrine',
            'search_items'       => 'Buscar Vitrines',
            'not_found'          => 'Nenhuma vitrine encontrada',
            'not_found_in_trash' => 'Nenhuma vitrine na lixeira',
            'menu_name'          => 'Vitrines',
        );

        register_post_type( 'vitrine', array(
            'labels'       => $labels,
            'public'       => true,
            'has_archive'  => true,
            'show_in_rest' => false,
            'show_ui'      => true,
            'supports'     => array( 'title' ),
            'menu_icon'    => 'dashicons-layout',
            'rewrite'      => array( 'slug' => 'vitrine' ),
        ) );
    }

    /**
     * Desabilita Gutenberg para o post type vitrine.
     */
    public function disable_gutenberg( $use, $post_type ) {
        if ( 'vitrine' === $post_type ) {
            return false;
        }
        return $use;
    }

    /**
     * Carrega o template single-vitrine.php do plugin.
     * O tema pode sobrescrever colocando single-vitrine.php na raiz do tema.
     */
    public function load_single_template( $template ) {
        if ( get_post_type() !== 'vitrine' ) {
            return $template;
        }

        // Permite que o tema sobrescreva
        $theme_file = locate_template( 'single-vitrine.php' );
        if ( $theme_file ) {
            return $theme_file;
        }

        $plugin_file = VITRINE_PATH . 'templates/single-vitrine.php';
        if ( file_exists( $plugin_file ) ) {
            return $plugin_file;
        }

        return $template;
    }

    /**
     * Carrega todos os elementos disponíveis na pasta /elements/.
     *
     * @return array Mapa slug => instância do elemento.
     */
    public static function load_elements() {
        static $elements = null;
        if ( null !== $elements ) {
            return $elements;
        }

        $elements = array();
        $dir      = VITRINE_PATH . 'elements/';

        if ( ! is_dir( $dir ) ) {
            return $elements;
        }

        require_once $dir . 'class-element.php';

        foreach ( glob( $dir . 'element-*.php' ) as $file ) {
            require_once $file;
        }

        // Cada arquivo de elemento registra-se via Vitrine_Element_Registry
        $elements = Vitrine_Element_Registry::get_all();
        return $elements;
    }
}
