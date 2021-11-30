<?php
    function get_video_code($url) {
        $code = '';
        
        if (strpos($url, 'youtube') > 0) {
            $parts = parse_url($url);
            parse_str($parts['query'], $query);
            $code = $query['v'];
        }

        if (strpos($url, 'youtu.be') > 0) {
            $parts = parse_url($url);
            $code = end(explode('/', $parts['path']));
        }

        return $code;
    }

    function is_shortcode($content) {
        $pattern = get_shortcode_regex();

        if ( preg_match_all( '/'. $pattern .'/s', $content, $matches ) && array_key_exists( 2, $matches ) ) {
            return true;
        }

        return false;
    }
?>