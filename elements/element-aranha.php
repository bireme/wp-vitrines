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
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $center_size = max( 80, intval( $s['center_size'] ) );
        $icon_size   = max( 16, intval( $s['icon_size'] ) );
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
                $output .= $this->render_top_item( $item, $icon_size, $idx, $top_n );
            }
            $output .= '</div>';
        }

        // ── Linha principal (esquerda + centro + direita) ──
        $output .= '<div class="vitrine-aranha__main-row">';

        // ── Lado Esquerdo ──
        $output .= '<div class="vitrine-aranha__side vitrine-aranha__side--left">';
        foreach ( $left_items as $idx => $item ) {
            $output .= $this->render_item( $item, 'left', $icon_size, $idx, $left_n );
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
            $output .= $this->render_item( $item, 'right', $icon_size, $idx, $right_n );
        }
        if ( ! $right_n ) {
            $output .= '<div class="vitrine-aranha__item vitrine-aranha__item--empty"></div>';
        }
        $output .= '</div>';

        $output .= '</div>'; // fecha main-row
        $output .= '</div>'; // fecha el-aranha
        return $output;
    }

    private function render_item( $item, $side, $icon_size, $index = 0, $total = 1 ) {
        $text = wp_kses_post( isset( $item['text'] ) ? $item['text'] : '' );
        $icon = isset( $item['icon'] ) ? esc_url( $item['icon'] ) : '';
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
            $output .= $this->render_icon( $icon, $icon_size );
            $output .= '</div>';
            $output .= $this->render_arm( $bend, 'left' );
        } else {
            $output .= $this->render_arm( $bend, 'right' );
            $output .= '<div class="vitrine-aranha__card">';
            $output .= $this->render_icon( $icon, $icon_size );
            $output .= $this->render_text( $text, $link );
            $output .= '</div>';
        }

        $output .= '</div>';
        return $output;
    }

    private function render_top_item( $item, $icon_size, $index = 0, $total = 1 ) {
        $text = wp_kses_post( isset( $item['text'] ) ? $item['text'] : '' );
        $icon = isset( $item['icon'] ) ? esc_url( $item['icon'] ) : '';
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
        $output .= $this->render_icon( $icon, $icon_size );
        $output .= $this->render_text( $text, $link );
        $output .= '</div>';
        $output .= $this->render_top_arm( $bend );
        $output .= '</div>';
        return $output;
    }

    private function render_top_arm( $bend ) {
        $output = '<div class="vitrine-aranha__top-arm">';

        if ( $bend === 'straight' ) {
            // Vertical line straight down
            $output .= '<div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:var(--aranha-line);transform:translateX(-50%);"></div>';
        } else {
            // Segment 1: vertical down from card to midpoint
            $output .= '<div style="position:absolute;left:50%;top:0;height:50%;width:2px;background:var(--aranha-line);transform:translateX(-50%);"></div>';

            // Segment 2: horizontal from midpoint toward center
            $hx = ( 'left' === $bend ) ? 'left:50%;right:0;' : 'left:0;right:50%;';
            $output .= '<div style="position:absolute;top:50%;' . $hx . 'height:2px;background:var(--aranha-line);"></div>';

            // Segment 3: vertical from bend down to circle top
            $vx = ( 'left' === $bend ) ? 'right:0;' : 'left:0;';
            $output .= '<div style="position:absolute;top:50%;bottom:0;' . $vx . 'width:2px;background:var(--aranha-line);transform:translateX(-50%);"></div>';
        }

        $output .= '</div>';
        return $output;
    }

    private function render_arm( $bend, $side ) {
        $output = '<div class="vitrine-aranha__arm">';

        if ( $bend === 'straight' ) {
            $output .= '<div style="position:absolute;top:50%;left:0;right:0;height:2px;background:var(--aranha-line);transform:translateY(-50%);"></div>';
        } else {
            // Segment 1: horizontal from card to midpoint
            $h1 = ( 'left' === $side )
                ? 'left:0;width:50%;'
                : 'right:0;width:50%;';
            $output .= '<div style="position:absolute;top:50%;' . $h1 . 'height:2px;background:var(--aranha-line);"></div>';

            // Segment 2: vertical from midpoint toward center
            $vx = ( 'left' === $side ) ? 'left:50%;' : 'right:50%;';
            $vy = ( 'down' === $bend )
                ? 'top:50%;bottom:0;'
                : 'top:0;bottom:50%;';
            $output .= '<div style="position:absolute;' . $vx . $vy . 'width:2px;background:var(--aranha-line);transform:translateX(-50%);"></div>';

            // Segment 3: horizontal from bend to circle side
            $h2x = ( 'left' === $side ) ? 'left:50%;right:0;' : 'left:0;right:50%;';
            $h2y = ( 'down' === $bend ) ? 'bottom:0;' : 'top:0;';
            $output .= '<div style="position:absolute;' . $h2y . $h2x . 'height:2px;background:var(--aranha-line);"></div>';
        }

        $output .= '</div>';
        return $output;
    }

    private function render_text( $text, $link ) {
        if ( $link ) {
            return '<a href="' . $link . '" class="vitrine-aranha__text">' . $text . '</a>';
        }
        return '<span class="vitrine-aranha__text">' . $text . '</span>';
    }

    private function render_icon( $icon, $icon_size ) {
        if ( $icon ) {
            return '<img class="vitrine-aranha__icon" src="' . $icon . '" alt="" style="width:' . $icon_size . 'px;height:' . $icon_size . 'px;" />';
        }
        return '';
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Aranha() );
