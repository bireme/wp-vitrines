<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Editor {

    public function __construct() {
        add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
        add_action( 'save_post_vitrine', array( $this, 'save' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
        add_action( 'wp_ajax_vitrine_save_layout', array( $this, 'ajax_save' ) );

        // Força layout de 1 coluna (sem metaboxes laterais) para vitrines
        add_filter( 'get_user_option_screen_layout_vitrine', array( $this, 'force_one_column' ) );
        add_filter( 'screen_layout_columns', array( $this, 'screen_layout_columns' ) );
    }

    /**
     * Força 1 coluna no editor de vitrines.
     */
    public function force_one_column() {
        return 1;
    }

    /**
     * Define que o post type vitrine só aceita 1 coluna.
     */
    public function screen_layout_columns( $columns ) {
        $columns['vitrine'] = 1;
        return $columns;
    }

    /* ──────────────────────────────
     *  Meta Box
     * ────────────────────────────── */

    public function add_meta_box() {
        // Remove o editor clássico e adiciona o meta box do builder
        remove_post_type_support( 'vitrine', 'editor' );

        add_meta_box(
            'vitrine_builder',
            'Vitrine Builder',
            array( $this, 'render_editor' ),
            'vitrine',
            'normal',
            'high'
        );
    }

    /* ──────────────────────────────
     *  Enqueue de Assets
     * ────────────────────────────── */

    public function enqueue( $hook ) {
        global $post_type;
        if ( 'vitrine' !== $post_type ) {
            return;
        }
        if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
            return;
        }

        // SortableJS via CDN
        wp_enqueue_script(
            'sortablejs',
            'https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js',
            array(),
            '1.15.6',
            true
        );

        wp_enqueue_style(
            'vitrine-editor-css',
            VITRINE_URL . 'assets/css/editor.css',
            array(),
            VITRINE_VERSION
        );

        wp_enqueue_script(
            'vitrine-editor-js',
            VITRINE_URL . 'assets/js/editor.js',
            array( 'jquery', 'sortablejs', 'wp-util' ),
            VITRINE_VERSION,
            true
        );

        wp_enqueue_media();
        wp_enqueue_editor();

        // Dados para o JS
        $elements_raw = Vitrine_Plugin::load_elements();
        $elements_js  = array();
        foreach ( $elements_raw as $slug => $el ) {
            $fields_data = array();
            foreach ( $el->fields() as $field ) {
                $f = $field;
                if ( isset( $field['options'] ) && is_array( $field['options'] ) ) {
                    $f['options'] = $field['options'];
                }
                $fields_data[] = $f;
            }
            $elements_js[ $slug ] = array(
                'slug'     => $slug,
                'label'    => $el->label(),
                'icon'     => $el->icon(),
                'defaults' => $el->defaults(),
                'fields'   => $fields_data,
            );
        }

        $post_id = get_the_ID();
        $layout  = get_post_meta( $post_id, '_vitrine_layout', true );
        $page_settings = get_post_meta( $post_id, '_vitrine_page_settings', true );

        wp_localize_script( 'vitrine-editor-js', 'vitrineData', array(
            'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
            'nonce'        => wp_create_nonce( 'vitrine_save' ),
            'postId'       => $post_id,
            'elements'     => $elements_js,
            'layout'       => $layout ? $layout : array(),
            'pageSettings' => $page_settings ? $page_settings : array(
                'show_header'          => '1',
                'show_footer'          => '1',
                'page_bg_color'        => '',
                'hero_image'           => '',
                'hero_text'            => '',
                'hero_text_color'      => '#ffffff',
                'hero_overlay_opacity' => '50',
                'hero_height'          => '400',
            ),
        ) );
    }

    /* ──────────────────────────────
     *  Renderiza o HTML do editor
     * ────────────────────────────── */

    public function render_editor( $post ) {
        wp_nonce_field( 'vitrine_save', 'vitrine_nonce' );

        $elements = Vitrine_Plugin::load_elements();
        ?>
        <div id="vitrine-editor">
            <!-- Área principal: sidebar + canvas -->
            <div id="vitrine-editor-top">
                <!-- Sidebar esquerda: elementos disponíveis -->
                <aside id="vitrine-sidebar-left" class="vitrine-sidebar">
                    <h3>Elementos</h3>
                    <div id="vitrine-element-list">
                        <?php foreach ( $elements as $slug => $el ) : ?>
                            <div class="vitrine-element-item" data-type="<?php echo esc_attr( $slug ); ?>">
                                <span class="dashicons <?php echo esc_attr( $el->icon() ); ?>"></span>
                                <span><?php echo esc_html( $el->label() ); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </aside>

                <!-- Canvas central -->
                <main id="vitrine-canvas-wrapper">
                    <div id="vitrine-canvas">
                        <p class="vitrine-canvas-placeholder">Arraste elementos aqui</p>
                    </div>
                </main>
            </div>

            <!-- Painel inferior: configurações do elemento selecionado -->
            <aside id="vitrine-settings-bottom">
                <div class="vitrine-settings-bottom-header">
                    <h3>Configurações</h3>
                    <button type="button" id="vitrine-settings-toggle" class="button button-small" title="Minimizar/Expandir">
                        <span class="dashicons dashicons-arrow-down-alt2"></span>
                    </button>
                </div>
                <div id="vitrine-settings-panel">
                    <p class="vitrine-settings-empty">Selecione um elemento para configurar.</p>
                </div>
            </aside>
        </div>
        <?php
    }

    /* ──────────────────────────────
     *  Salvamento via AJAX
     * ────────────────────────────── */

    public function ajax_save() {
        check_ajax_referer( 'vitrine_save', 'nonce' );

        if ( ! current_user_can( 'edit_posts' ) ) {
            wp_send_json_error( 'Permissão negada.' );
        }

        $post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
        if ( ! $post_id ) {
            wp_send_json_error( 'Post inválido.' );
        }

        $layout_raw = isset( $_POST['layout'] ) ? wp_unslash( $_POST['layout'] ) : '';
        $layout     = json_decode( $layout_raw, true );

        if ( ! is_array( $layout ) ) {
            wp_send_json_error( 'Layout inválido.' );
        }

        // Sanitiza recursivamente
        $layout = $this->sanitize_layout( $layout );
        update_post_meta( $post_id, '_vitrine_layout', $layout );

        // Salva configurações da página
        $page_raw = isset( $_POST['page_settings'] ) ? wp_unslash( $_POST['page_settings'] ) : '';
        $page_settings = json_decode( $page_raw, true );
        if ( is_array( $page_settings ) ) {
            $clean_page = array(
                'show_header'           => ! empty( $page_settings['show_header'] ) ? '1' : '0',
                'show_footer'           => ! empty( $page_settings['show_footer'] ) ? '1' : '0',
                'page_bg_color'         => isset( $page_settings['page_bg_color'] ) ? sanitize_hex_color( $page_settings['page_bg_color'] ) : '',
                'hero_image'            => isset( $page_settings['hero_image'] ) ? esc_url_raw( $page_settings['hero_image'] ) : '',
                'hero_text'             => isset( $page_settings['hero_text'] ) ? sanitize_text_field( $page_settings['hero_text'] ) : '',
                'hero_text_color'       => isset( $page_settings['hero_text_color'] ) ? sanitize_hex_color( $page_settings['hero_text_color'] ) : '#ffffff',
                'hero_overlay_opacity'  => isset( $page_settings['hero_overlay_opacity'] ) ? absint( $page_settings['hero_overlay_opacity'] ) : 50,
                'hero_height'           => isset( $page_settings['hero_height'] ) ? absint( $page_settings['hero_height'] ) : 400,
            );
            update_post_meta( $post_id, '_vitrine_page_settings', $clean_page );
        }

        wp_send_json_success( 'Layout salvo.' );
    }

    /**
     * Salvamento ao publicar/atualizar normalmente.
     */
    public function save( $post_id ) {
        if ( ! isset( $_POST['vitrine_nonce'] ) ) {
            return;
        }
        if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['vitrine_nonce'] ) ), 'vitrine_save' ) ) {
            return;
        }
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }

        // O layout principal é salvo via AJAX, mas mantemos este hook caso necessário.
    }

    /**
     * Sanitiza o array do layout de forma recursiva.
     */
    private function sanitize_layout( $layout ) {
        $clean = array();
        foreach ( $layout as $item ) {
            if ( ! is_array( $item ) || empty( $item['type'] ) ) {
                continue;
            }
            $clean_item = array(
                'type' => sanitize_key( $item['type'] ),
                'id'   => isset( $item['id'] ) ? sanitize_key( $item['id'] ) : wp_generate_uuid4(),
            );

            if ( isset( $item['settings'] ) && is_array( $item['settings'] ) ) {
                $clean_item['settings'] = array_map( function ( $v ) {
                    if ( is_array( $v ) ) {
                        // Suporte a arrays de itens (ex: aranha left_items/right_items)
                        return array_map( function ( $sub ) {
                            if ( is_array( $sub ) ) {
                                return array_map( function ( $val ) {
                                    return wp_kses_post( (string) $val );
                                }, $sub );
                            }
                            return sanitize_text_field( (string) $sub );
                        }, $v );
                    }
                    if ( is_string( $v ) ) {
                        return wp_kses_post( $v );
                    }
                    if ( is_numeric( $v ) ) {
                        return $v;
                    }
                    return sanitize_text_field( (string) $v );
                }, $item['settings'] );
            } else {
                $clean_item['settings'] = array();
            }

            if ( isset( $item['height'] ) ) {
                $clean_item['height'] = absint( $item['height'] );
            }

            // Largura personalizada para layout em linha
            if ( isset( $item['width'] ) && is_string( $item['width'] ) ) {
                $clean_item['width'] = sanitize_text_field( $item['width'] );
            }

            // Suporte a elementos filhos (containers)
            if ( isset( $item['children'] ) && is_array( $item['children'] ) ) {
                $clean_item['children'] = $this->sanitize_layout( $item['children'] );
            }

            $clean[] = $clean_item;
        }
        return $clean;
    }
}
