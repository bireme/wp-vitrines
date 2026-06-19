<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Shortcode extends Vitrine_Element {

    public function slug() {
        return 'shortcode';
    }

    public function label() {
        return 'Shortcode';
    }

    public function icon() {
        return 'dashicons-shortcode';
    }

    public function defaults() {
        return array(
            'content' => '',
            'align'   => 'left',
        );
    }

    public function fields() {
        return array(
            array(
                'name'  => 'content',
                'label' => 'Shortcode',
                'type'  => 'plaintextarea',
            ),
            array(
                'name'    => 'align',
                'label'   => 'Alinhamento',
                'type'    => 'select',
                'options' => array(
                    'left'   => 'Esquerda',
                    'center' => 'Centro',
                    'right'  => 'Direita',
                ),
            ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $content = isset( $s['content'] ) ? trim( (string) $s['content'] ) : '';
        if ( '' === $content ) {
            return '';
        }

        $allowed_align = array( 'left', 'center', 'right' );
        $align         = in_array( $s['align'], $allowed_align, true ) ? $s['align'] : 'left';

        $content = $this->sanitize_shortcode_content( $content );
        $html    = do_shortcode( $content );

        if ( '' === trim( $html ) ) {
            return '';
        }

        $style = 'text-align:' . esc_attr( $align ) . ';';

        return sprintf(
            '<div class="vitrine-el-shortcode" style="%s">%s</div>',
            $style,
            $html
        );
    }

    /**
     * Remove tags HTML perigosas, preservando a sintaxe do shortcode.
     */
    private function sanitize_shortcode_content( $content ) {
        $content = wp_strip_all_tags( $content );
        $content = preg_replace( '/javascript\s*:/i', '', $content );
        return trim( $content );
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Shortcode() );
