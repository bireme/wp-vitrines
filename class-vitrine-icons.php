<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Listas completas de ícones para o picker do editor.
 */
class Vitrine_Icons {

    /**
     * Todos os Dashicons registrados no core do WordPress.
     *
     * @return string[]
     */
    public static function get_dashicons() {
        static $list = null;
        if ( null !== $list ) {
            return $list;
        }

        $css_file = ABSPATH . WPINC . '/css/dashicons.css';
        if ( ! is_readable( $css_file ) ) {
            $list = array();
            return $list;
        }

        $content = file_get_contents( $css_file );
        if ( ! $content || ! preg_match_all( '/\.dashicons-([a-z0-9-]+):before\s*\{/', $content, $matches ) ) {
            $list = array();
            return $list;
        }

        $names = array_unique( $matches[1] );
        sort( $names, SORT_STRING );

        $list = array();
        foreach ( $names as $name ) {
            if ( 'before' === $name ) {
                continue;
            }
            $list[] = 'dashicons-' . $name;
        }

        return $list;
    }

    /**
     * Ícones Font Awesome Free (solid, regular, brands) via metadata oficial.
     *
     * @return string[] Ex.: "fas fa-user", "fab fa-github"
     */
    public static function get_fontawesome() {
        static $list = null;
        if ( null !== $list ) {
            return $list;
        }

        $cached = get_transient( 'vitrine_fa_icons_list' );
        if ( is_array( $cached ) && ! empty( $cached ) ) {
            $list = $cached;
            return $list;
        }

        $url      = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/metadata/icons.json';
        $response = wp_remote_get(
            $url,
            array(
                'timeout' => 20,
                'headers' => array(
                    'Accept' => 'application/json',
                ),
            )
        );

        if ( is_wp_error( $response ) ) {
            $list = array();
            return $list;
        }

        $body = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( ! is_array( $body ) ) {
            $list = array();
            return $list;
        }

        $style_prefix = array(
            'solid'   => 'fas',
            'regular' => 'far',
            'brands'  => 'fab',
        );

        $icons = array();
        foreach ( $body as $name => $data ) {
            if ( empty( $data['free'] ) || ! is_array( $data['free'] ) ) {
                continue;
            }
            foreach ( $data['free'] as $style ) {
                if ( ! isset( $style_prefix[ $style ] ) ) {
                    continue;
                }
                $icons[] = $style_prefix[ $style ] . ' fa-' . $name;
            }
        }

        $icons = array_values( array_unique( $icons ) );
        sort( $icons, SORT_STRING );

        set_transient( 'vitrine_fa_icons_list', $icons, WEEK_IN_SECONDS );

        $list = $icons;
        return $list;
    }

    /**
     * Dados para wp_localize_script.
     *
     * @return array{dashicons: string[], fontawesome: string[]}
     */
    public static function get_picker_data() {
        return array(
            'dashicons'   => self::get_dashicons(),
            'fontawesome' => self::get_fontawesome(),
        );
    }
}
