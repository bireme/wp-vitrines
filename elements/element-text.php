<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Text extends Vitrine_Element {

    public function slug() {
        return 'text';
    }

    public function label() {
        return 'Texto';
    }

    public function icon() {
        return 'dashicons-editor-paragraph';
    }

    public function defaults() {
        return array(
            'content'   => 'Escreva seu texto aqui...',
            'align'     => 'left',
            'color'     => '#555555',
            'font_size' => '16',
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'content',   'label' => 'Conteúdo',       'type' => 'textarea' ),
            array( 'name' => 'align',     'label' => 'Alinhamento',    'type' => 'text' ),
            array( 'name' => 'color',     'label' => 'Cor',            'type' => 'color' ),
            array( 'name' => 'font_size', 'label' => 'Tamanho (px)',   'type' => 'number' ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $defaults = $this->defaults();
        $s        = wp_parse_args( $settings, $defaults );

        $style = sprintf(
            'text-align:%s;color:%s;font-size:%spx;',
            esc_attr( $s['align'] ),
            esc_attr( $s['color'] ),
            intval( $s['font_size'] )
        );

        return sprintf(
            '<div class="vitrine-el-text" style="%s">%s</div>',
            $style,
            wp_kses_post( $s['content'] )
        );
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Text() );
