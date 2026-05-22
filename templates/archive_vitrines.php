<?php
/*
Template Name: Archive Vitrines do Conhecimento
*/ 
 
get_header();

wp_enqueue_style ('theme-styles', plugin_dir_url( __FILE__ ) .'css/page_vitrine.css');

$config = get_option('wp_vitrines_config');
$home_url = ( $config['home_url'] ) ? $config['home_url'] : get_bloginfo('url');
$current_language = strtolower(get_bloginfo('language'));
$site_lang = substr($current_language, 0,2);

if ( defined( 'POLYLANG_VERSION' ) ) {
    $vitrine_link_url = pll_home_url();
} else {
    $vitrine_link_url = home_url('/');
}
?>

<style>
    .vitrine_thumb img {
        border-radius: 50%;
        width: 150px !important;
        height: 150px !important;
        max-width: none !important;
        border: 2px solid #d3e8fb;
    }

    .vitrine_data {
        margin: 0px 1% 40px 1%;
        width: 47%;
        display: inline-flex;
    }

    .vitrine_list .vitrine_title {
        font-size: 140%;
        font-weight: bold;
        margin-bottom: 10px;
        line-height: 110%;
    }

    .vitrine_links {
        text-align: right;
        margin: 0px 30px 30px 0px;
        font-weight: bold;
        text-decoration: underline;
    }

    .info {
        margin-left: 15px;
    }    
        
    @media screen and (max-width: 990px) {
        .vitrine_data {
            margin: 2%;
            width: 94%;
            display: inline-block;
            text-align: center;
        }
    }
</style>

<div class="middle">
    <div class="breadcrumb"><a href="<?php echo rtrim($home_url, '/'); ?>/<?php echo ($site_lang);?>" title="<?php bloginfo('name'); ?>">Home</a> / </div>

    <h2 class="storytitle"><?php _e( 'Windows of Knowledge', 'wp-vitrines-master' ); ?></h2>

    <div class="vitrine_list">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
            <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
                <div class="vitrine_data">
                    <div class="vitrine_thumb">
                        <?php the_post_thumbnail( 'vitrine_image' ); ?>
                    </div>
                    <div class="info">
                        <h2 class="vitrine_title"><?php the_title(); ?></h2>
                        <?php $showWPEditor = esc_html( get_post_meta( get_the_ID(), "showWPEditor", true ) ); ?>
                        <?php if ($showWPEditor == "on") : ?>
                            <div class="vitrine_excerpt">
                                <?php the_excerpt(); ?>
                            </div>
                        <?php else : ?>
                            <?php $content = get_post_meta( get_the_ID(), "basic_vitrine_presentation", true ); ?>
                            <?php $content = do_shortcode( $content ); ?>
                            <div class="vitrine_excerpt">
                                <?php echo wp_trim_words( $content, 55, '[...]' ); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </a>
        <?php endwhile; else: ?>
            <p><?php _e('Sorry, no posts matched your criteria.'); ?></p>
        <?php endif; ?>
    </div>

    <div class="vitrine_links">
        <a href="<?php echo $vitrine_link_url; ?>" target="_blank"><?php _e( 'Windows of Knowledge Collection of the VHL Network', 'wp-vitrines-master' ); ?></a>
    </div>
</div>
<?php get_footer(); ?>
