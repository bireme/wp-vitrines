<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Itemgrid extends Vitrine_Element {

    public function slug() {
        return 'itemgrid';
    }

    public function label() {
        return 'Grade de Itens';
    }

    public function icon() {
        return 'dashicons-grid-view';
    }

    public function defaults() {
        return array(
            'columns'        => '3',
            'gap'            => '24',
            'card_bg'        => '#ffffff',
            'card_radius'    => '12',
            'card_padding'   => '20',
            'card_shadow'    => '8',
            'image_height'   => '180',
            'image_fit'      => 'cover',
            'image_radius'   => '8',
            'title_color'    => '#1a1a1a',
            'title_size'     => '20',
            'title_weight'   => '700',
            'desc_color'     => '#555555',
            'desc_size'      => '15',
            'desc_weight'    => '400',
            'text_align'     => 'left',
            'items'          => array(),
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'columns',      'label' => 'Colunas',                    'type' => 'number' ),
            array( 'name' => 'gap',          'label' => 'Espaçamento (px)',           'type' => 'number' ),
            array( 'name' => 'card_bg',      'label' => 'Fundo do card',              'type' => 'color' ),
            array( 'name' => 'card_radius',  'label' => 'Arredondamento do card (px)', 'type' => 'number' ),
            array( 'name' => 'card_padding', 'label' => 'Padding do card (px)',       'type' => 'number' ),
            array( 'name' => 'card_shadow',  'label' => 'Sombra do card',             'type' => 'range', 'min' => 0, 'max' => 100 ),
            array( 'name' => 'image_height', 'label' => 'Altura da imagem (px)',      'type' => 'number' ),
            array( 'name' => 'image_fit',    'label' => 'Ajuste da imagem',           'type' => 'select', 'options' => array( 'cover' => 'Cover', 'contain' => 'Contain' ) ),
            array( 'name' => 'image_radius', 'label' => 'Arred. da imagem (px)',      'type' => 'number' ),
            array( 'name' => 'title_color',  'label' => 'Cor do título (padrão)',     'type' => 'color' ),
            array( 'name' => 'title_size',   'label' => 'Tam. título padrão (px)',    'type' => 'number' ),
            array( 'name' => 'title_weight', 'label' => 'Peso do título (padrão)',    'type' => 'select', 'options' => $this->weight_options() ),
            array( 'name' => 'desc_color',   'label' => 'Cor da descrição (padrão)',  'type' => 'color' ),
            array( 'name' => 'desc_size',    'label' => 'Tam. descrição padrão (px)', 'type' => 'number' ),
            array( 'name' => 'desc_weight',  'label' => 'Peso da descrição (padrão)', 'type' => 'select', 'options' => $this->weight_options() ),
            array( 'name' => 'text_align',   'label' => 'Alinhamento do texto',       'type' => 'select', 'options' => array( 'left' => 'Esquerda', 'center' => 'Centro', 'right' => 'Direita' ) ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $columns      = max( 1, min( 6, intval( $s['columns'] ) ) );
        $gap          = max( 0, intval( $s['gap'] ) );
        $card_bg      = esc_attr( $s['card_bg'] );
        $card_radius  = max( 0, intval( $s['card_radius'] ) );
        $card_padding = max( 0, intval( $s['card_padding'] ) );
        $card_shadow  = $this->box_shadow( $s['card_shadow'] );
        $image_height = max( 0, intval( $s['image_height'] ) );
        $image_fit    = ( 'contain' === $s['image_fit'] ) ? 'contain' : 'cover';
        $image_radius = max( 0, intval( $s['image_radius'] ) );
        $title_color  = esc_attr( $s['title_color'] );
        $title_size   = max( 10, intval( $s['title_size'] ) );
        $title_weight = $this->sanitize_weight( $s['title_weight'] );
        $desc_color   = esc_attr( $s['desc_color'] );
        $desc_size    = max( 10, intval( $s['desc_size'] ) );
        $desc_weight  = $this->sanitize_weight( $s['desc_weight'] );
        $text_align   = in_array( $s['text_align'], array( 'left', 'center', 'right' ), true ) ? $s['text_align'] : 'left';

        $items = is_array( $s['items'] ) ? array_values( $s['items'] ) : array();

        $wrap_style = '--ig-cols:' . $columns . ';'
            . '--ig-gap:' . $gap . 'px;'
            . '--ig-card-bg:' . $card_bg . ';'
            . '--ig-card-radius:' . $card_radius . 'px;'
            . '--ig-card-padding:' . $card_padding . 'px;'
            . '--ig-card-shadow:' . esc_attr( $card_shadow ) . ';'
            . '--ig-img-h:' . $image_height . 'px;'
            . '--ig-img-fit:' . $image_fit . ';'
            . '--ig-img-radius:' . $image_radius . 'px;'
            . '--ig-title-color:' . $title_color . ';'
            . '--ig-title-size:' . $title_size . 'px;'
            . '--ig-title-weight:' . $title_weight . ';'
            . '--ig-desc-color:' . $desc_color . ';'
            . '--ig-desc-size:' . $desc_size . 'px;'
            . '--ig-desc-weight:' . $desc_weight . ';'
            . '--ig-text-align:' . $text_align . ';';

        $output  = '<div class="vitrine-el-itemgrid" style="' . esc_attr( $wrap_style ) . '">';
        $output .= '<div class="vitrine-ig-grid">';

        foreach ( $items as $it ) {
            $output .= $this->render_card( $it, $title_color, $title_size, $title_weight, $desc_color, $desc_size, $desc_weight, $image_height, $image_fit, $image_radius );
        }

        $output .= '</div></div>';

        return $output;
    }

    private function render_card( $it, $def_title_color, $def_title_size, $def_title_weight, $def_desc_color, $def_desc_size, $def_desc_weight, $image_height, $image_fit, $image_radius ) {
        $image       = ! empty( $it['image'] ) ? esc_url( $it['image'] ) : '';
        $title       = isset( $it['title'] ) ? esc_html( $it['title'] ) : '';
        $description = isset( $it['description'] ) ? wp_kses_post( $it['description'] ) : '';
        $link        = ! empty( $it['link'] ) ? esc_url( $it['link'] ) : '';
        $new_tab     = ! empty( $it['link_new_tab'] ) && '1' === (string) $it['link_new_tab'];

        $title_color  = ! empty( $it['title_color'] ) ? esc_attr( $it['title_color'] ) : $def_title_color;
        $title_size   = ! empty( $it['title_size'] ) ? max( 10, intval( $it['title_size'] ) ) . 'px' : $def_title_size . 'px';
        $title_weight = ! empty( $it['title_weight'] ) ? $this->sanitize_weight( $it['title_weight'] ) : $def_title_weight;
        $desc_color   = ! empty( $it['desc_color'] ) ? esc_attr( $it['desc_color'] ) : $def_desc_color;
        $desc_size    = ! empty( $it['desc_size'] ) ? max( 10, intval( $it['desc_size'] ) ) . 'px' : $def_desc_size . 'px';
        $desc_weight  = ! empty( $it['desc_weight'] ) ? $this->sanitize_weight( $it['desc_weight'] ) : $def_desc_weight;

        $title_style = 'color:' . $title_color . ';font-size:' . $title_size . ';font-weight:' . $title_weight . ';';
        $desc_style  = 'color:' . $desc_color . ';font-size:' . $desc_size . ';font-weight:' . $desc_weight . ';';

        $inner  = '';
        if ( $image && $image_height > 0 ) {
            $img_style = 'object-fit:' . $image_fit . ';border-radius:' . intval( $image_radius ) . 'px;';
            $inner    .= '<div class="vitrine-ig-card-media" style="height:' . intval( $image_height ) . 'px;">'
                . '<img src="' . $image . '" alt="" class="vitrine-ig-card-img" style="' . esc_attr( $img_style ) . '" />'
                . '</div>';
        }

        $inner .= '<div class="vitrine-ig-card-body">';
        if ( $title ) {
            $inner .= '<h3 class="vitrine-ig-card-title" style="' . esc_attr( $title_style ) . '">' . $title . '</h3>';
        }
        if ( $description ) {
            $inner .= '<div class="vitrine-ig-card-desc" style="' . esc_attr( $desc_style ) . '">' . $description . '</div>';
        }
        $inner .= '</div>';

        if ( ! $inner ) {
            return '';
        }

        $card_open = '<div class="vitrine-ig-card">';
        $card_close = '</div>';

        if ( $link ) {
            $target = $new_tab ? ' target="_blank" rel="noopener noreferrer"' : '';
            return $card_open . '<a href="' . $link . '" class="vitrine-ig-card-link"' . $target . '>' . $inner . '</a>' . $card_close;
        }

        return $card_open . $inner . $card_close;
    }

    private function weight_options() {
        return array(
            '300' => 'Leve (300)',
            '400' => 'Normal (400)',
            '500' => 'Médio (500)',
            '600' => 'Semi-negrito (600)',
            '700' => 'Negrito (700)',
            '800' => 'Extra-negrito (800)',
        );
    }

    private function sanitize_weight( $weight ) {
        $allowed = array( '300', '400', '500', '600', '700', '800' );
        $weight  = (string) $weight;
        return in_array( $weight, $allowed, true ) ? $weight : '400';
    }

    private function box_shadow( $intensity ) {
        $i = max( 0, min( 100, intval( $intensity ) ) );
        if ( $i <= 0 ) {
            return 'none';
        }
        $y     = max( 1, (int) round( $i * 0.08 ) );
        $blur  = max( 2, (int) round( $i * 0.32 ) );
        $alpha = round( $i * 0.0012, 3 );
        return '0 ' . $y . 'px ' . $blur . 'px rgba(0,0,0,' . $alpha . ')';
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Itemgrid() );
