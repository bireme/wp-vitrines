<?php
/*
Plugin Name: Vitrine do Conhecimento BVSalud
Description: Este Plugin habilita as Vitrines do Conhecimento em seu BVS Site.
Version: 1.0
Author: BIREME | OPAS | OMS
Author URI: #
Text Domain: plugin_vitrinedoconhecimento
Domain Path: /languages
License:  .

*/
add_action( 'plugins_loaded', 'myplugin_load_textdomain' );

function myplugin_load_textdomain() {
    load_plugin_textdomain( 'plugin_vitrinedoconhecimento', false,dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}

add_action( 'init', 'create_post_vitrine' );

function create_post_vitrine() {
  register_post_type( 'post_vitrines',
        array(
            'labels' => array(
                'name' => 'Vitrine do Conhecimento',
                'singular_name' => 'Vitrines do Conhecimento',
                'add_new' => 'Adicionar nova',
                'add_new_item' => 'Adicionar nova vitrine',
                'edit' => 'Editar',
                'edit_item' => 'Editar Vitrine',
                'new_item' => 'Nova Vitrine',
                'view' => 'Ver',
                'view_item' => 'Ver Vitrine',
                'search_items' => 'Buscar Vitrine',
                'not_found' => 'Nenhuma Vitrine Encontrada',
                'not_found_in_trash' => 'Nenhuma Vitrine encontrada na Lixeira',
                'parent' => 'Parent Vitrine'
            ),
 
            'public' => true,
            'menu_position' => 15,
            'supports' => array( 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ),
            'taxonomies' => array( '' ),
			'menu_icon' => 'dashicons-lightbulb',
            /*'menu_icon' => plugins_url( 'images/image.png', __FILE__ ),*/
            'has_archive' => true
        )
    );
}

add_action( 'admin_init', 'my_admin' );

function my_admin() {
    add_meta_box( 'post_vitrine_meta_box',
        'Componentes da Vitrine',
        'display_post_vitrine_meta_box',
        'post_vitrines', 'normal', 'high'
    );
}


function display_post_vitrine_meta_box( $post_vitrine ) {
	?>
	<script>
		 $(function(){
			$(".componente_title").on("click",function(){
			  $(this).next().slideToggle();
			});
		 });
	</script>
	<div class="vitrine_description">
		<p><?php echo esc_html( __( "Nos campos abaixo podemos criar os componentes em destaque da Vitrine, devemos criar no mínimo 4 componentes e no máximo 8, o sistema organizará a melhor exibição dos componentes e imagem de destaque.", 'plugin_vitrine' ) ); ?></p>
	</div>
	<?php
		for ($metaboxID=1; $metaboxID<=8; $metaboxID ++) { //abre o loop dos componentes 
		//On Off Metabox
		${"vitrine_onOff_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "onOff_vitrine_0" . $metaboxID . "", true ) );
		// Titulo do Metabox
		${"vitrine_title_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "title_vitrine_0" . $metaboxID . "", true ) );
		// text do Metabox
		${"vitrine_text_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "text_vitrine_0" . $metaboxID . "", true ) );
		// linkText do Metabox
		${"vitrine_linkText_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkText_vitrine_0" . $metaboxID . "", true ) );
		// linkTarget do Metabox
		${"vitrine_linkTarget_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkTarget_vitrine_0" . $metaboxID . "", true ) );
		// linkUrl do Metabox
		${"vitrine_linkUrl_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkUrl_vitrine_0" . $metaboxID . "", true ) );	
		// icon do Metabox
		${"vitrine_icon_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "icon_vitrine_0" . $metaboxID . "", true ) );
		// notes do Metabox
		${"vitrine_notes_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "notes_vitrine_0" . $metaboxID . "", true ) );
		// #### do Metabox
		//${"vitrine_####_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "####_vitrine_0" . $metaboxID . "", true ) );
	?>
	<!-- Início do Loop do Componente 01 de 08 --->
	<div class="componente_box compontente_<?php echo $metaboxID; ?>">
		<h1 class="componente_title">Componente 0<?php echo $metaboxID; ?> <i><?php echo ${"vitrine_title_0$metaboxID"}; ?></i></h1>
		
		<div class="componente_content" id="content_comp01">
			<div class="row">
				<div class="col-100">
					<p>Conteúdo público: </p>
					<div class="onoffswitch">
						<?php
						  if(${"vitrine_onOff_0$metaboxID"} == "on") ${"field_id_checked_0$metaboxID"} = 'checked="checked"'; ?>
						<input type="checkbox" name="onOff_0<?php echo $metaboxID; ?>_vitrine" class="onoffswitch-checkbox" id="onOff_0<?php echo $metaboxID; ?>_vitrine" <?php echo ${"field_id_checked_0$metaboxID"}; ?> />
						<label class="onoffswitch-label" for="onOff_0<?php echo $metaboxID; ?>_vitrine">
							<span class="onoffswitch-inner"></span>
							<span class="onoffswitch-switch"></span>
						</label>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-100">
					<label>Título do Componente:</label><br>
					<input type="text" class="vitrine_title" name="title_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_title_0$metaboxID"}; ?>" />
				</div>
			</div>
			<div class="row">
				<div class="col-100 vitrine_text_editor">
					<?php 
						$content   = html_entity_decode(${"vitrine_text_0$metaboxID"}); 
						$editor_id = 'text_0'. $metaboxID .'_vitrine';
						$settings  = array( 
							'media_buttons' => false ,
							'wpautop'=> true,
							'editor_height' => 100
						);
						wp_editor($content, $editor_id, $settings);
					?>
					
				</div>
			</div>
			<div class="row">
				<div class="col-30">
					<label>Texto do Link:</label><br>
					<input type="text" class="vitrine_linkText input100" name="linkText_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_linkText_0$metaboxID"}; ?>" />
				</div>
				<div class="col-30">
					<label>url do Link: </label><br>
					<input type="text" class="vitrine_linkUrl input100" name="linkUrl_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_linkUrl_0$metaboxID"}; ?>" />
				</div>				
				<div class="col-30">
					<label>Abrir em nova janela?: </label><br>
						<?php
							if(${"vitrine_linkTarget_0$metaboxID"} == "on") ${"field_linkTarget_checked_0$metaboxID"} = 'checked="checked"'; ?>
						<input type="checkbox" name="linkTarget_0<?php echo $metaboxID; ?>_vitrine" id="linkTarget_0<?php echo $metaboxID; ?>_vitrine" <?php echo ${"field_linkTarget_checked_0$metaboxID"}; ?> />
				</div>
			</div>
			<div class="row">
				<div class="col-100 icon_select">
					<label>Ícone: <b><? echo ${"vitrine_icon_0$metaboxID"}; ?></b></label><br>
					<span class="comp_info">Selecione o ícone que representa o componente criado:</span><br>
					<?php 
						$dir = plugin_dir_url( __FILE__ );
						$icones = array( 
							"icone01", 
							"icone02", 
							"icone03", 
							"icone04", 
							"icone05", 
							"icone06", 
							"icone07", 
							"icone08", 
							"icone09", 
							"icone10"); 

						foreach ($icones as $value) {
							?>
							<div class="select_icon">
								<? 
									if (${"vitrine_icon_0$metaboxID"} == $value) {
										$ifChecked = 'checked="checked"';
									} else {
										$ifChecked = '';
									}
								?>
								<input type="radio" name="icon_0<?php echo $metaboxID; ?>_vitrine" id="icon_0<?php echo $metaboxID; ?>_vitrine" value="<? echo $value; ?>" <? echo $ifChecked; ?> />
									<label><span><? echo $value; ?></span><br><img src="<?php echo $dir; ?>/icones/<? echo $value; ?>.png" alt="ícone" /></label>
							</div>

							<?
							}
							?>		
				</div>
			</div>
			<div class="row">
				<div class="col-100">
					<label>Notas: </label><br>
					<textarea id="vitrine_notes_0<?php echo $metaboxID; ?>" name="notes_0<?php echo $metaboxID; ?>_vitrine"
					  rows="10"><?php echo ${"vitrine_notes_0$metaboxID"}; ?></textarea>
					<span class="comp_info">Campo Notas é interno utilizado somente para a equipe de informação do site, aqui você pode anexar informações que achar necessário.</span><br>
				</div>
			</div>
		</div>
	</div>
	<!-- Fim dos Componente no Loop -->
	
	<?	
	} // Fecha Loop dos componentes
	?>
<style>
		.componente_box {
			padding: 10px;
		}
		.componente_title:hover {
			cursor: pointer;
			background: #d4eded;
		}
		.componente_box {
			padding: 10px;
		}
		.componente_box textarea {
			width: 100% !important;
		}
		.vitrine_title {
			font-size: 120%;
			width: 100%;
		}
		.vitrine_description {
			font-style: italic;
		}
		.componente_box h1.componente_title {
			border-bottom: 2px solid #cecece;
			padding: 5px 10px;
		}
		
		.col-100 {
			width: 98%;
			clear: both;
			display: inline-block;
		}
		.col-30 {
			width: 28%;
			float: left;
			padding: 5px;
		}
		.col-50 {
			width: 48%;
			float: left;
		}
		.componente_box input {
		}
		.col-100, .col-50 {
			padding: 1%;
		}
		.componente_content {
			background: #f1f1f1;
		}
		.input100 {
			width: 100%;
		}
		.select_icon {
			width: 100px;
			float: left;
			text-align: center;
			height: 100px; 
			margin: 5px;
			
		}
		
		input[type=radio] {
		}
		
		input[type=radio]:checked + label>img {
			background: #FFF;
		}

		/* Stuff after this is only to make things more pretty */
		input[type=radio] + label>img {
		  width: 70;
		  height: 70px;
		}
		
		/*ON OFF*/
		.onoffswitch {
			position: relative; width: 90px;
			-webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
		}
		.onoffswitch-checkbox {
			display: none !important;
		}
		.onoffswitch-label {
			display: block; overflow: hidden; cursor: pointer;
			border: 2px solid #999999; border-radius: 20px;
		}
		.onoffswitch-inner {
			display: block; width: 200%; margin-left: -100%;
			transition: margin 0.3s ease-in 0s;
		}
		.onoffswitch-inner:before, .onoffswitch-inner:after {
			display: block; float: left; width: 50%; height: 30px; padding: 0; line-height: 30px;
			font-size: 14px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold;
			box-sizing: border-box;
		}
		.onoffswitch-inner:before {
			content: "ON";
			padding-left: 10px;
			background-color: #34A7C1; color: #FFFFFF;
		}
		.onoffswitch-inner:after {
			content: "OFF";
			padding-right: 10px;
			background-color: #EEEEEE; color: #999999;
			text-align: right;
		}
		.onoffswitch-switch {
			display: block; width: 18px; margin: 6px;
			background: #FFFFFF;
			position: absolute; top: 0; bottom: 0;
			right: 56px;
			border: 2px solid #999999; border-radius: 20px;
			transition: all 0.3s ease-in 0s; 
		}
		.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {
			margin-left: 0;
		}
		.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
			right: 0px; 
		}
		.vitrine_text {
			border: 1px solid red;
		}
