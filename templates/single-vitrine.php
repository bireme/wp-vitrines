<?php
/**
 * Template: Single Vitrine
 *
 * Carregado automaticamente pelo plugin para o CPT "vitrine".
 * Layout limpo, sem sidebar do tema.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$vitrine_page_settings = get_post_meta( get_the_ID(), '_vitrine_page_settings', true );
$vitrine_show_header   = ! isset( $vitrine_page_settings['show_header'] ) || '1' === $vitrine_page_settings['show_header'];
$vitrine_show_footer   = ! isset( $vitrine_page_settings['show_footer'] ) || '1' === $vitrine_page_settings['show_footer'];
$vitrine_bg_color      = ! empty( $vitrine_page_settings['page_bg_color'] ) ? $vitrine_page_settings['page_bg_color'] : '';
$vitrine_hero_image    = ! empty( $vitrine_page_settings['hero_image'] ) ? $vitrine_page_settings['hero_image'] : '';
$vitrine_hero_text     = ! empty( $vitrine_page_settings['hero_text'] ) ? $vitrine_page_settings['hero_text'] : '';
$vitrine_hero_txt_clr  = ! empty( $vitrine_page_settings['hero_text_color'] ) ? $vitrine_page_settings['hero_text_color'] : '#ffffff';
$vitrine_hero_opacity  = isset( $vitrine_page_settings['hero_overlay_opacity'] ) ? intval( $vitrine_page_settings['hero_overlay_opacity'] ) / 100 : 0.5;
$vitrine_hero_height   = ! empty( $vitrine_page_settings['hero_height'] ) ? intval( $vitrine_page_settings['hero_height'] ) : 400;

if ( $vitrine_show_header ) {
    get_header();
} else {
    ?>
    <!DOCTYPE html>
    <html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo( 'charset' ); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <?php
}

$vitrine_body_style = $vitrine_bg_color ? ' style="background-color:' . esc_attr( $vitrine_bg_color ) . ';min-height:100vh;"' : '';
?>

<main id="vitrine-single" class="vitrine-single-wrap"<?php echo $vitrine_body_style; ?>>
    <?php if ( $vitrine_hero_image || $vitrine_hero_text ) : ?>
    <section class="vitrine-hero" style="background:url('<?php echo esc_url( $vitrine_hero_image ); ?>') center/cover no-repeat;height:<?php echo esc_attr( $vitrine_hero_height ); ?>px;">
        <div class="vitrine-hero-overlay" style="background:rgba(0,0,0,<?php echo esc_attr( $vitrine_hero_opacity ); ?>);"></div>
        <?php if ( $vitrine_hero_text ) : ?>
            <h1 class="vitrine-hero-text" style="color:<?php echo esc_attr( $vitrine_hero_txt_clr ); ?>;"><?php echo esc_html( $vitrine_hero_text ); ?></h1>
        <?php endif; ?>
    </section>
    <?php endif; ?>
    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <article id="vitrine-<?php the_ID(); ?>" <?php post_class( 'vitrine-article' ); ?>>
            <div class="vitrine-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php
if ( $vitrine_show_footer ) {
    get_footer();
} else {
    wp_footer();
    ?>
    </body>
    </html>
    <?php
}
