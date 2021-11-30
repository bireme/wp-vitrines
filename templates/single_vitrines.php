<?php
/*
Template Name: Vitrine do Conhecimento BVSalud
*/

get_header();
wp_enqueue_style('theme-styles', plugin_dir_url( __FILE__ ) .'css/page_vitrine.css');
wp_enqueue_script('font-awesome', 'https://kit.fontawesome.com/be0bade886.js', array(), null, true);

$config = get_option('wp_vitrines_config');
$home_url = ( $config['home_url'] ) ? $config['home_url'] : get_bloginfo('url');
$current_language = strtolower(get_bloginfo('language'));
$site_lang = substr($current_language, 0,2);

if ( defined( 'POLYLANG_VERSION' ) ) {
    $default_language = pll_default_language();
    if ( $default_language == $site_lang ) $site_lang = '';
} else {
    $site_lang = '';
}

if ($site_lang == 'en') {
    $vitrines_breadcrumb = "Windows of Knowledge";
} elseif ($site_lang == 'es') {
    $vitrines_breadcrumb = "Vitrinas del Conocimiento";    
} else {
    $vitrines_breadcrumb = "Vitrines do Conhecimento";        
}
?>

<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <?php $plugin_dir = plugin_dir_url( __FILE__ ); ?>
    <div class="vitrine">
        <div class="breadcrumb">
            <a href="<?php echo rtrim($home_url, '/'); ?>/<?php echo ($site_lang); ?>" title="<?php bloginfo('name'); ?>">Home</a> / <a href="../"><?php echo $vitrines_breadcrumb; ?></a>
        </div>
        <?php 
            //Carrega Variaveis da Customização da Vitrine
            $titleBg_color = esc_html (get_post_meta( get_the_ID(), "titleBg_color", true ) );
            $titleFont_color = esc_html (get_post_meta( get_the_ID(), "titleFont_color", true ) );
            $boxBorder_color = esc_html (get_post_meta( get_the_ID(), "boxBorder_color", true ) );
            $presentation_font_size = esc_html (get_post_meta( get_the_ID(), "presentation_font_size", true ) );
            $font_size = esc_html (get_post_meta( get_the_ID(), "font_size", true ) );
        ?>
        <style>
            .component, .image_background {
                border-color: <?php echo $boxBorder_color; ?> !important;
            }
            .lines {
                fill: <?php echo $boxBorder_color; ?> !important; 
            }
            .vitrine .entry, 
            .vitrine .vitrinebyform {
                font-size: <?php echo $font_size; ?> !important;
                line-height: 120% !important;
            }
            .vitrinebyform .presentation {
                font-size: <?php echo $presentation_font_size; ?> !important;
                line-height: 120% !important;            
            }
        </style>
        <div class="vitrineTitle" style="background: <?php echo $titleBg_color; ?>">
            <h2 style="color: <?php echo $titleFont_color; ?>"><?php the_title(); ?></h2>
        </div>
        <div class="dateBox">
            <?php 
                $data = esc_html (get_post_meta( get_the_ID(), "data", true ) );
                $data = new DateTime($data);
            ?>
            <span>Conteúdo atualizado em: <?php echo $data->format('d/m/Y'); ?></span>
        </div>

        <?php 
            $countBoxes = 0;
            for ($boxes=1; $boxes<=8; $boxes ++) {
                $onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $boxes, true ) );
                if ( $onOff == 'on' ) { 
                    $countBoxes ++;
                }
            }
            include ("vitrinelayout".$countBoxes.".php");
        ?>

        <?php $showWPEditor = esc_html (get_post_meta( get_the_ID(), "showWPEditor", true ) ); ?>
        
        <?php if ($showWPEditor == "on") : ?>
            <div class="entry">
                <?php the_content(); ?>
            </div>
        <?php endif; ?>

        <div class="vitrinebyform">
            <?php include ("form-vitrine.php"); ?>
        </div>
    </div>
<?php endwhile; else: ?>
    <p><?php _e('Sorry, no posts matched your criteria.'); ?></p>
<?php endif; ?>

<?php get_footer(); ?>