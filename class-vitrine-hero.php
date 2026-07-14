<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Meta box isolado para configurações do Hero da vitrine.
 */
class Vitrine_Hero_Meta {

    const META_KEY = '_vitrine_page_settings';

    public function __construct() {
        add_action( 'add_meta_boxes', array( $this, 'add_meta_box' ), 20 );
        add_action( 'save_post_vitrine', array( $this, 'save' ), 10, 2 );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue' ) );
    }

    public static function default_page_settings() {
        return array(
            'show_header'          => '1',
            'show_footer'          => '1',
            'page_bg_color'        => '',
            'hero_image'           => '',
            'hero_text'            => '',
            'hero_text_color'      => '#ffffff',
            'hero_overlay_opacity' => '50',
            'hero_height'          => '400',
            'hero_font_size'       => '36',
            'hero_text_align'      => 'center',
            'hero_description'     => '',
            'hero_desc_size'       => '18',
            'hero_desc_color'      => '',
            'hero_desc_max_width'  => '',
            'hero_text_bold'       => '1',
            'hero_text_italic'     => '0',
            'hero_desc_bold'       => '0',
            'hero_desc_italic'     => '0',
            'custom_css'           => '',
        );
    }

    public static function get_settings( $post_id ) {
        $settings = get_post_meta( $post_id, self::META_KEY, true );
        if ( ! is_array( $settings ) ) {
            return self::default_page_settings();
        }
        return wp_parse_args( $settings, self::default_page_settings() );
    }

    /**
     * Mescla configurações parciais preservando chaves não enviadas (ex.: hero vs builder).
     */
    public static function merge_settings( $post_id, array $partial ) {
        $existing = self::get_settings( $post_id );
        return array_merge( $existing, $partial );
    }

    public static function hero_keys() {
        return array(
            'hero_image',
            'hero_text',
            'hero_text_color',
            'hero_overlay_opacity',
            'hero_height',
            'hero_font_size',
            'hero_text_align',
            'hero_description',
            'hero_desc_size',
            'hero_desc_color',
            'hero_desc_max_width',
            'hero_text_bold',
            'hero_text_italic',
            'hero_desc_bold',
            'hero_desc_italic',
        );
    }

    public static function builder_keys() {
        return array(
            'show_header',
            'show_footer',
            'page_bg_color',
            'custom_css',
        );
    }

    public static function sanitize_hero( array $input ) {
        $align = isset( $input['hero_text_align'] ) ? $input['hero_text_align'] : 'center';
        if ( ! in_array( $align, array( 'left', 'center', 'right' ), true ) ) {
            $align = 'center';
        }

        return array(
            'hero_image'           => isset( $input['hero_image'] ) ? esc_url_raw( $input['hero_image'] ) : '',
            'hero_text'            => isset( $input['hero_text'] ) ? sanitize_text_field( $input['hero_text'] ) : '',
            'hero_text_color'      => isset( $input['hero_text_color'] ) ? sanitize_hex_color( $input['hero_text_color'] ) : '#ffffff',
            'hero_overlay_opacity' => isset( $input['hero_overlay_opacity'] ) ? absint( $input['hero_overlay_opacity'] ) : 50,
            'hero_height'          => isset( $input['hero_height'] ) ? absint( $input['hero_height'] ) : 400,
            'hero_font_size'       => isset( $input['hero_font_size'] ) ? absint( $input['hero_font_size'] ) : 36,
            'hero_text_align'      => $align,
            'hero_description'     => isset( $input['hero_description'] ) ? wp_kses_post( $input['hero_description'] ) : '',
            'hero_desc_size'       => isset( $input['hero_desc_size'] ) ? absint( $input['hero_desc_size'] ) : 18,
            'hero_desc_color'      => isset( $input['hero_desc_color'] ) ? sanitize_hex_color( $input['hero_desc_color'] ) : '',
            'hero_desc_max_width'  => isset( $input['hero_desc_max_width'] ) ? absint( $input['hero_desc_max_width'] ) : 0,
            'hero_text_bold'       => ! empty( $input['hero_text_bold'] ) ? '1' : '0',
            'hero_text_italic'     => ! empty( $input['hero_text_italic'] ) ? '1' : '0',
            'hero_desc_bold'       => ! empty( $input['hero_desc_bold'] ) ? '1' : '0',
            'hero_desc_italic'     => ! empty( $input['hero_desc_italic'] ) ? '1' : '0',
        );
    }

