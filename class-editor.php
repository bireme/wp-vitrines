<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Editor {

    public function __construct() {
        add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ) );
        add_action( 'add_meta_boxes', array( $this, 'register_page_css_meta_box' ), 25 );
        add_action( 'edit_form_after_title', array( $this, 'render_topbar' ) );
        add_filter( 'get_user_option_meta-box-order_vitrine', array( $this, 'force_meta_box_order' ) );
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

    /**
     * Registra meta box de CSS após o Hero.
     */
    public function register_page_css_meta_box() {
        add_meta_box(
            'vitrine_page_css',
            'CSS Personalizado da Vitrine',
            array( $this, 'render_page_css_meta_box' ),
            'vitrine',
            'normal',
            'low'
        );
    }

    /**
     * Meta box de CSS global da vitrine (abaixo do Hero).
     */
    public function render_page_css_meta_box( $post ) {
        $settings   = Vitrine_Hero_Meta::get_settings( $post->ID );
        $custom_css = isset( $settings['custom_css'] ) ? $settings['custom_css'] : '';
        ?>
        <div id="vitrine-page-css-settings" class="vitrine-page-css-metabox">
            <p class="vitrine-page-css-hint">Aplicado a <strong>toda esta vitrine</strong> no frontend. Use seletores como <code>#vitrine-single</code>, <code>.vitrine-front</code> ou <code>.vitrine-block</code>.</p>
            <textarea id="vitrine-page-custom-css" class="vitrine-page-css-textarea" rows="8" spellcheck="false" placeholder="#vitrine-single .vitrine-front {&#10;  max-width: 1400px;&#10;}"><?php echo esc_textarea( $custom_css ); ?></textarea>
        </div>
        <?php
    }

    /**
     * Garante Builder antes do Hero (mesmo com ordem salva pelo usuário).
     */
    public function force_meta_box_order( $order ) {
        $preferred = array( 'vitrine_builder', 'vitrine_hero', 'vitrine_page_css' );
        $others    = array();

        if ( is_string( $order ) && '' !== $order ) {
            foreach ( explode( ',', $order ) as $id ) {
                $id = trim( $id );
                if ( $id && ! in_array( $id, $preferred, true ) ) {
                    $others[] = $id;
                }
            }
        }

        return implode( ',', array_merge( $preferred, $others ) );
    }

    /**
     * Barra superior fixa abaixo do título (publicar, visualizar, opções da página).
     */
    public function render_topbar( $post ) {
        if ( ! $post || 'vitrine' !== $post->post_type ) {
            return;
        }

        $settings = Vitrine_Hero_Meta::get_settings( $post->ID );
        $show_h   = ! isset( $settings['show_header'] ) || '1' === $settings['show_header'];
        $show_f   = ! isset( $settings['show_footer'] ) || '1' === $settings['show_footer'];
        $pg_bg    = ! empty( $settings['page_bg_color'] ) ? $settings['page_bg_color'] : '#ffffff';
        $has_bg   = ! empty( $settings['page_bg_color'] );

        $status       = get_post_status( $post );
        $is_published = ( 'publish' === $status );
        $can_publish  = current_user_can( 'publish_posts' );
        $publish_text = $is_published ? __( 'Atualizar' ) : __( 'Publicar' );
        ?>
        <div id="vitrine-topbar">
            <div id="vitrine-page-settings">
                <label class="vitrine-topbar-toggle">
                    <input type="checkbox" id="vitrine-opt-header"<?php checked( $show_h ); ?> /> Header
                </label>
                <label class="vitrine-topbar-toggle">
                    <input type="checkbox" id="vitrine-opt-footer"<?php checked( $show_f ); ?> /> Footer
                </label>
                <label class="vitrine-topbar-color">
                    Fundo: <input type="color" id="vitrine-opt-bg" value="<?php echo esc_attr( $pg_bg ); ?>" />
                </label>
                <?php if ( $has_bg ) : ?>
                    <button type="button" id="vitrine-opt-bg-clear" class="button button-small" title="Limpar cor">&#10005;</button>
                <?php endif; ?>
            </div>
            <div id="vitrine-topbar-actions">
                <span class="spinner"></span>
                <button type="button" id="vitrine-preview-btn" class="button button-large">
                    <span class="dashicons dashicons-visibility"></span> Visualizar
                </button>
                <?php if ( $can_publish && ! $is_published ) : ?>
                    <input type="submit" name="save" id="save-post" class="button" value="<?php echo esc_attr__( 'Salvar rascunho' ); ?>" />
                    <input type="submit" name="publish" id="publish" class="button button-primary button-large" value="<?php echo esc_attr( $publish_text ); ?>" />
                <?php elseif ( $can_publish ) : ?>
                    <input type="submit" name="save" id="save-post" class="button button-large" value="<?php echo esc_attr__( 'Salvar rascunho' ); ?>" />
                    <input type="submit" name="publish" id="publish" class="button button-primary button-large" value="<?php echo esc_attr( $publish_text ); ?>" />
                <?php else : ?>
                    <input type="submit" name="save" id="save-post" class="button button-primary button-large" value="<?php echo esc_attr__( 'Submeter para revisão' ); ?>" />
                <?php endif; ?>
            </div>
        </div>
        <?php
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

        wp_enqueue_style( 'dashicons' );

        // Font Awesome 6 Free
        wp_enqueue_style(
            'font-awesome',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
            array(),
            '6.7.2'
        );

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
            filemtime( VITRINE_PATH . 'assets/css/editor.css' )
        );

        wp_enqueue_script(
            'vitrine-editor-js',
            VITRINE_URL . 'assets/js/editor.js',
            array( 'jquery', 'sortablejs', 'wp-util' ),
            filemtime( VITRINE_PATH . 'assets/js/editor.js' ),
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
        $all_settings = Vitrine_Hero_Meta::get_settings( $post_id );
        $page_settings = array(
            'show_header'   => $all_settings['show_header'],
            'show_footer'   => $all_settings['show_footer'],
            'page_bg_color' => $all_settings['page_bg_color'],
            'custom_css'    => $all_settings['custom_css'],
        );

        wp_localize_script( 'vitrine-editor-js', 'vitrineData', array(
            'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
            'nonce'        => wp_create_nonce( 'vitrine_save' ),
            'postId'       => $post_id,
            'postStatus'   => $post_id ? get_post_status( $post_id ) : 'auto-draft',
            'previewUrl'   => $post_id ? get_preview_post_link( $post_id ) : '',
            'viewUrl'      => ( $post_id && 'publish' === get_post_status( $post_id ) ) ? get_permalink( $post_id ) : '',
            'elements'     => $elements_js,
            'layout'       => $layout ? $layout : array(),
            'pageSettings' => $page_settings,
            'iconPicker'   => Vitrine_Icons::get_picker_data(),
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
            <!-- Área principal: sidebar esquerda + canvas + sidebar direita -->
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

                <!-- Sidebar direita: configurações do elemento selecionado -->
                <aside id="vitrine-settings-sidebar">
                    <div id="vitrine-settings-sidebar-header">
                        <div id="vitrine-settings-el-info">
                            <span id="vitrine-settings-el-icon" class="dashicons dashicons-admin-settings"></span>
                            <span id="vitrine-settings-el-label">Configurações</span>
                        </div>
                        <button type="button" id="vitrine-settings-sidebar-close" title="Fechar painel">
                            <span class="dashicons dashicons-no-alt"></span>
                        </button>
                    </div>
                    <div id="vitrine-settings-panel">
                        <div class="vitrine-settings-empty-state">
                            <span class="dashicons dashicons-edit-large"></span>
                            <p>Clique em um elemento no canvas para editar as suas configurações.</p>
                        </div>
                    </div>
                </aside>
            </div>
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
            $builder_settings = array(
                'show_header'   => ! empty( $page_settings['show_header'] ) ? '1' : '0',
                'show_footer'   => ! empty( $page_settings['show_footer'] ) ? '1' : '0',
                'page_bg_color' => isset( $page_settings['page_bg_color'] ) ? sanitize_hex_color( $page_settings['page_bg_color'] ) : '',
                'custom_css'    => isset( $page_settings['custom_css'] ) ? $this->sanitize_page_custom_css( $page_settings['custom_css'] ) : '',
            );
            $merged = Vitrine_Hero_Meta::merge_settings( $post_id, $builder_settings );
            update_post_meta( $post_id, '_vitrine_page_settings', $merged );
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

    /**
     * Sanitiza CSS personalizado da vitrine (remove tags e padrões perigosos).
     */
    private function sanitize_page_custom_css( $css ) {
        $css = wp_strip_all_tags( (string) $css );
        $css = preg_replace( '/expression\s*\(/i', '', $css );
        $css = preg_replace( '/javascript\s*:/i', '', $css );
        $css = str_replace( array( '<', '>' ), '', $css );
        return trim( $css );
    }
}
