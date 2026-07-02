<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Aranha extends Vitrine_Element {

    public function slug() {
        return 'aranha';
    }

    public function label() {
        return 'Aranha';
    }

    public function icon() {
        return 'dashicons-networking';
    }

    public function defaults() {
        return array(
            'center_image'    => '',
            'center_size'     => '220',
            'center_bg_color' => '#ffffff',
            'bg_color'        => '#ffffff',
            'line_color'      => '#8c8c8c',
            'text_color'      => '#333333',
            'icon_size'       => '40',
            'icon_color'      => '#333333',
            'left_items'      => array(),
            'right_items'     => array(),
            'top_items'       => array(),
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'center_image',    'label' => 'Imagem Central',         'type' => 'image' ),
            array( 'name' => 'center_size',     'label' => 'Tamanho central (px)',   'type' => 'number' ),
            array( 'name' => 'center_bg_color', 'label' => 'Cor de fundo do centro', 'type' => 'color' ),
            array( 'name' => 'bg_color',        'label' => 'Cor de fundo',           'type' => 'color' ),
            array( 'name' => 'line_color',      'label' => 'Cor das linhas',         'type' => 'color' ),
            array( 'name' => 'text_color',      'label' => 'Cor do texto',           'type' => 'color' ),
            array( 'name' => 'icon_size',       'label' => 'Tamanho ícones (px)',    'type' => 'number' ),
            array( 'name' => 'icon_color',      'label' => 'Cor dos ícones',         'type' => 'color' ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $center_size = max( 80, intval( $s['center_size'] ) );
        $icon_size   = max( 16, intval( $s['icon_size'] ) );
        $icon_color  = esc_attr( $s['icon_color'] );
        $line_color  = esc_attr( $s['line_color'] );
        $text_color  = esc_attr( $s['text_color'] );
        $bg_color    = esc_attr( $s['bg_color'] );
        $center_bg   = esc_attr( $s['center_bg_color'] );

        $left_items  = is_array( $s['left_items'] ) ? $s['left_items'] : array();
        $right_items = is_array( $s['right_items'] ) ? $s['right_items'] : array();
        $top_items   = is_array( $s['top_items'] ) ? $s['top_items'] : array();
        $left_n      = count( $left_items );
        $right_n     = count( $right_items );
        $top_n       = count( $top_items );

        $center_cls = 'vitrine-aranha__center';
        if ( ! $left_n )  $center_cls .= ' vitrine-aranha__center--no-left';
        if ( ! $right_n ) $center_cls .= ' vitrine-aranha__center--no-right';

        $output = '<div class="vitrine-el-aranha" style="--aranha-line:' . $line_color . ';background:' . $bg_color . ';color:' . $text_color . ';">';

        // ── Topo ──
        if ( $top_n ) {
            $output .= '<div class="vitrine-aranha__top-row">';
            foreach ( $top_items as $idx => $item ) {
                $output .= $this->render_top_item( $item, $icon_size, $icon_color, $idx, $top_n );
            }
            $output .= '</div>';
        }

        // ── Linha principal (esquerda + centro + direita) ──
        $output .= '<div class="vitrine-aranha__main-row">';

        // ── Lado Esquerdo ──
        $output .= '<div class="vitrine-aranha__side vitrine-aranha__side--left">';
        foreach ( $left_items as $idx => $item ) {
            $output .= $this->render_item( $item, 'left', $icon_size, $icon_color, $idx, $left_n );
        }
        if ( ! $left_n ) {
            $output .= '<div class="vitrine-aranha__item vitrine-aranha__item--empty"></div>';
        }
        $output .= '</div>';

        // ── Centro (cresce com os itens laterais via align-self:stretch + aspect-ratio) ──
        $output .= '<div class="' . $center_cls . '" style="min-width:' . $center_size . 'px;min-height:' . $center_size . 'px;max-width:500px;max-height:500px;background-color:' . $center_bg . ';border-radius:50%;">';
        if ( ! empty( $s['center_image'] ) ) {
            $output .= '<img src="' . esc_url( $s['center_image'] ) . '" alt="" />';
        } else {
            $output .= '<div class="vitrine-aranha__center-placeholder"></div>';
        }
        $output .= '</div>';

        // ── Lado Direito ──
        $output .= '<div class="vitrine-aranha__side vitrine-aranha__side--right">';
        foreach ( $right_items as $idx => $item ) {
            $output .= $this->render_item( $item, 'right', $icon_size, $icon_color, $idx, $right_n );
        }
        if ( ! $right_n ) {
            $output .= '<div class="vitrine-aranha__item vitrine-aranha__item--empty"></div>';
        }
        $output .= '</div>';

        $output .= '</div>'; // fecha main-row
        $output .= '</div>'; // fecha el-aranha
        return $output;
    }

    private function render_item( $item, $side, $icon_size, $icon_color, $index = 0, $total = 1 ) {
        $text = wp_kses_post( isset( $item['text'] ) ? $item['text'] : '' );
        $icon = isset( $item['icon'] ) ? $item['icon'] : '';
        $link = isset( $item['link'] ) ? esc_url( $item['link'] ) : '';

        $mid = ( $total - 1 ) / 2;
        if ( $total <= 1 || abs( $index - $mid ) < 0.01 ) {
            $bend = 'straight';
        } elseif ( $index < $mid ) {
            $bend = 'down';
        } else {
            $bend = 'up';
        }

        $output = '<div class="vitrine-aranha__item">';

        if ( 'left' === $side ) {
            $output .= '<div class="vitrine-aranha__card">';
            $output .= $this->render_text( $text, $link );
            $output .= $this->render_icon( $icon, $icon_size, $icon_color );
            $output .= '</div>';
            $output .= $this->render_arm( $bend, 'left' );
        } else {
            $output .= $this->render_arm( $bend, 'right' );
            $output .= '<div class="vitrine-aranha__card">';
            $output .= $this->render_icon( $icon, $icon_size, $icon_color );
            $output .= $this->render_text( $text, $link );
            $output .= '</div>';
        }

        $output .= '</div>';
        return $output;
    }

    private function render_top_item( $item, $icon_size, $icon_color, $index = 0, $total = 1 ) {
        $text = wp_kses_post( isset( $item['text'] ) ? $item['text'] : '' );
        $icon = isset( $item['icon'] ) ? $item['icon'] : '';
        $link = isset( $item['link'] ) ? esc_url( $item['link'] ) : '';

        // Bend: left / right / straight (vertical) based on position
        $mid = ( $total - 1 ) / 2;
        if ( $total <= 1 || abs( $index - $mid ) < 0.01 ) {
            $bend = 'straight';
        } elseif ( $index < $mid ) {
            $bend = 'left';
        } else {
            $bend = 'right';
        }

        $output = '<div class="vitrine-aranha__top-item">';
        $output .= '<div class="vitrine-aranha__card">';
        $output .= $this->render_icon( $icon, $icon_size, $icon_color );
        $output .= $this->render_text( $text, $link );
        $output .= '</div>';
        $output .= $this->render_top_arm( $bend );
        $output .= '</div>';
        return $output;
    }

    private function render_top_arm( $bend ) {
        if ( 'straight' === $bend ) {
            $d = 'M 50,0 L 50,100';
        } elseif ( 'left' === $bend ) {
            $d = 'M 50,0 C 50,50 100,50 100,100';
        } else {
            $d = 'M 50,0 C 50,50 0,50 0,100';
        }
        return '<div class="vitrine-aranha__top-arm">' .
            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">' .
            '<path d="' . esc_attr( $d ) . '" fill="none" stroke="var(--aranha-line)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" />' .
            '</svg></div>';
    }

    private function render_arm( $bend, $side ) {
        if ( 'left' === $side ) {
            if ( 'straight' === $bend )   { $d = 'M 0,50 L 100,50'; }
            elseif ( 'down' === $bend )   { $d = 'M 0,50 C 50,50 50,100 100,100'; }
            else                          { $d = 'M 0,50 C 50,50 50,0 100,0'; }
        } else {
            if ( 'straight' === $bend )   { $d = 'M 100,50 L 0,50'; }
            elseif ( 'down' === $bend )   { $d = 'M 100,50 C 50,50 50,100 0,100'; }
            else                          { $d = 'M 100,50 C 50,50 50,0 0,0'; }
        }
        return '<div class="vitrine-aranha__arm">' .
            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">' .
            '<path d="' . esc_attr( $d ) . '" fill="none" stroke="var(--aranha-line)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" />' .
            '</svg></div>';
    }

    private function render_text( $text, $link ) {
        if ( $link ) {
            return '<a href="' . $link . '" class="vitrine-aranha__text">' . $text . '</a>';
        }
        return '<span class="vitrine-aranha__text">' . $text . '</span>';
    }

    private function render_icon( $icon, $icon_size, $icon_color = '' ) {
        if ( ! $icon ) {
            return '';
        }

        $color_style = $icon_color ? 'color:' . esc_attr( $icon_color ) . ';' : '';

        // Dashicons (WordPress built-in)
        if ( strpos( $icon, 'dashicons-' ) === 0 ) {
            return '<span class="dashicons ' . esc_attr( $icon ) . ' vitrine-aranha__icon" style="font-size:' . $icon_size . 'px;width:' . $icon_size . 'px;height:' . $icon_size . 'px;' . $color_style . '"></span>';
        }

        // Font Awesome (fas, far, fab, fal, fad…)
        if ( preg_match( '/^fa[srlbd]?\s/', $icon ) ) {
            return '<i class="' . esc_attr( $icon ) . ' vitrine-aranha__icon" style="font-size:' . $icon_size . 'px;' . $color_style . '"></i>';
        }

        // Imagem (URL)
        return '<img class="vitrine-aranha__icon" src="' . esc_url( $icon ) . '" alt="" style="width:' . $icon_size . 'px;height:' . $icon_size . 'px;" />';
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Aranha() );