    public function add_meta_box() {
        add_meta_box(
            'vitrine_hero',
            'Hero da Vitrine',
            array( $this, 'render_meta_box' ),
            'vitrine',
            'normal',
            'low'
        );
    }

    public function enqueue( $hook ) {
        global $post_type;
        if ( 'vitrine' !== $post_type || ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
            return;
        }

        wp_enqueue_media();
        wp_enqueue_style(
            'vitrine-hero-admin-css',
            VITRINE_URL . 'assets/css/editor.css',
            array(),
            filemtime( VITRINE_PATH . 'assets/css/editor.css' )
        );
        wp_enqueue_script(
            'vitrine-hero-admin-js',
            VITRINE_URL . 'assets/js/hero-admin.js',
            array( 'jquery' ),
            filemtime( VITRINE_PATH . 'assets/js/hero-admin.js' ),
            true
        );

        $post_id  = get_the_ID();
        $settings = self::get_settings( $post_id );
        wp_localize_script( 'vitrine-hero-admin-js', 'vitrineHeroData', array(
            'settings' => $settings,
        ) );
    }

    public function render_meta_box( $post ) {
        wp_nonce_field( 'vitrine_hero_save', 'vitrine_hero_nonce' );

        $s = self::get_settings( $post->ID );
        ?>
        <div id="vitrine-hero-meta-box" class="vitrine-hero-metabox">
            <p class="description" style="margin-top:0;">Banner no topo da vitrine publicada. Salve ou atualize a vitrine para aplicar.</p>
            <div class="vitrine-hero-fields">
                <div class="vitrine-hero-field">
                    <label for="vitrine-hero-image">Imagem de fundo</label>
                    <div class="vitrine-image-field vitrine-hero-image-field">
                        <?php if ( ! empty( $s['hero_image'] ) ) : ?>
                            <img src="<?php echo esc_url( $s['hero_image'] ); ?>" class="vitrine-image-preview" alt="" />
                        <?php endif; ?>
                        <input type="hidden" name="vitrine_hero[hero_image]" id="vitrine-hero-image" value="<?php echo esc_attr( $s['hero_image'] ); ?>" />
                        <button type="button" class="button" id="vitrine-hero-select-image">Selecionar</button>
                        <?php if ( ! empty( $s['hero_image'] ) ) : ?>
                            <button type="button" class="button" id="vitrine-hero-remove-image">Remover</button>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="vitrine-hero-field">
                    <label for="vitrine-hero-text">Frase de destaque</label>
                    <input type="text" name="vitrine_hero[hero_text]" id="vitrine-hero-text" value="<?php echo esc_attr( $s['hero_text'] ); ?>" placeholder="Título do hero" class="widefat" />
                    <div class="vitrine-hero-format">
                        <button type="button" class="vitrine-format-btn<?php echo '1' === $s['hero_text_bold'] ? ' is-active' : ''; ?>" data-target="text" data-prop="bold" title="Negrito"><b>B</b></button>
                        <button type="button" class="vitrine-format-btn<?php echo '1' === $s['hero_text_italic'] ? ' is-active' : ''; ?>" data-target="text" data-prop="italic" title="Itálico"><i>I</i></button>
                        <input type="hidden" name="vitrine_hero[hero_text_bold]" id="vitrine-hero-text-bold" value="<?php echo esc_attr( $s['hero_text_bold'] ); ?>" />
                        <input type="hidden" name="vitrine_hero[hero_text_italic]" id="vitrine-hero-text-italic" value="<?php echo esc_attr( $s['hero_text_italic'] ); ?>" />
                    </div>
                </div>

                <div class="vitrine-hero-field vitrine-hero-field--row">
                    <div>
                        <label for="vitrine-hero-font-size">Tamanho do texto (px)</label>
                        <input type="number" name="vitrine_hero[hero_font_size]" id="vitrine-hero-font-size" value="<?php echo esc_attr( $s['hero_font_size'] ); ?>" min="12" max="120" step="2" class="small-text" />
                    </div>
                    <div>
                        <label for="vitrine-hero-text-align">Alinhamento</label>
                        <select name="vitrine_hero[hero_text_align]" id="vitrine-hero-text-align">
                            <option value="left"<?php selected( $s['hero_text_align'], 'left' ); ?>>Esquerda</option>
                            <option value="center"<?php selected( $s['hero_text_align'], 'center' ); ?>>Centro</option>
                            <option value="right"<?php selected( $s['hero_text_align'], 'right' ); ?>>Direita</option>
                        </select>
                    </div>
                </div>

                <div class="vitrine-hero-field vitrine-hero-field--wide">
                    <label>Descrição</label>
                    <div class="vitrine-wysiwyg-toolbar" id="vitrine-hero-desc-toolbar">
                        <button type="button" class="vitrine-wysiwyg-btn" data-cmd="bold" title="Negrito"><b>B</b></button>
                        <button type="button" class="vitrine-wysiwyg-btn" data-cmd="italic" title="Itálico"><i>I</i></button>
                        <button type="button" class="vitrine-wysiwyg-btn" data-cmd="underline" title="Sublinhado"><u>U</u></button>
                        <button type="button" class="vitrine-wysiwyg-btn" data-cmd="removeFormat" title="Limpar formatação">&#10005;</button>
                    </div>
                    <div id="vitrine-hero-description" class="vitrine-aranha-wysiwyg" contenteditable="true"><?php echo wp_kses_post( $s['hero_description'] ); ?></div>
                    <textarea name="vitrine_hero[hero_description]" id="vitrine-hero-description-input" class="hidden" style="display:none;"><?php echo esc_textarea( $s['hero_description'] ); ?></textarea>
                </div>

                <div class="vitrine-hero-field">
                    <label for="vitrine-hero-desc-size">Tamanho da descrição (px)</label>
                    <input type="number" name="vitrine_hero[hero_desc_size]" id="vitrine-hero-desc-size" value="<?php echo esc_attr( $s['hero_desc_size'] ); ?>" min="10" max="60" step="1" class="small-text" />
                </div>

                <div class="vitrine-hero-field vitrine-hero-field--row">
                    <div>
                        <label for="vitrine-hero-desc-color">Cor da descrição</label>
                        <input type="color" name="vitrine_hero[hero_desc_color]" id="vitrine-hero-desc-color" value="<?php echo esc_attr( ! empty( $s['hero_desc_color'] ) ? $s['hero_desc_color'] : ( $s['hero_text_color'] ?: '#ffffff' ) ); ?>" />
                        <p class="description">Deixe igual à cor do título ou escolha outra.</p>
                    </div>
                    <div>
                        <label for="vitrine-hero-desc-max-width">Largura máxima da descrição (px)</label>
                        <input type="number" name="vitrine_hero[hero_desc_max_width]" id="vitrine-hero-desc-max-width" value="<?php echo esc_attr( $s['hero_desc_max_width'] ); ?>" min="0" max="1400" step="10" class="small-text" placeholder="auto" />
                    </div>
                </div>

                <div class="vitrine-hero-field">
                    <label for="vitrine-hero-text-color">Cor do texto</label>
                    <input type="color" name="vitrine_hero[hero_text_color]" id="vitrine-hero-text-color" value="<?php echo esc_attr( $s['hero_text_color'] ?: '#ffffff' ); ?>" />
                </div>

                <div class="vitrine-hero-field">
                    <label for="vitrine-hero-opacity">Opacidade do fade <span id="vitrine-hero-opacity-val"><?php echo esc_html( $s['hero_overlay_opacity'] ); ?>%</span></label>
                    <input type="range" name="vitrine_hero[hero_overlay_opacity]" id="vitrine-hero-opacity" min="0" max="100" value="<?php echo esc_attr( $s['hero_overlay_opacity'] ); ?>" />
                </div>

                <div class="vitrine-hero-field">
                    <label for="vitrine-hero-height">Altura (px)</label>
                    <input type="number" name="vitrine_hero[hero_height]" id="vitrine-hero-height" value="<?php echo esc_attr( $s['hero_height'] ); ?>" min="100" max="1000" step="10" class="small-text" />
                </div>
            </div>
            <div id="vitrine-hero-preview"></div>
        </div>
        <?php
    }

    public function save( $post_id, $post ) {
        if ( ! isset( $_POST['vitrine_hero_nonce'] ) ) {
            return;
        }
        if ( ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['vitrine_hero_nonce'] ) ), 'vitrine_hero_save' ) ) {
            return;
        }
        if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
            return;
        }
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            return;
        }
        if ( 'vitrine' !== $post->post_type ) {
            return;
        }

        $raw  = isset( $_POST['vitrine_hero'] ) && is_array( $_POST['vitrine_hero'] ) ? wp_unslash( $_POST['vitrine_hero'] ) : array();
        $hero = self::sanitize_hero( $raw );
        $merged = self::merge_settings( $post_id, $hero );

        update_post_meta( $post_id, self::META_KEY, $merged );
    }
}
