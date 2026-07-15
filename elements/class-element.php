<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Classe-base para todo elemento de vitrine.
 * Cada elemento concreto estende esta classe.
 */
abstract class Vitrine_Element {

    /** Slug único do elemento. */
    abstract public function slug();

    /** Nome exibido na barra lateral. */
    abstract public function label();

    /** Classe de ícone Dashicon. */
    abstract public function icon();

    /** Valores padrão das configurações. */
    abstract public function defaults();

    /**
     * Campos de configuração exibidos na sidebar direita.
     * Retorna array de arrays com keys: name, label, type.
     * Tipos suportados: text, textarea, number, color, image.
     */
    abstract public function fields();

    /**
     * Renderiza o HTML final do elemento no frontend.
     *
     * @param array  $settings       Configurações salvas.
     * @param string $children_html  HTML dos elementos filhos (para containers).
     * @return string HTML.
     */
    abstract public function render( $settings, $children_html = '' );

    /**
     * Defaults dos modelos de card (Escuro / Branco / Borda esquerda).
     */
    protected static function card_preset_defaults() {
        return array(
            'preset_card_bg'           => '',
            'preset_card_bg_hover'     => '',
            'preset_card_border_style' => '',
            'preset_card_border_width' => '',
            'preset_card_border_color' => '',
            'preset_icon_bg'           => '',
            'preset_icon_radius'       => '',
            'preset_title_size'        => '',
            'preset_text_size'         => '',
            'preset_card_padding'      => '',
            'preset_body_direction'    => '',
            'preset_body_gap'          => '',
            'preset_body_padding'      => '',
        );
    }

    /**
     * Campos do painel para personalizar modelos de card.
     */
    protected static function card_preset_fields() {
        return array(
            array( 'name' => 'preset_card_bg',           'label' => 'Fundo do card (modelo)',           'type' => 'color' ),
            array( 'name' => 'preset_card_bg_hover',     'label' => 'Fundo do card ao passar o mouse',  'type' => 'color' ),
            array( 'name' => 'preset_card_border_style', 'label' => 'Borda do card',                    'type' => 'select', 'options' => array( '' => 'Padrão do modelo', 'none' => 'Nenhuma', 'solid' => 'Sólida' ) ),
            array( 'name' => 'preset_card_border_width', 'label' => 'Largura da borda (px)',            'type' => 'number' ),
            array( 'name' => 'preset_card_border_color', 'label' => 'Cor da borda',                     'type' => 'color' ),
            array( 'name' => 'preset_icon_bg',           'label' => 'Fundo do ícone',                   'type' => 'color' ),
            array( 'name' => 'preset_icon_radius',       'label' => 'Arredondamento do ícone (px)',     'type' => 'number' ),
            array( 'name' => 'preset_title_size',        'label' => 'Tam. título do card (px)',         'type' => 'number' ),
            array( 'name' => 'preset_text_size',         'label' => 'Tam. texto do card (px)',          'type' => 'number' ),
            array( 'name' => 'preset_card_padding',      'label' => 'Espaçamento interno do card (px)', 'type' => 'number' ),
            array( 'name' => 'preset_body_direction',    'label' => 'Layout ícone + texto',             'type' => 'select', 'options' => array( '' => 'Padrão do modelo', 'column' => 'Coluna (ícone acima)', 'row' => 'Linha (ícone ao lado)' ) ),
            array( 'name' => 'preset_body_gap',          'label' => 'Espaço ícone/texto (px)',          'type' => 'number' ),
            array( 'name' => 'preset_body_padding',      'label' => 'Padding do corpo do card (px)',    'type' => 'number' ),
        );
    }

    /**
     * CSS custom properties para modelos de card.
     */
    protected function build_card_preset_style( $settings, $icon_color = '' ) {
        $s = wp_parse_args( $settings, self::card_preset_defaults() );
        $vars = array();

        if ( ! empty( $s['preset_card_bg'] ) ) {
            $vars[] = '--vp-card-bg:' . esc_attr( $s['preset_card_bg'] );
        }
        if ( ! empty( $s['preset_card_bg_hover'] ) ) {
            $vars[] = '--vp-card-bg-hover:' . esc_attr( $s['preset_card_bg_hover'] );
        }

        $border_style = sanitize_key( $s['preset_card_border_style'] );
        if ( 'none' === $border_style ) {
            $vars[] = '--vp-card-border:none';
        } elseif ( 'solid' === $border_style ) {
            $width = max( 0, intval( $s['preset_card_border_width'] ) );
            $color = ! empty( $s['preset_card_border_color'] ) ? esc_attr( $s['preset_card_border_color'] ) : '#d0d0d0';
            $vars[] = '--vp-card-border:' . $width . 'px solid ' . $color;
        }

        if ( ! empty( $s['preset_icon_bg'] ) ) {
            $vars[] = '--vp-icon-bg:' . esc_attr( $s['preset_icon_bg'] );
        }

        $icon_radius = intval( $s['preset_icon_radius'] );
        if ( $icon_radius > 0 ) {
            $vars[] = '--vp-icon-radius:' . ( $icon_radius >= 50 ? '50%' : $icon_radius . 'px' );
        }

        $icon_clr = $icon_color ? $icon_color : ( isset( $settings['icon_color'] ) ? $settings['icon_color'] : '' );
        if ( $icon_clr ) {
            $vars[] = '--vp-icon-color:' . esc_attr( $icon_clr );
        }

        if ( '' !== $s['preset_title_size'] && null !== $s['preset_title_size'] ) {
            $vars[] = '--vp-title-size:' . max( 8, intval( $s['preset_title_size'] ) ) . 'px';
        }
        if ( '' !== $s['preset_text_size'] && null !== $s['preset_text_size'] ) {
            $vars[] = '--vp-text-size:' . max( 8, intval( $s['preset_text_size'] ) ) . 'px';
        }
        if ( '' !== $s['preset_card_padding'] && null !== $s['preset_card_padding'] ) {
            $vars[] = '--vp-card-padding:' . max( 0, intval( $s['preset_card_padding'] ) ) . 'px';
        }
        if ( in_array( $s['preset_body_direction'], array( 'column', 'row' ), true ) ) {
            $vars[] = '--vp-body-direction:' . $s['preset_body_direction'];
        }
        if ( '' !== $s['preset_body_gap'] && null !== $s['preset_body_gap'] ) {
            $vars[] = '--vp-body-gap:' . max( 0, intval( $s['preset_body_gap'] ) ) . 'px';
        }
        if ( '' !== $s['preset_body_padding'] && null !== $s['preset_body_padding'] ) {
            $vars[] = '--vp-body-padding:' . max( 0, intval( $s['preset_body_padding'] ) ) . 'px';
        }

        return $vars ? implode( ';', $vars ) . ';' : '';
    }
}

/**
 * Registro global de elementos.
 */
class Vitrine_Element_Registry {

    private static $elements = array();

    /**
     * Registra um elemento.
     */
    public static function register( Vitrine_Element $element ) {
        self::$elements[ $element->slug() ] = $element;
    }

    /**
     * Retorna todos os elementos registrados.
     */
    public static function get_all() {
        return self::$elements;
    }

    /**
     * Retorna um elemento pelo slug ou null.
     */
    public static function get( $slug ) {
        return isset( self::$elements[ $slug ] ) ? self::$elements[ $slug ] : null;
    }
}
