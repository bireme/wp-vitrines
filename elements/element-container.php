<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Container extends Vitrine_Element {

    public function slug() {
        return 'container';
    }

    public function label() {
        return 'Container';
    }

    public function icon() {
        return 'dashicons-grid-view';
    }

    public function defaults() {
        return array(
            'bg_color'    => '#f5f5f5',
            'bg_image'    => '',
            'bg_size'     => 'cover',
            'padding'     => '20',
            'max_width'   => '1200',
            'direction'   => 'column',
            'gap'         => '16',
            'align_items' => 'stretch',
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'bg_color',    'label' => 'Cor de fundo',          'type' => 'color' ),
            array( 'name' => 'bg_image',    'label' => 'Imagem de fundo',       'type' => 'image' ),
            array( 'name' => 'bg_size',     'label' => 'Tamanho do fundo',      'type' => 'select', 'options' => array( 'cover' => 'Cobrir (cover)', 'contain' => 'Conter (contain)', 'auto' => 'Automático' ) ),
            array( 'name' => 'padding',     'label' => 'Padding (px)',          'type' => 'number' ),
            array( 'name' => 'max_width',   'label' => 'Largura máx (px)',      'type' => 'number' ),
            array( 'name' => 'direction',   'label' => 'Direção (column/row)',  'type' => 'select', 'options' => array( 'column' => 'Coluna (vertical)', 'row' => 'Linha (horizontal)' ) ),
            array( 'name' => 'gap',         'label' => 'Espaço entre itens (px)', 'type' => 'number' ),
            array( 'name' => 'align_items', 'label' => 'Alinhar itens',         'type' => 'select', 'options' => array( 'stretch' => 'Esticar', 'flex-start' => 'Topo', 'center' => 'Centro', 'flex-end' => 'Base' ) ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $defaults = $this->defaults();
        $s        = wp_parse_args( $settings, $defaults );

        $allowed_dirs = array( 'column', 'row' );
        $direction    = in_array( $s['direction'], $allowed_dirs, true ) ? $s['direction'] : 'column';

        $allowed_align = array( 'stretch', 'flex-start', 'center', 'flex-end' );
        $align_items   = in_array( $s['align_items'], $allowed_align, true ) ? $s['align_items'] : 'stretch';

        $flex_wrap = ( 'row' === $direction ) ? 'nowrap' : 'wrap';

        $bg_image_style = '';
        if ( ! empty( $s['bg_image'] ) ) {
            $allowed_sizes = array( 'cover', 'contain', 'auto' );
            $bg_size = in_array( $s['bg_size'], $allowed_sizes, true ) ? $s['bg_size'] : 'cover';
            $bg_image_style = sprintf(
                'background-image:url(%s);background-size:%s;background-position:center;background-repeat:no-repeat;',
                esc_url( $s['bg_image'] ),
                $bg_size
            );
        }

        $style = sprintf(
            'background-color:%s;%spadding:%spx;max-width:%spx;margin:0 auto;display:flex;flex-direction:%s;gap:%spx;align-items:%s;flex-wrap:%s;',
            esc_attr( $s['bg_color'] ),
            $bg_image_style,
            intval( $s['padding'] ),
            intval( $s['max_width'] ),
            $direction,
            intval( $s['gap'] ),
            $align_items,
            $flex_wrap
        );

        return sprintf(
            '<div class="vitrine-el-container vitrine-el-container--%s" style="%s">%s</div>',
            esc_attr( $direction ),
            $style,
            $children_html
        );
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Container() );
