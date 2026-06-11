<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Toggle extends Vitrine_Element {

    public function slug() {
        return 'toggle';
    }

    public function label() {
        return 'Toggle';
    }

    public function icon() {
        return 'dashicons-arrow-down-alt2';
    }

    public function defaults() {
        return array(
            'header_bg'          => '#f5f5f5',
            'header_color'       => '#333333',
            'content_bg'         => '#ffffff',
            'content_color'      => '#555555',
            'border_color'       => '#dcdcde',
            'icon_color'         => '#0073aa',
            'title_font_size'    => '16',
            'content_font_size'  => '14',
            'items'              => array(),
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'header_bg',         'label' => 'Cor fundo cabeçalho',  'type' => 'color' ),
            array( 'name' => 'header_color',       'label' => 'Cor texto cabeçalho',  'type' => 'color' ),
            array( 'name' => 'content_bg',         'label' => 'Cor fundo conteúdo',   'type' => 'color' ),
            array( 'name' => 'content_color',      'label' => 'Cor texto conteúdo',   'type' => 'color' ),
            array( 'name' => 'border_color',       'label' => 'Cor da borda',         'type' => 'color' ),
            array( 'name' => 'icon_color',         'label' => 'Cor do ícone +/−',     'type' => 'color' ),
            array( 'name' => 'title_font_size',    'label' => 'Tam. título (px)',      'type' => 'number' ),
            array( 'name' => 'content_font_size',  'label' => 'Tam. descrição (px)',   'type' => 'number' ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $items = is_array( $s['items'] ) ? $s['items'] : array();
        if ( empty( $items ) ) {
            return '<p style="color:#999;">Nenhum toggle adicionado.</p>';
        }

        $header_bg         = esc_attr( $s['header_bg'] );
        $header_color      = esc_attr( $s['header_color'] );
        $content_bg        = esc_attr( $s['content_bg'] );
        $content_color     = esc_attr( $s['content_color'] );
        $border_color      = esc_attr( $s['border_color'] );
        $icon_color        = esc_attr( $s['icon_color'] );
        $title_font_size   = max( 8, intval( $s['title_font_size'] ) ) . 'px';
        $content_font_size = max( 8, intval( $s['content_font_size'] ) ) . 'px';

        $output = '<div class="vitrine-el-toggle" style="border:1px solid ' . $border_color . ';border-radius:4px;overflow:hidden;">';

        foreach ( $items as $idx => $item ) {
            $title   = esc_html( isset( $item['title'] ) ? $item['title'] : '' );
            $content = isset( $item['content'] ) ? $item['content'] : '';

            $output .= '<div class="vitrine-toggle-item">';
            $output .= '<button type="button" class="vitrine-toggle-header" style="background:' . $header_bg . ';color:' . $header_color . ';border-bottom:1px solid ' . $border_color . ';">';
            $output .= '<span class="vitrine-toggle-title" style="font-size:' . $title_font_size . ';">' . $title . '</span>';
            $output .= '<span class="vitrine-toggle-icon" style="color:' . $icon_color . ';">+</span>';
            $output .= '</button>';
            $output .= '<div class="vitrine-toggle-content" style="background:' . $content_bg . ';color:' . $content_color . ';border-bottom:1px solid ' . $border_color . ';">';
            $output .= '<div class="vitrine-toggle-content-inner" style="font-size:' . $content_font_size . ';">' . wp_kses_post( $content ) . '</div>';
            $output .= '</div>';
            $output .= '</div>';
        }

        $output .= '</div>';

        return $output;
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Toggle() );
