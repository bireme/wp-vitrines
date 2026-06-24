<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Textimage extends Vitrine_Element {

    public function slug() {
        return 'textimage';
    }

    public function label() {
        return 'Texto + Imagem';
    }

    public function icon() {
        return 'dashicons-align-left';
    }

    public function defaults() {
        return array(
            'title'             => 'Título do bloco',
            'title_tag'         => 'h2',
            'title_color'       => '#1a1a1a',
            'title_font_size'   => '28',
            'content'           => '<p>Escreva o conteúdo aqui. Use negrito, listas e links para formatar o texto.</p>',
            'content_color'     => '#555555',
            'content_font_size' => '16',
            'image'             => '',
            'image_position'    => 'right',
            'image_width'       => '42',
            'bg_color'          => '#f8f8f6',
            'padding'           => '32',
            'border_radius'     => '8',
            'gap'               => '24',
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'title',             'label' => 'Título',                  'type' => 'text' ),
            array( 'name' => 'title_tag',         'label' => 'Tag do título',           'type' => 'select', 'options' => array( 'h2' => 'H2', 'h3' => 'H3', 'h4' => 'H4' ) ),
            array( 'name' => 'title_color',       'label' => 'Cor do título',           'type' => 'color' ),
            array( 'name' => 'title_font_size',   'label' => 'Tam. título (px)',        'type' => 'number' ),
            array( 'name' => 'content',           'label' => 'Texto',                   'type' => 'textarea' ),
            array( 'name' => 'content_color',     'label' => 'Cor do texto',            'type' => 'color' ),
            array( 'name' => 'content_font_size', 'label' => 'Tam. texto (px)',         'type' => 'number' ),
            array( 'name' => 'image',             'label' => 'Imagem',                  'type' => 'image' ),
            array( 'name' => 'image_position',    'label' => 'Posição da imagem',       'type' => 'select', 'options' => array( 'right' => 'Direita', 'left' => 'Esquerda' ) ),
            array( 'name' => 'image_width',       'label' => 'Largura imagem (%)',      'type' => 'number' ),
            array( 'name' => 'bg_color',          'label' => 'Cor de fundo',            'type' => 'color' ),
            array( 'name' => 'padding',           'label' => 'Espaçamento interno (px)', 'type' => 'number' ),
            array( 'name' => 'border_radius',     'label' => 'Arredondamento (px)',     'type' => 'number' ),
            array( 'name' => 'gap',               'label' => 'Espaço texto/imagem (px)', 'type' => 'number' ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $allowed_tags = array( 'h2', 'h3', 'h4' );
        $title_tag    = in_array( $s['title_tag'], $allowed_tags, true ) ? $s['title_tag'] : 'h2';

        $title             = esc_html( $s['title'] );
        $title_color       = esc_attr( $s['title_color'] );
        $title_font_size   = max( 12, intval( $s['title_font_size'] ) ) . 'px';
        $content           = wp_kses_post( $s['content'] );
        $content_color     = esc_attr( $s['content_color'] );
        $content_font_size = max( 10, intval( $s['content_font_size'] ) ) . 'px';
        $image             = $s['image'] ? esc_url( $s['image'] ) : '';
        $image_width       = max( 20, min( 60, intval( $s['image_width'] ) ) );
        $text_width        = 100 - $image_width;
        $bg_color          = esc_attr( $s['bg_color'] );
        $padding           = max( 0, intval( $s['padding'] ) ) . 'px';
        $border_radius     = max( 0, intval( $s['border_radius'] ) ) . 'px';
        $gap               = max( 0, intval( $s['gap'] ) ) . 'px';
        $image_position    = ( 'left' === $s['image_position'] ) ? 'left' : 'right';

        $wrap_style = sprintf(
            'background:%s;padding:%s;border-radius:%s;--ti-gap:%s;--ti-img-w:%s%%;--ti-text-w:%s%%;',
            $bg_color,
            $padding,
            $border_radius,
            $gap,
            $image_width,
            $text_width
        );

        $inner_class = 'vitrine-textimage-inner';
        if ( 'left' === $image_position ) {
            $inner_class .= ' vitrine-textimage-inner--image-left';
        }

        $text_html  = '<div class="vitrine-textimage-content">';
        if ( $title ) {
            $text_html .= sprintf(
                '<%1$s class="vitrine-textimage-title" style="color:%2$s;font-size:%3$s;">%4$s</%1$s>',
                $title_tag,
                $title_color,
                $title_font_size,
                $title
            );
        }
        if ( $content ) {
            $text_html .= sprintf(
                '<div class="vitrine-textimage-body" style="color:%1$s;font-size:%2$s;">%3$s</div>',
                $content_color,
                $content_font_size,
                $content
            );
        }
        $text_html .= '</div>';

        $media_html = '<div class="vitrine-textimage-media">';
        if ( $image ) {
            $media_html .= '<img src="' . $image . '" alt="" class="vitrine-textimage-img" />';
        } else {
            $media_html .= '<div class="vitrine-textimage-placeholder"><span class="dashicons dashicons-format-image"></span></div>';
        }
        $media_html .= '</div>';

        $output  = '<div class="vitrine-el-textimage" style="' . esc_attr( $wrap_style ) . '">';
        $output .= '<div class="' . esc_attr( $inner_class ) . '">';
        $output .= $text_html . $media_html;
        $output .= '</div></div>';

        return $output;
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Textimage() );
