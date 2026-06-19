<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Aranha2 extends Vitrine_Element {

    private static $uid = 0;

    public function slug() {
        return 'aranha2';
    }

    public function label() {
        return 'Aranha Circular';
    }

    public function icon() {
        return 'dashicons-chart-pie';
    }

    public function defaults() {
        return array(
            'center_image'    => '',
            'center_size'     => '160',
            'center_label'    => '',
            'center_bg_color' => '#ffffff',
            'bg_color'        => '#f8f9fa',
            'line_color'      => '#2e7d32',
            'card_bg'         => '#ffffff',
            'card_border'     => '#2e7d32',
            'text_color'      => '#1d2327',
            'icon_size'       => '36',
            'radius'          => '200',
            'items'           => array(),
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'center_image',    'label' => 'Imagem Central',        'type' => 'image' ),
            array( 'name' => 'center_size',     'label' => 'Tamanho central (px)',  'type' => 'number' ),
            array( 'name' => 'center_label',    'label' => 'Rótulo central',        'type' => 'text' ),
            array( 'name' => 'center_bg_color', 'label' => 'Cor de fundo centro',   'type' => 'color' ),
            array( 'name' => 'radius',          'label' => 'Raio orbital (px)',     'type' => 'number' ),
            array( 'name' => 'icon_size',       'label' => 'Tam. ícones (px)',      'type' => 'number' ),
            array( 'name' => 'line_color',      'label' => 'Cor das linhas',        'type' => 'color' ),
            array( 'name' => 'card_bg',         'label' => 'Cor fundo card',        'type' => 'color' ),
            array( 'name' => 'card_border',     'label' => 'Cor borda card',        'type' => 'color' ),
            array( 'name' => 'text_color',      'label' => 'Cor do texto',          'type' => 'color' ),
            array( 'name' => 'bg_color',        'label' => 'Cor de fundo',          'type' => 'color' ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        self::$uid++;
        $uid = 'a2-' . self::$uid;

        $items       = is_array( $s['items'] ) ? array_values( $s['items'] ) : array();
        $n           = count( $items );
        $center_size = max( 60, intval( $s['center_size'] ) );
        $radius      = max( 80, intval( $s['radius'] ) );
        $icon_size   = max( 16, intval( $s['icon_size'] ) );
        $line_color  = esc_attr( $s['line_color'] );
        $card_bg     = esc_attr( $s['card_bg'] );
        $card_border = esc_attr( $s['card_border'] );
        $text_color  = esc_attr( $s['text_color'] );
        $bg_color    = esc_attr( $s['bg_color'] );
        $center_bg   = esc_attr( $s['center_bg_color'] );
        $center_lbl  = esc_html( $s['center_label'] );

        // ── Stage sizing ──────────────────────────────────────────────────
        // Stage is a square: center_size + 2×radius + 2×card_overflow
        $card_overflow = 90; // px reserved on each side for card half-width
        $stage_px      = $center_size + 2 * $radius + 2 * $card_overflow;

        // All positions are expressed as % of stage_px so the layout
        // scales automatically when max-width kicks in on smaller screens.
        $r_pct  = round( $radius / $stage_px * 100, 4 );   // orbital radius in %
        $cs_pct = round( $center_size / $stage_px * 100, 4 ); // center diameter in %

        // ── Outer wrapper ─────────────────────────────────────────────────
        $output  = '<div class="vitrine-el-aranha2" style="background:' . $bg_color . ';">';
        $output .= '<div class="vitrine-aranha2__stage" style="max-width:' . $stage_px . 'px;">';

        // ── SVG connector lines ───────────────────────────────────────────
        // viewBox 0 0 100 100 — coordinates map directly to percentages.
        $output .= '<svg class="vitrine-aranha2__svg" xmlns="http://www.w3.org/2000/svg"'
            . ' viewBox="0 0 100 100" preserveAspectRatio="none"'
            . ' aria-hidden="true">';

        $output .= '<defs>';
        // Radial gradient: fades from transparent at center to full color at edge
        $output .= '<radialGradient id="' . $uid . '-lg" cx="50%" cy="50%" r="50%">';
        $output .= '<stop offset="0%" stop-color="' . $line_color . '" stop-opacity="0.15"/>';
        $output .= '<stop offset="60%" stop-color="' . $line_color . '" stop-opacity="0.6"/>';
        $output .= '<stop offset="100%" stop-color="' . $line_color . '" stop-opacity="1"/>';
        $output .= '</radialGradient>';
        $output .= '</defs>';

        for ( $i = 0; $i < $n; $i++ ) {
            $angle = - M_PI / 2 + $i * ( 2 * M_PI / max( 1, $n ) );
            $x     = 50 + $r_pct * cos( $angle );
            $y     = 50 + $r_pct * sin( $angle );

            // Quadratic Bézier — control point curves outward perpendicular to radius
            $dx    = $x - 50;
            $dy    = $y - 50;
            $len   = sqrt( $dx * $dx + $dy * $dy );
            $mid_x = ( 50 + $x ) / 2;
            $mid_y = ( 50 + $y ) / 2;
            $curve = $r_pct * 0.22;
            if ( $len > 0.01 ) {
                $ctrl_x = $mid_x + $curve * ( - $dy / $len );
                $ctrl_y = $mid_y + $curve * ( $dx / $len );
            } else {
                $ctrl_x = $mid_x;
                $ctrl_y = $mid_y;
            }

            $delay = number_format( $i * 0.08, 2 );

            $output .= sprintf(
                '<path d="M 50,50 Q %.3f,%.3f %.3f,%.3f"'
                . ' fill="none" stroke="url(#%s-lg)" stroke-width="0.6"'
                . ' stroke-linecap="round"'
                . ' class="vitrine-aranha2__path"'
                . ' style="animation-delay:%ss"/>',
                $ctrl_x, $ctrl_y, $x, $y,
                $uid,
                $delay
            );

            // Dot where line meets card
            $output .= sprintf(
                '<circle cx="%.3f" cy="%.3f" r="1.2" fill="%s"'
                . ' class="vitrine-aranha2__dot" style="animation-delay:%ss"/>',
                $x, $y, $line_color, $delay
            );
        }

        $output .= '</svg>';

        // ── Center circle ─────────────────────────────────────────────────
        $output .= '<div class="vitrine-aranha2__center"'
            . ' style="width:' . $cs_pct . '%;'
            . 'border-color:' . $line_color . ';'
            . 'background-color:' . $center_bg . ';">';

        if ( ! empty( $s['center_image'] ) ) {
            $output .= '<img src="' . esc_url( $s['center_image'] ) . '" alt="' . esc_attr( $center_lbl ) . '" />';
        } elseif ( $center_lbl ) {
            $output .= '<span class="vitrine-aranha2__center-label" style="color:' . $text_color . ';">'
                . $center_lbl . '</span>';
        } else {
            $output .= '<span class="vitrine-aranha2__center-placeholder">'
                . '<span class="dashicons dashicons-camera"></span></span>';
        }

        $output .= '</div>'; // center

        // ── Cards ─────────────────────────────────────────────────────────
        for ( $i = 0; $i < $n; $i++ ) {
            $item  = $items[ $i ];
            $angle = - M_PI / 2 + $i * ( 2 * M_PI / max( 1, $n ) );
            $x_pct = round( 50 + $r_pct * cos( $angle ), 4 );
            $y_pct = round( 50 + $r_pct * sin( $angle ), 4 );

            $text  = wp_kses_post( isset( $item['text'] ) ? $item['text'] : '' );
            $icon  = isset( $item['icon'] ) ? $item['icon'] : '';
            $link  = isset( $item['link'] ) ? esc_url( $item['link'] ) : '';
            $delay = number_format( $i * 0.08 + 0.3, 2 );

            $output .= '<div class="vitrine-aranha2__card"'
                . ' style="left:' . $x_pct . '%;top:' . $y_pct . '%;'
                . 'background:' . $card_bg . ';'
                . 'border-color:' . $card_border . ';'
                . 'color:' . $text_color . ';'
                . 'animation-delay:' . $delay . 's;">';

            $inner = '';

            if ( $icon ) {
                $inner .= '<span class="vitrine-aranha2__card-icon">'
                    . $this->render_icon( $icon, $icon_size ) . '</span>';
            }

            if ( $text ) {
                $inner .= '<span class="vitrine-aranha2__card-text">' . $text . '</span>';
            }

            if ( $link ) {
                $output .= '<a href="' . $link . '" class="vitrine-aranha2__card-link">' . $inner . '</a>';
            } else {
                $output .= $inner;
            }

            $output .= '</div>'; // card
        }

        // Empty state
        if ( ! $n ) {
            $output .= '<div class="vitrine-aranha2__empty">'
                . '<span class="dashicons dashicons-chart-pie"></span>'
                . '<p>Adicione itens no painel de configurações</p>'
                . '</div>';
        }

        $output .= '</div>'; // stage
        $output .= '</div>'; // el-aranha2

        return $output;
    }

    private function render_icon( $icon, $icon_size ) {
        if ( ! $icon ) {
            return '';
        }
        if ( strpos( $icon, 'dashicons-' ) === 0 ) {
            return '<span class="dashicons ' . esc_attr( $icon )
                . '" style="font-size:' . $icon_size . 'px;width:' . $icon_size . 'px;height:' . $icon_size . 'px;"></span>';
        }
        if ( preg_match( '/^fa[srlbd]?\s/', $icon ) ) {
            return '<i class="' . esc_attr( $icon ) . '" style="font-size:' . $icon_size . 'px;"></i>';
        }
        return '<img src="' . esc_url( $icon ) . '" alt=""'
            . ' style="width:' . $icon_size . 'px;height:' . $icon_size . 'px;object-fit:contain;border-radius:4px;" />';
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Aranha2() );