</style>
<?php
}//fecha function display_post_vitrine_meta_box

 add_action( 'save_post', 'add_post_vitrine_fields', 10, 2 );

function add_post_vitrine_fields( $post_vitrine_id, $post_vitrine ) {
    // Check post type for post_vitrines
    if ( $post_vitrine->post_type == 'post_vitrines' ) {
       // Store data in post meta table if present in post data
		for ($metaboxUpdate=1; $metaboxUpdate<=8; $metaboxUpdate ++) { //abre o loop de update dos componentes
			update_post_meta( $post_vitrine_id, 'onOff_vitrine_0' . $metaboxUpdate, $_POST['onOff_0' . $metaboxUpdate . '_vitrine'] );
			update_post_meta( $post_vitrine_id, 'title_vitrine_0' . $metaboxUpdate, $_POST['title_0' . $metaboxUpdate . '_vitrine'] );
			update_post_meta( $post_vitrine_id, 'text_vitrine_0' . $metaboxUpdate, $_POST['text_0' . $metaboxUpdate . '_vitrine'] );
			update_post_meta( $post_vitrine_id, 'linkText_vitrine_0' . $metaboxUpdate, $_POST['linkText_0' . $metaboxUpdate . '_vitrine'] );
			update_post_meta( $post_vitrine_id, 'linkUrl_vitrine_0' . $metaboxUpdate, $_POST['linkUrl_0' . $metaboxUpdate . '_vitrine'] );
			update_post_meta( $post_vitrine_id, 'linkTarget_vitrine_0' . $metaboxUpdate, $_POST['linkTarget_0' . $metaboxUpdate . '_vitrine'] );
			update_post_meta( $post_vitrine_id, 'icon_vitrine_0' . $metaboxUpdate, $_POST['icon_0' . $metaboxUpdate . '_vitrine'] );
			update_post_meta( $post_vitrine_id, 'notes_vitrine_0' . $metaboxUpdate, $_POST['notes_0' . $metaboxUpdate . '_vitrine'] );
			}//fecha loop de update dos campos do metabox
		}// fecha if $post_vitrine
 	}// fecha function
	
	add_filter( 'template_include', 'include_template_function', 1 );

	function include_template_function( $template_path ) {
    if ( get_post_type() == 'post_vitrines' ) {
        if ( is_single() ) {
            // checks if the file exists in the theme first,
            // otherwise serve the file from the plugin
            //if ( $theme_file = locate_template( array ( 'single_vitrines.php' ) ) ) {
            //    $template_path = $theme_file;
            //} else {
                $template_path = plugin_dir_path( __FILE__ ) . '/templates/single_vitrines.php';
            // }
        }
    }
    return $template_path;
}
if (function_exists('add_theme_support')) {
        add_theme_support('post-thumbnails');
		add_image_size('vitrine_image', 320, 320, true);
		add_image_size('vitrine_highlight', 225, 140, true);
	}
load_plugin_textdomain( 'vitrine_conhecimento_bvs', false, basename( dirname( __FILE__ ) ) . '/languages' );
?>