<?php
 /* Template Name: Archive Vitrines do Conhecimento
 *  ©BIREME | OPAS | OMS
 *  Maio de 2019 - Ricardo de Castro - ricardodecastro@gmail.com - consultor 
 */ 
 
get_header();
wp_enqueue_style ('theme-style', plugin_dir_url( __FILE__ ) .'css/page_vitrine.css');
$site_lang = substr($current_language, 0,2);

if ( defined( 'POLYLANG_VERSION' ) ) {
    $default_language = pll_default_language();
    if ( $default_language == $site_lang ) $site_lang = '';
} else {
	$site_lang = '';
}
if ($site_lang == 'en') {
	$vitrines_title = "Knowledge Windows";
} elseif ($site_lang == 'es') {
	$vitrines_title = "Vitrinas del Conocimiento";	
} else {
	$vitrines_title = "Vitrines do Conhecimento";		
}
?>
<style>
.vitrine_thumb img {
    border-radius: 50%;
    width: 150px;
    height: 150px;
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

.info {
    margin-left: 15px;
}	
</style>
<div class="middle">
	<div class="breadcrumb"><a href="<?php bloginfo('url'); ?>/<?php echo ($site_lang);?>" title="<?php bloginfo('name'); ?>">Home</a> /  </div>


	<h2 class="storytitle"><?php echo($vitrines_title);?></h2>

	<div class="vitrine_list">
		<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
			<a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>">
				<div class="vitrine_data">
					<div class="vitrine_thumb">
						<?php the_post_thumbnail( 'vitrine_image' ); ?>
					</div>
					<div class="info">
						<h2 class="vitrine_title"><?php the_title(); ?></h2>
						<div class="vitrine_excerpt">
							<?php the_excerpt(); ?>
						</div>
					</div>

				</div>
			</a>


			<?php endwhile; else: ?>
			<p><?php _e('Sorry, no posts matched your criteria.'); ?></p>
		<?php endif; ?>
	</div>
</div>
<?php get_footer(); ?>