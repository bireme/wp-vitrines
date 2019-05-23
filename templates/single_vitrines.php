<?php
 /*Template Name: Vitrine do Conhecimento BVSalud
 */
 
get_header();
//$template_path = plugin_dir_path( __FILE__ ) . '/templates/single_vitrines.php'
wp_enqueue_style ('theme-style', plugin_dir_url( __FILE__ ) .'css/page_vitrine.css');
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


<div class="vitrine">
    <div class="breadcrumb">
		<a href="<?php bloginfo('url'); ?>/<?php echo ($site_lang);?>" title="<?php bloginfo('name'); ?>">Home</a>
		/ 
		<a href="../">
			<?php echo($vitrines_breadcrumb); ?>
		</a>
		
	</div>
<div class="vitrineTitle">
	<h2><?php the_title(); ?></h2>
</div>
<div class="vitrine_layout">
	<div class="image_background" style="background: #ffffff url(<?php the_post_thumbnail_url( 'vitrine_image' ); ?>) no-repeat center center;"></div>
	<div class="row">
		<div class="cl cl_desk_5 comp01">
			<?php 
				$comp = 1;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
			?>
			<div class="component comp_left" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
				<?
				}
				?>
							
			</div>
		</div>
		<div class="cl cl_desk_1 point_comp01" style="visibility: <?php echo  $visibility; ?>; "></div>
		<?php 
				$comp = 2;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
		?>
		<div class="cl cl_desk_1 point_comp02" style="visibility: <?php echo  $visibility; ?>; "></div>
		<div class="cl cl_desk_5 comp02">
			<div class="component comp_right" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
				<?
				}
				?>
							
			</div>
		</div>
	</div>
	<div class="row">
		<div class="cl cl_desk_4 comp03">
			<?php 
				$comp = 5;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
			?>
			<div class="component comp_left" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
				<?
				}
				?>
							
			</div>
		</div>
		<div class="cl cl_desk_1 point_comp03" style="visibility: <?php echo  $visibility; ?>; "></div>
		<div class="cl cl_desk_1 blank"></div>
		<div class="cl cl_desk_1 blank"></div>
			<?php 
				$comp = 7;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
			?>
		<div class="cl cl_desk_1 point_comp04" style="visibility: <?php echo  $visibility; ?>; "></div>
		<div class="cl cl_desk_4 comp04">
			<div class="component comp_right" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
				<?
				}
				?>
							
			</div>
		</div>
	</div>
	<div class="row">
		<div class="cl cl_desk_4 comp05">
			<?php 
				$comp = 8;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
			?>
			<div class="component comp_left" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
				<?
				}
				?>
							
			</div>
		</div>
		<div class="cl cl_desk_1 point_comp05" style="visibility: <?php echo  $visibility; ?>; "></div>
		<div class="cl cl_desk_1 blank"></div>
		<div class="cl cl_desk_1 blank"></div>
			<?php 
				$comp = 6;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
			?>
		<div class="cl cl_desk_1 point_comp06" style="visibility: <?php echo  $visibility; ?>; "></div>
		<div class="cl cl_desk_4 comp06">
			<div class="component comp_right" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
				<?
				}
				?>
							
			</div>
		</div>
	</div>
	<div class="row">
		<div class="cl cl_desk_5 comp07">
			<?php 
				$comp = 3;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
			?>
			<div class="component comp_left" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
				<?
				}
				?>
							
			</div>
		</div>
		<div class="cl cl_desk_1 point_comp07" style="visibility: <?php echo  $visibility; ?>; "></div>
			<?php 
				$comp = 4;
				$onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $comp, true ) );
				if ( $onOff == 'on' ) { $visibility = "inherit"; } else {  $visibility = "hidden"; };
			?>
		<div class="cl cl_desk_1 point_comp08" style="visibility: <?php echo  $visibility; ?>; "></div>
		<div class="cl cl_desk_5 comp08">
			<div class="component comp_right" style="visibility: <?php echo  $visibility; ?>; "> 
				<?php if ( $onOff == 'on') {
				?>
					<span class="component_content">
						<span class="component_title">
							<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
						</span>
						<span class="component_text">
							<?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
						</span>
						<div class="component_link seta-direita">
							<?php
								$linkTarget = ( get_post_meta( get_the_ID(), 'linkTarget_vitrine_0'. $comp, true ) );
								if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; };
							?>
							<a target="<?php echo $target; ?>" href="<?php echo ( get_post_meta( get_the_ID(), 'linkUrl_vitrine_0'. $comp, true ) ); ?>">
								<?php echo ( get_post_meta( get_the_ID(), 'linkText_vitrine_0'. $comp, true ) ); ?>
							</a>
						</div>
					</span>	
					<span class="component_icon">
						<img src="<?php echo plugin_dir_url( __FILE__ ); ?>../icones/<?php echo esc_html( get_post_meta( get_the_ID(), 'icon_vitrine_0'. $comp, true ) ); ?>.png" />
					</span>
				<?
				}
				?>
							
			</div>
		</div>
	</div>
	<div class="spacer"></div>
</div>
      
<div class="entry">
	<?php the_content(); ?>
</div>
    
    
</div>
<?php endwhile; else: ?>
    <p><?php _e('Sorry, no posts matched your criteria.'); ?></p>
<?php endif; ?>
<?php get_footer(); ?>