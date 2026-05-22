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

    function get_modified_date($post_id) {
        $u_time = get_the_time('U', $post_id);
        $u_modified_time = get_the_modified_time('U', $post_id);

        if ($u_modified_time >= $u_time + 86400) {
            $updated_date = get_the_modified_time('d/m/Y', $post_id);
        } else {
            $updated_date = get_the_time('d/m/Y', $post_id);            
        }

        return $updated_date;
    }
?>