<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Html extends Vitrine_Element {

    public function slug() {
        return 'html';
    }

    public function label() {
        return 'HTML';
    }

    public function icon() {
        return 'dashicons-editor-code';
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
                'label' => 'Código HTML',
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

        $html = $this->sanitize_html_content( $content );
        if ( '' === trim( $html ) ) {
            return '';
        }

        $style = 'text-align:' . esc_attr( $align ) . ';';

        return sprintf(
            '<div class="vitrine-el-html" style="%s">%s</div>',
            $style,
            $html
        );
    }

    /**
     * Sanitiza HTML permitindo tags comuns de conteúdo e embeds.
     */
    public static function sanitize_html_content( $content ) {
        $content = (string) $content;

        if ( current_user_can( 'unfiltered_html' ) ) {
            $content = preg_replace( '/<script\b[^>]*>.*?<\/script>/is', '', $content );
            $content = preg_replace( '/javascript\s*:/i', '', $content );
            $content = preg_replace( '/\son\w+\s*=\s*("|\').*?\1/i', '', $content );
            return trim( $content );
        }

        $allowed = wp_kses_allowed_html( 'post' );
        $allowed['iframe'] = array(
            'src'             => true,
            'width'           => true,
            'height'          => true,
            'frameborder'     => true,
            'allowfullscreen' => true,
            'allow'           => true,
            'loading'         => true,
            'title'           => true,
            'style'           => true,
            'class'           => true,
            'id'              => true,
        );
        $allowed['embed'] = array(
            'src'   => true,
            'type'  => true,
            'width' => true,
            'height'=> true,
        );

        return trim( wp_kses( $content, $allowed ) );
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Html() );
