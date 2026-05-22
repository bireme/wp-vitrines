<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Vitrine_Element_Video extends Vitrine_Element {

    public function slug() {
        return 'video';
    }

    public function label() {
        return 'Vídeo';
    }

    public function icon() {
        return 'dashicons-video-alt3';
    }

    public function defaults() {
        return array(
            'source'     => 'youtube',
            'youtube_url' => '',
            'local_url'  => '',
            'width'      => '100',
            'aspect'     => '16-9',
            'autoplay'   => '0',
            'controls'   => '1',
        );
    }

    public function fields() {
        return array(
            array( 'name' => 'source',      'label' => 'Origem',            'type' => 'select', 'options' => array( 'youtube' => 'YouTube', 'local' => 'Vídeo Local' ) ),
            array( 'name' => 'youtube_url',  'label' => 'URL do YouTube',    'type' => 'text' ),
            array( 'name' => 'local_url',    'label' => 'Vídeo Local',       'type' => 'image' ),
            array( 'name' => 'width',        'label' => 'Largura (%)',       'type' => 'number' ),
            array( 'name' => 'aspect',       'label' => 'Proporção',         'type' => 'select', 'options' => array( '16-9' => '16:9', '4-3' => '4:3', '1-1' => '1:1' ) ),
            array( 'name' => 'autoplay',     'label' => 'Autoplay',          'type' => 'select', 'options' => array( '0' => 'Não', '1' => 'Sim' ) ),
            array( 'name' => 'controls',     'label' => 'Controles',         'type' => 'select', 'options' => array( '1' => 'Sim', '0' => 'Não' ) ),
        );
    }

    public function render( $settings, $children_html = '' ) {
        $s = wp_parse_args( $settings, $this->defaults() );

        $width    = max( 10, min( 100, intval( $s['width'] ) ) );
        $autoplay = '1' === $s['autoplay'];
        $controls = '1' === $s['controls'];

        $aspects = array( '16-9' => '56.25', '4-3' => '75', '1-1' => '100' );
        $padding = isset( $aspects[ $s['aspect'] ] ) ? $aspects[ $s['aspect'] ] : '56.25';

        $output = '<div class="vitrine-el-video" style="max-width:' . $width . '%;margin:0 auto;">';
        $output .= '<div class="vitrine-el-video__wrapper" style="position:relative;padding-bottom:' . $padding . '%;height:0;overflow:hidden;">';

        if ( 'youtube' === $s['source'] && ! empty( $s['youtube_url'] ) ) {
            $video_id = $this->extract_youtube_id( $s['youtube_url'] );
            if ( $video_id ) {
                $params = array();
                if ( $autoplay ) {
                    $params[] = 'autoplay=1';
                    $params[] = 'mute=1';
                }
                if ( ! $controls ) {
                    $params[] = 'controls=0';
                }
                $params[] = 'rel=0';
                $src = 'https://www.youtube.com/embed/' . $video_id . '?' . implode( '&', $params );
                $output .= '<iframe src="' . esc_url( $src ) . '" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            } else {
                $output .= '<p style="text-align:center;color:#999;padding:20px;">URL do YouTube inválida.</p>';
            }
        } elseif ( 'local' === $s['source'] && ! empty( $s['local_url'] ) ) {
            $attrs = 'playsinline';
            if ( $controls ) {
                $attrs .= ' controls';
            }
            if ( $autoplay ) {
                $attrs .= ' autoplay muted';
            }
            $output .= '<video src="' . esc_url( $s['local_url'] ) . '" ' . $attrs . ' style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;"></video>';
        } else {
            $output .= '<p style="text-align:center;color:#999;padding:20px;">Nenhum vídeo selecionado.</p>';
        }

        $output .= '</div></div>';
        return $output;
    }

    private function extract_youtube_id( $url ) {
        $patterns = array(
            '/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/',
        );
        foreach ( $patterns as $pattern ) {
            if ( preg_match( $pattern, $url, $matches ) ) {
                return $matches[1];
            }
        }
        // Caso seja só o ID direto
        if ( preg_match( '/^[a-zA-Z0-9_-]{11}$/', $url ) ) {
            return $url;
        }
        return '';
    }
}

Vitrine_Element_Registry::register( new Vitrine_Element_Video() );
