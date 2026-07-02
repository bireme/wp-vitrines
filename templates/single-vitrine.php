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

$vitrine_page_settings = Vitrine_Hero_Meta::get_settings( get_the_ID() );
$vitrine_show_header   = ! isset( $vitrine_page_settings['show_header'] ) || '1' === $vitrine_page_settings['show_header'];
$vitrine_show_footer   = ! isset( $vitrine_page_settings['show_footer'] ) || '1' === $vitrine_page_settings['show_footer'];
$vitrine_bg_color      = ! empty( $vitrine_page_settings['page_bg_color'] ) ? $vitrine_page_settings['page_bg_color'] : '';
$vitrine_hero_image    = ! empty( $vitrine_page_settings['hero_image'] ) ? $vitrine_page_settings['hero_image'] : '';
$vitrine_hero_text     = ! empty( $vitrine_page_settings['hero_text'] ) ? $vitrine_page_settings['hero_text'] : '';
$vitrine_hero_txt_clr  = ! empty( $vitrine_page_settings['hero_text_color'] ) ? $vitrine_page_settings['hero_text_color'] : '#ffffff';
$vitrine_hero_opacity  = isset( $vitrine_page_settings['hero_overlay_opacity'] ) ? intval( $vitrine_page_settings['hero_overlay_opacity'] ) / 100 : 0.5;
$vitrine_hero_height   = ! empty( $vitrine_page_settings['hero_height'] ) ? intval( $vitrine_page_settings['hero_height'] ) : 400;
$vitrine_hero_font_sz  = ! empty( $vitrine_page_settings['hero_font_size'] ) ? intval( $vitrine_page_settings['hero_font_size'] ) : 36;
$vitrine_hero_align    = ! empty( $vitrine_page_settings['hero_text_align'] ) ? $vitrine_page_settings['hero_text_align'] : 'center';
$vitrine_hero_bold     = isset( $vitrine_page_settings['hero_text_bold'] ) && '0' === $vitrine_page_settings['hero_text_bold'] ? '400' : '700';
$vitrine_hero_italic   = ! empty( $vitrine_page_settings['hero_text_italic'] ) ? 'italic' : 'normal';
$vitrine_hero_desc     = ! empty( $vitrine_page_settings['hero_description'] ) ? $vitrine_page_settings['hero_description'] : '';
$vitrine_hero_desc_sz  = ! empty( $vitrine_page_settings['hero_desc_size'] ) ? intval( $vitrine_page_settings['hero_desc_size'] ) : 18;

$vitrine_hero_justify = 'center';
if ( 'left' === $vitrine_hero_align ) {
    $vitrine_hero_justify = 'flex-start';
} elseif ( 'right' === $vitrine_hero_align ) {
    $vitrine_hero_justify = 'flex-end';
}

$vitrine_hero_style = $vitrine_hero_image
    ? 'background:url(' . esc_url( $vitrine_hero_image ) . ') center/cover no-repeat;'
    : 'background:#333;';
$vitrine_hero_style .= 'height:' . esc_attr( $vitrine_hero_height ) . 'px;';
$vitrine_hero_style .= 'justify-content:' . esc_attr( $vitrine_hero_justify ) . ';';

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

<main id="vitrine-single" class="vitrine-single-wrap vitrine-single-wrap--<?php echo esc_attr( get_the_ID() ); ?>"<?php echo $vitrine_body_style; ?>>
    <?php if ( $vitrine_hero_image || $vitrine_hero_text || $vitrine_hero_desc ) : ?>
    <section class="vitrine-hero" style="<?php echo esc_attr( $vitrine_hero_style ); ?>">
        <div class="vitrine-hero-overlay" style="background:rgba(0,0,0,<?php echo esc_attr( $vitrine_hero_opacity ); ?>);"></div>
        <div class="vitrine-hero-content" style="text-align:<?php echo esc_attr( $vitrine_hero_align ); ?>;">
            <?php if ( $vitrine_hero_text ) : ?>
                <h1 class="vitrine-hero-text" style="color:<?php echo esc_attr( $vitrine_hero_txt_clr ); ?>;font-size:<?php echo esc_attr( $vitrine_hero_font_sz ); ?>px;font-weight:<?php echo esc_attr( $vitrine_hero_bold ); ?>;font-style:<?php echo esc_attr( $vitrine_hero_italic ); ?>;"><?php echo esc_html( $vitrine_hero_text ); ?></h1>
            <?php endif; ?>
            <?php if ( $vitrine_hero_desc ) : ?>
                <div class="vitrine-hero-desc" style="color:<?php echo esc_attr( $vitrine_hero_txt_clr ); ?>;font-size:<?php echo esc_attr( $vitrine_hero_desc_sz ); ?>px;"><?php echo wp_kses_post( $vitrine_hero_desc ); ?></div>
            <?php endif; ?>
        </div>
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
