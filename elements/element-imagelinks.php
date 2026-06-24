<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Imagelinks extends Vitrine_Element {

    public function slug() {
        return 'imagelinks';
    }

    public function label() {
        return 'Imagem + Links';
    }

    public function icon() {
        return 'dashicons-images-alt2';
    }

    public function defaults() {
        return array(
            'image'               => '',
            'image_height'        => '220',
            'image_fit'           => 'cover',
            'caption'             => 'Conferências de Saúde',
            'caption_bg'          => '#000000',
            'caption_color'       => '#ffffff',
            'caption_font_size'   => '16',
            'box_bg'              => '#e8e8e8',
            'box_title'           => 'Sites relacionados',
            'box_title_color'     => '#333333',
            'box_title_font_size' => '16',
            'link_color'          => '#333333',
            'link_font_size'      => '14',
            'separator_color'     => '#333333',
            'box_padding'         => '16',
            'items'               => array(
                array( 'label' => 'Ministério da Saúde', 'url' => '' ),
                array( 'label' => 'BVS MS', 'url' => '' ),
                array( 'label' => 'BVS Brasil', 'url' => '' ),
                array( 'label' => 'CNS', 'url' => '' ),
                array( 'label' => 'CONASS', 'url' => '' ),
                array( 'label' => 'CONASEMS', 'url' => '' ),
            ),
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'image',               'label' => 'Imagem',                      'type' => 'image' ),
            array( 'name' => 'image_height',        'label' => 'Altura da imagem (px)',       'type' => 'number' ),
            array( 'name' => 'image_fit',           'label' => 'Ajuste da imagem',            'type' => 'select', 'options' => array( 'cover' => 'Cover (preenche)', 'contain' => 'Contain (inteira)' ) ),
            array( 'name' => 'caption',             'label' => 'Legenda (faixa preta)',       'type' => 'text' ),
            array( 'name' => 'caption_bg',          'label' => 'Fundo da legenda',            'type' => 'color' ),
            array( 'name' => 'caption_color',       'label' => 'Cor da legenda',              'type' => 'color' ),
            array( 'name' => 'caption_font_size',   'label' => 'Tam. legenda (px)',           'type' => 'number' ),
            array( 'name' => 'box_bg',              'label' => 'Fundo da caixa de links',     'type' => 'color' ),
            array( 'name' => 'box_title',           'label' => 'Título da caixa',             'type' => 'text' ),
            array( 'name' => 'box_title_color',     'label' => 'Cor do título',               'type' => 'color' ),
            array( 'name' => 'box_title_font_size', 'label' => 'Tam. título (px)',            'type' => 'number' ),
            array( 'name' => 'separator_color',     'label' => 'Cor do separador',            'type' => 'color' ),
            array( 'name' => 'link_color',          'label' => 'Cor dos links',               'type' => 'color' ),
            array( 'name' => 'link_font_size',      'label' => 'Tam. links (px)',             'type' => 'number' ),
            array( 'name' => 'box_padding',         'label' => 'Espaçamento interno (px)',    'type' => 'number' ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $image             = $s['image'] ? esc_url( $s['image'] ) : '';
        $image_height      = max( 80, intval( $s['image_height'] ) );
        $image_fit         = ( 'contain' === $s['image_fit'] ) ? 'contain' : 'cover';
        $caption           = esc_html( $s['caption'] );
        $caption_bg        = esc_attr( $s['caption_bg'] );
        $caption_color     = esc_attr( $s['caption_color'] );
        $caption_font_size = max( 10, intval( $s['caption_font_size'] ) ) . 'px';
        $box_bg            = esc_attr( $s['box_bg'] );
        $box_title         = esc_html( $s['box_title'] );
        $box_title_color   = esc_attr( $s['box_title_color'] );
        $box_title_size    = max( 10, intval( $s['box_title_font_size'] ) ) . 'px';
        $link_color        = esc_attr( $s['link_color'] );
        $link_font_size    = max( 10, intval( $s['link_font_size'] ) ) . 'px';
        $separator_color   = esc_attr( $s['separator_color'] );
        $box_padding       = max( 0, intval( $s['box_padding'] ) ) . 'px';

        $items = is_array( $s['items'] ) ? $s['items'] : array();

        $wrap_style = '--il-img-h:' . $image_height . 'px;'
            . '--il-img-fit:' . $image_fit . ';'
            . '--il-caption-bg:' . $caption_bg . ';'
            . '--il-caption-color:' . $caption_color . ';'
            . '--il-caption-size:' . $caption_font_size . ';'
            . '--il-box-bg:' . $box_bg . ';'
            . '--il-box-title-color:' . $box_title_color . ';'
            . '--il-box-title-size:' . $box_title_size . ';'
            . '--il-link-color:' . $link_color . ';'
            . '--il-link-size:' . $link_font_size . ';'
            . '--il-separator-color:' . $separator_color . ';'
            . '--il-box-padding:' . $box_padding . ';';

        $output  = '<div class="vitrine-el-imagelinks" style="' . esc_attr( $wrap_style ) . '">';
        $output .= '<div class="vitrine-imagelinks-hero">';

        $output .= '<div class="vitrine-imagelinks-media" style="height:' . $image_height . 'px;min-height:' . $image_height . 'px;">';
        if ( $image ) {
            $img_style = 'object-fit:' . $image_fit . ';object-position:center;width:100%;height:100%;display:block;';
            $output   .= '<img src="' . $image . '" alt="" class="vitrine-imagelinks-img" style="' . esc_attr( $img_style ) . '" />';
        } else {
            $output .= '<div class="vitrine-imagelinks-placeholder"><span class="dashicons dashicons-format-image"></span></div>';
        }
        $output .= '</div>';

        if ( $caption ) {
            $output .= '<div class="vitrine-imagelinks-caption" style="background:' . $caption_bg . ';color:' . $caption_color . ';font-size:' . $caption_font_size . ';">'
                . $caption
                . '</div>';
        }

        $output .= '</div>';

        $output .= '<div class="vitrine-imagelinks-box" style="background:' . $box_bg . ';padding:' . $box_padding . ';">';

        if ( $box_title ) {
            $output .= '<h3 class="vitrine-imagelinks-box-title" style="color:' . $box_title_color . ';font-size:' . $box_title_size . ';">'
                . $box_title
                . '</h3>';
        }

        if ( $box_title || ! empty( $items ) ) {
            $output .= '<hr class="vitrine-imagelinks-separator" style="border-color:' . $separator_color . ';" />';
        }

        if ( ! empty( $items ) ) {
            $output .= '<ul class="vitrine-imagelinks-list">';
            foreach ( $items as $link_item ) {
                $label = isset( $link_item['label'] ) ? esc_html( $link_item['label'] ) : '';
                $url   = isset( $link_item['url'] ) ? esc_url( $link_item['url'] ) : '';
                if ( ! $label ) {
                    continue;
                }
                $output .= '<li class="vitrine-imagelinks-item">';
                if ( $url ) {
                    $output .= '<a href="' . $url . '" class="vitrine-imagelinks-link" style="color:' . $link_color . ';font-size:' . $link_font_size . ';">' . $label . '</a>';
                } else {
                    $output .= '<span class="vitrine-imagelinks-link vitrine-imagelinks-link--text" style="color:' . $link_color . ';font-size:' . $link_font_size . ';">' . $label . '</span>';
                }
                $output .= '</li>';
            }
            $output .= '</ul>';
        }

        $output .= '</div>';
        $output .= '</div>';

        return $output;
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Imagelinks() );
