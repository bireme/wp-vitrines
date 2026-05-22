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

get_header();
?>

<main id="vitrine-single" class="vitrine-single-wrap">
    <?php
    while ( have_posts() ) :
        the_post();
        ?>
        <article id="vitrine-<?php the_ID(); ?>" <?php post_class( 'vitrine-article' ); ?>>
            <header class="vitrine-header">
                <h1 class="vitrine-title"><?php the_title(); ?></h1>
            </header>
            <div class="vitrine-content">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</main>

<?php
get_footer();
