<?php
/*
Plugin Name: Vitrine do Conhecimento BVSalud
Plugin URI: https://github.com/bireme/wp-vitrines
Description: Plugin para habilitar as Vitrines do Conhecimento no BVS Site.
Version: 2.0
Author: BIREME/OPAS/OMS - Ricardo de Castro
Author URI: http:/www.bvsalud.org/
Text Domain: wp-vitrines-master
Domain Path: /languages
*/

define( 'WP_VITRINES_PLUGIN_URL',  plugin_dir_url(__FILE__) );
define( 'WP_VITRINES_PLUGIN_PATH',  plugin_dir_path(__FILE__) );

require_once(WP_VITRINES_PLUGIN_PATH . '/settings.php');
require_once(WP_VITRINES_PLUGIN_PATH . '/plugin_functions.php');

add_thickbox();

function myplugin_load_textdomain() {
    load_plugin_textdomain( 'wp-vitrines-master', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'myplugin_load_textdomain' );

function create_post_vitrine() {
  register_post_type( 'post_vitrines',
        array(
            'labels' => array(
                'name' => __('Windows of Knowledge','wp-vitrines-master'),
                'singular_name' => __('Window of Knowledge','wp-vitrines-master'),
                'add_new' => __('Add New','wp-vitrines-master'),
                'add_new_item' => __('Add New Window','wp-vitrines-master'),
                'edit_item' => __('Edit Window','wp-vitrines-master'),
                'new_item' => __('New Window','wp-vitrines-master'),
                'view_item' => __('Show Window','wp-vitrines-master'),
                'search_items' => __('Serch Window','wp-vitrines-master'),
                'not_found' => __('Window Not Found','wp-vitrines-master'),
                'not_found_in_trash' => __('Window Not Found in Trash','wp-vitrines-master'),
                'parent' => __('Parent Window','wp-vitrines-master')
            ),
 
            'public' => true,
            'menu_position' => 15,
            'supports' => array( 'title', 'editor', 'thumbnail', 'revisions', 'custom-fields' ),
            'taxonomies' => array( '' ),
            'menu_icon' => 'dashicons-lightbulb',
            'has_archive' => true
        )
    );
}
add_action( 'init', 'create_post_vitrine' );
// remove quick edit for custom post type
// not needed if  Title is removed

function remove_row_actions( $unset_actions, $post ) {
  global $current_screen;

    if ( $current_screen->post_type != 'post_vitrines' ) return $unset_actions;
      unset( $unset_actions[ 'inline hide-if-no-js' ] );

    return $unset_actions;
}
add_filter( 'post_row_actions', 'remove_row_actions', 10, 2 );
// end of remove quick edit for custom post type

function my_admin() {
    add_meta_box( 'post_vitrine_meta_box',
        __('Window Components','wp-vitrines-master'),
        'display_post_vitrine_meta_box',
        'post_vitrines', 'normal', 'high'
    );
    add_meta_box( 'basic_vitrine_meta_box',
        __('Simplified layout','wp-vitrines-master'),
        'display_basic_vitrine_meta_box',
        'post_vitrines', 'normal', 'high'
    );
    add_meta_box( 'orderComponents_meta_box',
        __('Component arrangement','wp-vitrines-master'),
        'display_order_meta_box',
        'post_vitrines', 'side', 'high'
    );
    add_meta_box( 'adjustVitrine_meta_box',
        __(' Window settings','wp-vitrines-master'),
        'display_adjustVitrine_meta_box',
        'post_vitrines', 'side', 'high'
    );
}
add_action( 'admin_init', 'my_admin' );

function display_basic_vitrine_meta_box( $post_vitrine ) {
    wp_enqueue_media();

    //Carregando Custom Fields Gravados
    $basic_vitrine_title = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_title", true ) );
    $basic_vitrine_presentation = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_presentation", true ) );
    $basic_vitrine_presentation_bg = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_presentation_bg", true ) );
    $basic_vitrine_presentation_textColor = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_presentation_textColor", true ) );
    $basic_vitrine_presentation_id = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_presentation_id", true ) );

    //Custom Fields Infografico
    $infographic_collumns = esc_html (get_post_meta( $post_vitrine->ID, "infographic_collumns", true ) );
    for ($number_of_infographics=1; $number_of_infographics<=6; $number_of_infographics++) {
        ${'title_infografico_0'.$number_of_infographics} = esc_html (get_post_meta( $post_vitrine->ID, "title_infografico_0".$number_of_infographics, true ) );
        ${'text_infografico_0'.$number_of_infographics} = esc_html (get_post_meta( $post_vitrine->ID, "text_infografico_0".$number_of_infographics, true ) );
        ${'basic_vitrine_infografico_color_0'.$number_of_infographics} = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_infografico_color_0".$number_of_infographics, true ) );
        ${'basic_vitrine_infografico_id_0'.$number_of_infographics} = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_infografico_id_0".$number_of_infographics, true ) );
        ${'basic_vitrine_infografico_bg_0'.$number_of_infographics} = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_infografico_bg_0".$number_of_infographics, true ) );
    }
        
    //Custom fields videos
    $video_01 = esc_html (get_post_meta( $post_vitrine->ID, "video_01", true ) );
    $video_02 = esc_html (get_post_meta( $post_vitrine->ID, "video_02", true ) );
    $video_03 = esc_html (get_post_meta( $post_vitrine->ID, "video_03", true ) );
    $more_videos = esc_html (get_post_meta( $post_vitrine->ID, "more_videos", true ) );
    $more_videos_target = esc_html (get_post_meta( $post_vitrine->ID, "more_videos_target", true ) );
    $videos_id = esc_html (get_post_meta( $post_vitrine->ID, "videos_id", true ) );
    $videos_color = esc_html (get_post_meta( $post_vitrine->ID, "videos_color", true ) );
    $videos_bg = esc_html (get_post_meta( $post_vitrine->ID, "videos_bg", true ) );

    //Custom Fields relacionados ao modal de Textos
    $highlights_collumns = esc_html (get_post_meta( $post_vitrine->ID, "highlights_collumns", true ) );
    $texts_collumns = esc_html (get_post_meta( $post_vitrine->ID, "texts_collumns", true ) );
    for ($number_of_texts=1; $number_of_texts<=20; $number_of_texts++) {
        ${'texts_content_0'.$number_of_texts.'_title'} = esc_html (get_post_meta( $post_vitrine->ID, "texts_content_0".$number_of_texts."_title", true ) );
        ${'texts_vitrine_content_0'.$number_of_texts} = esc_html (get_post_meta( $post_vitrine->ID, "texts_vitrine_content_0".$number_of_texts, true ) );
        ${'texts_vitrine_content_color_0'.$number_of_texts} = esc_html (get_post_meta( $post_vitrine->ID, "texts_vitrine_content_color_0".$number_of_texts, true ) );
        ${'texts_vitrine_content_id_0'.$number_of_texts} = esc_html (get_post_meta( $post_vitrine->ID, "texts_vitrine_content_id_0".$number_of_texts, true ) );
        ${'texts_vitrine_content_bg_0'.$number_of_texts} = esc_html (get_post_meta( $post_vitrine->ID, "texts_vitrine_content_bg_0".$number_of_texts, true ) );
    }

    //responsibility
    $responsibility = esc_html (get_post_meta( $post_vitrine->ID, "responsibility", true ) );
    $responsibility_color = esc_html (get_post_meta( $post_vitrine->ID, "responsibility_color", true ) );
    $responsibility_bg = esc_html (get_post_meta( $post_vitrine->ID, "responsibility_bg", true ) );

    //custom css
    $my_css = esc_html (get_post_meta( $post_vitrine->ID, "my_css", true ) );

    //Loop Custom fields Texts and Images
    for ($number_of_fields=1; $number_of_fields<=20; $number_of_fields++) {
        ${'basic_content_0'.$number_of_fields.'_title'} = esc_html (get_post_meta( $post_vitrine->ID, "basic_content_0".$number_of_fields."_title", true ) );
        ${'image_url_0'.$number_of_fields} = esc_html (get_post_meta( $post_vitrine->ID, "image_url_0".$number_of_fields, true ) );
        ${'basic_vitrine_content_0'.$number_of_fields} = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_content_0".$number_of_fields, true ) );
        ${'basic_vitrine_content_color_0'.$number_of_fields} = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_content_color_0".$number_of_fields, true ) );
        ${'basic_vitrine_content_id_0'.$number_of_fields} = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_content_id_0".$number_of_fields, true ) );
        ${'basic_vitrine_content_bg_0'.$number_of_fields} = esc_html (get_post_meta( $post_vitrine->ID, "basic_vitrine_content_bg_0".$number_of_fields, true ) );
    }
?>
    <div class="basic_vitrine_description">
        <p><i class="fas fa-info-circle"></i> <?php echo esc_html( __( "In the menu below you can create your Window with text, images, videos and other content without Page Builder.", 'wp-vitrines-master' ) ); ?></p>
    </div>
    <div class="spacer"></div>    
    <div class="box_modal" id="modal-window-vitrinePresentation">
        <div class="summary">
            <a onclick="mudarEstado('presentation_box')" title="<?php _e( 'Presentation of the theme', 'wp-vitrines-master' ); ?>"><i class="fas fa-align-justify bv-icon"></i><?php _e( 'Presentation', 'wp-vitrines-master' ); ?></a>
        </div>
        <div class="vitrine_box" id="presentation_box" style="display: none;">
            <div class="row">
                <div class="col-100">
                    <div class="helper">
                        <i class="fas fa-info-circle"></i> <?php _e( 'Area for presentation of the theme of the Window, this content will appear just below the highlighted components.', 'wp-vitrines-master' ) ?>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-100">
                    <label><?php _e( 'Title', 'wp-vitrines-master' ) ?>:<i><?php _e( 'optional content', 'wp-vitrines-master' ) ?></i></label><br>
                    <input type="text" class="vitrine_title" name="basic_vitrine_title" value="<?php echo $basic_vitrine_title; ?>" />                
                </div>
            </div>
            <div class="row">
                <div class="col-100 vitrine_text_editor">
                <?php
                    $content   = html_entity_decode($basic_vitrine_presentation); 
                    $editor_id = 'basic_vitrine_presentation';
                    $settings  = array( 
                        'media_buttons' => true,
                        'wpautop'=> false,
                        'default_editor'=> false,
                        'editor_height' => 100
                    );    
                    wp_editor($content, $editor_id, $settings);
                ?>
                </div>
            </div>
            <div class="row">
                <hr />
                <h2 class=""><?php _e( 'Customize', 'wp-vitrines-master' ) ?>:</h2>
            </div>
            <div class="row">
                <div class="col-30">
                    <label><?php _e( 'ID', 'wp-vitrines-master' ) ?>: </label>
                    <input type="text" class="basic_vitrine_presentation_id input_id" name="basic_vitrine_presentation_id" value="<?php echo $basic_vitrine_presentation_id; ?>" />
                </div>
                <div class="col-30">
                    <label><?php _e( 'Text Color', 'wp-vitrines-master' ) ?>: </label>
                    <?php if (empty($basic_vitrine_presentation_textColor)) { $basic_vitrine_presentation_textColor = "#000000"; } ?>
                    <input type="color" class="basic_vitrine_presentation_textColor" name="basic_vitrine_presentation_textColor" value="<?php echo $basic_vitrine_presentation_textColor; ?>" />
                </div>
                <div class="col-30">
                    <label><?php _e( 'Background Color', 'wp-vitrines-master' ) ?>: </label>
                    <?php if (empty($basic_vitrine_presentation_bg)) { $basic_vitrine_presentation_bg = "#FFFFFF"; } ?>
                    <input type="color" class="basic_vitrine_presentation_bg" name="basic_vitrine_presentation_bg" value="<?php echo $basic_vitrine_presentation_bg; ?>" />
                </div>
            </div>
            <div class="spacer"></div>
        </div>    
    </div>
    <div class="spacer"></div>
    <div class="box_modal" id="modal-window-imagesAndTexts">
        <div class="summary">
            <a onclick="mudarEstado('highlights_box')" title="<?php _e( 'Main Content', 'wp-vitrines-master' ); ?>"><i class="far fa-image bv-icon"></i><?php _e( 'Main Content', 'wp-vitrines-master' ); ?></a>
        </div>
        <div class="vitrine_box" id="highlights_box" style="display: none;">
            <div class="row">
                <div class="col-100">
                    <div class="helper">
                        <p>
                            <i class="fas fa-info-circle"></i>
                            <?php _e( 'Main Content ...', 'wp-vitrines-master' ) ?>
                        </p>
                    </div>
                </div>
            </div>
            <div class="row center">
                    <span class="comp_info"><?php _e( 'Select the number of columns to display the main content', 'wp-vitrines-master' ) ?>:</span><br>
                    <?php
                        $selected_option = $highlights_collumns;
                    ?>
                    <select name="highlights_collumns" id="highlights_collumns">
                        <option value="1" <?php selected($selected_option, '1') ?>><?php _e( '1 column', 'wp-vitrines-master' ) ?></option>
                        <option value="2" <?php selected($selected_option, '2') ?>><?php _e( '2 columns', 'wp-vitrines-master' ) ?></option>
                    </select>
            </div>
            <div class="spacer"></div>
            <hr />
            <?php for ($number_of_fields=1; $number_of_fields<=20; $number_of_fields ++) { ?>
                <?php 
                    if ($number_of_fields >= 6) {
                        $show = 'none';
                    }
                    else {
                        $show = 'block';
                    }
                ?>
                <div class="row" id="boxHighlight_<?php echo $number_of_fields; ?>" style="display: <?php echo $show; ?>">
                    <div class="col-5">
                        <p><?php echo $number_of_fields; ?></p>
                    </div>
                    <div class="col-75">
                        <div class="row">
                            <label><?php _e( 'Title', 'wp-vitrines-master' ) ?>: <i><?php _e( 'optional content', 'wp-vitrines-master' ) ?></i></label><br>
                            <input type="text" class="basic_content_title input100" name="basic_content_0<?php echo $number_of_fields; ?>_title" value="<?php echo ${'basic_content_0'. $number_of_fields .'_title'}; ?>">
                        </div>
                        <?php 
                            $content   = html_entity_decode(${'basic_vitrine_content_0'.$number_of_fields}); 
                            $editor_id = 'basic_vitrine_content_0' . $number_of_fields;
                            $settings  = array( 
                                    'media_buttons' => true,
                                    'wpautop'=> false,
                                    'default_editor'=> false,
                                    'editor_height' => 100
                                );    
                            wp_editor($content, $editor_id, $settings);
                        ?>
                    </div>
                    <div class="col-20">
                        <div class="row">
                            <h2 class=""><?php _e( 'Customize', 'wp-vitrines-master' ) ?></h2>
                            <label><?php _e( 'Id', 'wp-vitrines-master' ) ?>:</label><br>
                            <input type="text" class="basic_vitrine_content_id input_id" name="basic_vitrine_content_id_0<?php echo $number_of_fields; ?>" value="<?php echo ${'basic_vitrine_content_id_0'.$number_of_fields}; ?>" /><br>
                            <label><?php _e( 'Text Color', 'wp-vitrines-master' ) ?>:</label><br>
                            <?php if (empty(${'basic_vitrine_content_color_0'.$number_of_fields})) { ${'basic_vitrine_content_color_0'.$number_of_fields} = "#000000"; } ?>
                            <input type="color" class="basic_vitrine_content_color" name="basic_vitrine_content_color_0<?php echo $number_of_fields; ?>" value="<?php echo ${'basic_vitrine_content_color_0'.$number_of_fields}; ?>" /><br>
                            <label><?php _e( 'Background color', 'wp-vitrines-master' ) ?>:</label><br>
                            <?php if (empty(${'basic_vitrine_content_bg_0'.$number_of_fields})) { ${'basic_vitrine_content_bg_0'.$number_of_fields} = "#FFFFFF"; } ?>
                            <input type="color" class="basic_vitrine_content_bg" name="basic_vitrine_content_bg_0<?php echo $number_of_fields; ?>" value="<?php echo ${'basic_vitrine_content_bg_0'.$number_of_fields}; ?>" />
                        </div>
                    </div>
                <div class="spacer"></div>
                <hr />
                </div>
                <?php if ($number_of_fields==5) { ?>
                    <button style="display: <?php echo $show; ?>" id="button_6" type="button" onclick="mudarEstado('boxHighlight_6'), mudarEstado('boxHighlight_7'), mudarEstado('boxHighlight_8'), mudarEstado('boxHighlight_9'), mudarEstado('boxHighlight_10'), mudarEstado('button_6'), mudarEstado('button_11')"><?php _e( 'Show More', 'wp-vitrines-master' ) ?></button>
                <?php } elseif ($number_of_fields==10) { ?>
                    <button style="display: <?php echo $show; ?>" id="button_11" type="button" onclick="mudarEstado('boxHighlight_11'), mudarEstado('boxHighlight_12'), mudarEstado('boxHighlight_13'), mudarEstado('boxHighlight_14'), mudarEstado('boxHighlight_15'), mudarEstado('button_11'), mudarEstado('button_16')"><?php _e( 'Show More', 'wp-vitrines-master' ) ?></button>
                <?php } elseif ($number_of_fields==15) { ?>
                    <button style="display: <?php echo $show; ?>" id="button_16" type="button" onclick="mudarEstado('boxHighlight_16'), mudarEstado('boxHighlight_17'), mudarEstado('boxHighlight_18'), mudarEstado('boxHighlight_19'), mudarEstado('boxHighlight_20'), mudarEstado('button_16')"><?php _e( 'Show More', 'wp-vitrines-master' ) ?></button>
                <?php } ?>
            <?php } ?>
            <div class="spacer"></div>
        </div>
    </div>

    <?php // Modal Infográfico ?>
    <div class="spacer"></div>
    <div class="box_modal" id="modal-window-infografico">
        <div class="summary">
            <a onclick="mudarEstado('infographic_box')" title="<?php _e( 'Infographics, images, graphs, tables, etc.', 'wp-vitrines-master' ); ?>"><i class="fas fa-chart-line bv-icon"></i><?php _e( 'Infographics, images, graphs, tables, etc.', 'wp-vitrines-master' ); ?></a>
        </div>
        <div class="vitrine_box" id="infographic_box" style="display: none;">
            <div class="row center">
                <span class="comp_info"><?php _e( 'Select the number of columns to display the content', 'wp-vitrines-master' ) ?>:</span><br>
                <?php
                    $selected_option = $infographic_collumns;
                ?>
                <select name="infographic_collumns" id="infographic_collumns">
                    <option value="1" <?php selected($selected_option, '1') ?>><?php _e( '1 column', 'wp-vitrines-master' ) ?></option>
                    <option value="2" <?php selected($selected_option, '2') ?>><?php _e( '2 columns', 'wp-vitrines-master' ) ?></option>
                    <option value="3" <?php selected($selected_option, '3') ?>><?php _e( '3 columns', 'wp-vitrines-master' ) ?></option>
                </select>
            </div>

            <div class="row">
                <div class="col-100">
                    <div class="helper">
                        <i class="fas fa-info-circle"></i> <?php _e( 'Add the Embed code for the graphic element, you can also add text if necessary.', 'wp-vitrines-master' ) ?>
                    </div>
                </div>
            </div>
            <?php for ($number_of_infographics=1; $number_of_infographics<=6; $number_of_infographics++) { ?>
                <?php 
                    if ($number_of_infographics >= 2) {
                        $show = 'none';
                    }
                    else {
                        $show = 'block';
                    }
                ?>
                <div class="row" id="boxInfographics_0<?php echo $number_of_infographics; ?>" style="display: <?php echo $show; ?>">
                    <div class="col-5">
                    <?php echo $number_of_infographics; ?>
                    </div>
                    <div class="col-75">
                        <label><?php _e( 'Title', 'wp-vitrines-master' ) ?>: <i><?php _e( 'optional content', 'wp-vitrines-master' ) ?></i></label><br>
                        <input type="text" class="title_infografico input100" name="title_infografico_0<?php echo $number_of_infographics; ?>" value="<?php echo ${'title_infografico_0'.$number_of_infographics}; ?>" /><br>
                        <?php 
                            $content   = html_entity_decode(${'text_infografico_0'.$number_of_infographics}); 
                            $editor_id = 'text_infografico_0' . $number_of_infographics;
                            $settings  = array( 
                                'media_buttons' => true,
                                'wpautop'=> false,
                                'default_editor'=> false,
                                'editor_height' => 100
                            );        
                            wp_editor($content, $editor_id, $settings);
                        ?>
                    </div>
                    <div class="col-20">
                        <div class="row">
                            <h2 class=""><?php _e( 'Customize', 'wp-vitrines-master' ) ?></h2>
                            <label><?php _e( 'Id', 'wp-vitrines-master' ) ?>:</label><br>
                            <input type="text" class="basic_vitrine_infografico_id input_id" name="basic_vitrine_infografico_id_0<?php echo $number_of_infographics; ?>" value="<?php echo ${'basic_vitrine_infografico_id_0'.$number_of_infographics}; ?>" /><br>
                            <label><?php _e( 'Text Color', 'wp-vitrines-master' ) ?>:</label><br>
                            <?php if (empty(${'basic_vitrine_infografico_color_0'.$number_of_infographics})) { ${'basic_vitrine_infografico_color_0'.$number_of_infographics} = "#000000"; } ?>
                            <input type="color" class="basic_vitrine_infografico_color" name="basic_vitrine_infografico_color_0<?php echo $number_of_infographics; ?>" value="<?php echo ${'basic_vitrine_infografico_color_0'.$number_of_infographics}; ?>" /><br>
                            <label><?php _e( 'Background Color', 'wp-vitrines-master' ) ?>:</label><br>
                            <?php if (empty(${'basic_vitrine_infografico_bg_0'.$number_of_infographics})) { ${'basic_vitrine_infografico_bg_0'.$number_of_infographics} = "#FFFFFF"; } ?>
                            <input type="color" class="basic_vitrine_infografico_bg" name="basic_vitrine_infografico_bg_0<?php echo $number_of_infographics; ?>" value="<?php echo ${'basic_vitrine_infografico_bg_0'.$number_of_infographics}; ?>" />
                        </div>
                    </div>
                    <div class="spacer"></div>
                    <hr />
                </div>
            <?php } ?>
            <button style="display: block" id="button_info2" type="button" onclick="mudarEstado('boxInfographics_02'), mudarEstado('button_info2'), mudarEstado('button_info3')"> <?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
            <button style="display: none" id="button_info3" type="button" onclick="mudarEstado('boxInfographics_03'), mudarEstado('button_info3'), mudarEstado('button_info4')"> <?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
            <button style="display: none" id="button_info4" type="button" onclick="mudarEstado('boxInfographics_04'), mudarEstado('button_info4'), mudarEstado('button_info5')"> <?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
            <button style="display: none" id="button_info5" type="button" onclick="mudarEstado('boxInfographics_05'), mudarEstado('button_info5'), mudarEstado('button_info6')"> <?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
            <button style="display: none" id="button_info6" type="button" onclick="mudarEstado('boxInfographics_06'), mudarEstado('button_info6')"> <?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
        </div>
    </div>
    <?php // End of Modal Infográfico ?>

    <?php //Start of Modal Videos ?>
    <div class="spacer"></div>
    <div class="box_modal" id="modal-window-videos">
        <div class="summary">
            <a onclick="mudarEstado('videos_box')" title="<?php _e( 'Videos', 'wp-vitrines-master' ); ?>"><i class="fab fa-youtube bv-icon"></i><?php _e( 'Videos', 'wp-vitrines-master' ); ?></a>
        </div>
        <div class="vitrine_box" id="videos_box" style="display: none;">
            <div class="row">
                <div class="col-100">
                    <div class="helper">
                        <i class="fas fa-info-circle"></i> 
                        <?php _e( 'Include 1 to 3 Youtube videos. Use the video URL. Ex: https://www.youtube.com/watch?v=VyzucTwkrCI or https://youtu.be/VyzucTwkrCI', 'wp-vitrines-master' ) ?>
                        </div>
                </div>
            </div>
            <div class="row">
                <div class="col-80">
                    <div class="row">
                        <div class="col-30">
                            <label><?php _e( 'Video Code', 'wp-vitrines-master' ) ?> 01:</label><br>
                            <input type="url" class="video_01 input100" name="video_01" value="<?php echo $video_01; ?>" /><br>
                            <?php if ( $video_01 ) : ?>
                                <img src="https://img.youtube.com/vi/<?php echo get_video_code($video_01); ?>/default.jpg"><br>
                            <?php else : ?>
                                <img src="https://fakeimg.pl/120x90/?text=<?php _e( 'Video', 'wp-vitrines-master' ) ?> 01"><br>
                            <?php endif; ?>
                        </div>
                        <div class="col-30">
                            <label><?php _e( 'Video Code', 'wp-vitrines-master' ) ?> 02:</label><br>
                            <input type="url" class="video_02 input100" name="video_02" value="<?php echo $video_02; ?>" /><br>
                            <?php if ( $video_02 ) : ?>
                                <img src="https://img.youtube.com/vi/<?php echo get_video_code($video_02); ?>/default.jpg"><br>
                            <?php else : ?>
                                <img src="https://fakeimg.pl/120x90/?text=<?php _e( 'Video', 'wp-vitrines-master' ) ?> 02"><br>
                            <?php endif; ?>
                        </div>
                        <div class="col-30">
                            <label><?php _e( 'Video Code', 'wp-vitrines-master' ) ?> 03:</label><br>
                            <input type="url" class="video_03 input100" name="video_03" value="<?php echo $video_03; ?>" /><br>
                            <?php if ( $video_03 ) : ?>
                                <img src="https://img.youtube.com/vi/<?php echo get_video_code($video_03); ?>/default.jpg"><br>
                            <?php else : ?>
                                <img src="https://fakeimg.pl/120x90/?text=<?php _e( 'Video', 'wp-vitrines-master' ) ?> 03"><br>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="spacer"></div>
                    <div class="row">
                        <div class="col-60">
                            <label><?php _e( 'URL for link See more', 'wp-vitrines-master' ) ?>: </label><br>
                            <input type="text" class="more_videos input100" name="more_videos" value="<?php echo $more_videos; ?>" /><br>
                        </div>
                        <div class="col-30">
                            <label><?php _e( 'Open in new window', 'wp-vitrines-master' ) ?>?: </label><br>
                            <input type="checkbox" name="more_videos_target" id="more_videos_target" <?php echo ( $more_videos_target ) ? 'checked' : ''; ?> /><br>
                        </div>
                    </div>
                </div>
                <div class="col-20">
                    <div class="row">
                        <h2 class=""><?php _e( 'Customize', 'wp-vitrines-master' ) ?></h2>
                        <label><?php _e( 'ID:', 'wp-vitrines-master' ) ?>:</label><br>
                        <input type="text" class="videos_id input_id" name="videos_id" value="<?php echo $videos_id; ?>" /><br>
                        <label><?php _e( 'Text Color', 'wp-vitrines-master' ) ?>:</label><br>
                        <?php if (empty($videos_color)) { $videos_color = "#000000"; } ?>
                        <input type="color" class="videos_color" name="videos_color" value="<?php echo $videos_color; ?>" /><br>
                        <label><?php _e( 'Background Color', 'wp-vitrines-master' ) ?>:</label><br>
                        <?php if (empty($videos_bg)) { $videos_bg = "#FFFFFF"; } ?>
                        <input type="color" class="videos_bg" name="videos_bg" value="<?php echo $videos_bg; ?>" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php // Modal Textos ?>
    <div class="spacer"></div>
    <div class="box_modal" id="modal-window-texts">
        <div class="summary">
            <a  onclick="mudarEstado('texts_box')" title="<?php _e( 'Links to publications, documents and related or recommended sites ', 'wp-vitrines-master' ); ?>:"><i class="fas fa-font bv-icon"></i><?php _e( 'Links to publications, documents and related or recommended sites ', 'wp-vitrines-master' ); ?>:</a>
        </div>
        <div class="vitrine_box" id="texts_box" style="display: none;">
            <div class="row center">
                <span class="comp_info"><?php _e( 'Select the number of columns to display the main content ', 'wp-vitrines-master' ) ?>::</span><br>
                <?php $selected_option = $texts_collumns; ?>
                <select name="texts_collumns" id="texts_collumns">
                    <option value="1" <?php selected($selected_option, '1') ?>>1 <?php _e( 'column', 'wp-vitrines-master' ) ?></option>
                    <option value="2" <?php selected($selected_option, '2') ?>>2 <?php _e( 'columns', 'wp-vitrines-master' ) ?></option>
                    <option value="3" <?php selected($selected_option, '3') ?>>3 <?php _e( 'columns', 'wp-vitrines-master' ) ?></option>
                </select>
            </div>
            <?php for ($number_of_texts=1; $number_of_texts<=20; $number_of_texts++) { ?>
                <?php 
                    if ($number_of_texts >= 6) {
                        $show = 'none';
                    }
                    else {
                        $show = 'block';
                    }
                ?>
                <div class="row" id="boxTexts_<?php echo $number_of_texts; ?>" style="display: <?php echo $show; ?>">
                    <div class="col-5">
                        <p><?php echo $number_of_texts; ?></p>
                    </div>
                    <div class="col-75">
                        <div class="row">
                            <label><?php _e( 'Title', 'wp-vitrines-master' ) ?>: <i><?php _e( 'optional content', 'wp-vitrines-master' ) ?></i></label><br>
                            <input type="text" class="texts_content_title input100" name="texts_content_0<?php echo $number_of_texts; ?>_title" value="<?php echo ${'texts_content_0'. $number_of_texts .'_title'}; ?>">
                        </div>
                        <?php 
                            $content   = html_entity_decode(${'texts_vitrine_content_0'.$number_of_texts}); 
                            $editor_id = 'texts_vitrine_content_0' . $number_of_texts;
                            $settings  = array( 
                                    'media_buttons' => true,
                                    'wpautop'=> false,
                                    'default_editor'=> false,
                                    'editor_height' => 100
                                );    
                            wp_editor($content, $editor_id, $settings);
                        ?>
                    </div>
                    <div class="col-20">
                        <div class="row">
                            <h2 class=""><?php _e( 'Customize', 'wp-vitrines-master' ) ?></h2>
                            <label><?php _e( 'ID:', 'wp-vitrines-master' ) ?>:</label><br>
                            <input type="text" class="texts_vitrine_content_id input_id" name="texts_vitrine_content_id_0<?php echo $number_of_texts; ?>" value="<?php echo ${'texts_vitrine_content_id_0'.$number_of_texts}; ?>" /><br>
            
                            <label><?php _e( 'Text Color', 'wp-vitrines-master' ) ?>:</label><br>
                            <?php if (empty(${'texts_vitrine_content_color_0'.$number_of_texts})) { ${'texts_vitrine_content_color_0'.$number_of_texts} = "#000000"; } ?>
                            <input type="color" class="texts_vitrine_content_color" name="texts_vitrine_content_color_0<?php echo $number_of_texts; ?>" value="<?php echo ${'texts_vitrine_content_color_0'.$number_of_texts}; ?>" /><br>
                            <label><?php _e( 'Background Color', 'wp-vitrines-master' ) ?>:</label><br>
                            <?php if (empty(${'texts_vitrine_content_bg_0'.$number_of_texts})) { ${'texts_vitrine_content_bg_0'.$number_of_texts} = "#FFFFFF"; } ?>
                            <input type="color" class="texts_vitrine_content_bg" name="texts_vitrine_content_bg_0<?php echo $number_of_texts; ?>" value="<?php echo ${'texts_vitrine_content_bg_0'.$number_of_texts}; ?>" />
                        </div>
                    </div>
                    <div class="spacer"></div>
                    <hr />
                </div>
                <?php if ($number_of_texts==5) { ?>
                    <button style="display: <?php echo $show; ?>" id="button_t6" type="button" onclick="mudarEstado('boxTexts_6'), mudarEstado('boxTexts_7'), mudarEstado('boxTexts_8'), mudarEstado('boxTexts_9'), mudarEstado('boxTexts_10'), mudarEstado('button_t6'), mudarEstado('button_t11')"><?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
                <?php } elseif ($number_of_texts==10) { ?>
                    <button style="display: <?php echo $show; ?>" id="button_t11" type="button" onclick="mudarEstado('boxTexts_11'), mudarEstado('boxTexts_12'), mudarEstado('boxTexts_13'), mudarEstado('boxTexts_14'), mudarEstado('boxTexts_15'), mudarEstado('button_t11'), mudarEstado('button_t16')"><?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
                <?php } elseif ($number_of_texts==15) { ?>
                    <button style="display: <?php echo $show; ?>" id="button_t16" type="button" onclick="mudarEstado('boxTexts_16'), mudarEstado('boxTexts_17'), mudarEstado('boxTexts_18'), mudarEstado('boxTexts_19'), mudarEstado('boxTexts_20'), mudarEstado('button_t16')"><?php _e( 'Show more', 'wp-vitrines-master' ) ?> </button>
                <?php } ?>
            <?php } ?> 
            <div class="spacer"></div>
        </div>
    </div>

    <?php //modal-window-responsibility ?>
    <div class="spacer"></div>
    <div class="box_modal" id="modal-window-responsibility">
        <div class="summary">
            <a  onclick="mudarEstado('responsabilit_box')" title="<?php _e( 'Authorship and collaborators', 'wp-vitrines-master' ); ?>"><i class="fas fa-user-check bv-icon"></i><?php _e( 'Authorship and collaborators', 'wp-vitrines-master' ); ?></a>
        </div>
        <div class="vitrine_box" id="responsabilit_box" style="display: none;">
            <div class="row">
                <div class="col-100">
                    <div class="helper">
                        <i class="fas fa-info-circle"></i> 
                        <?php _e( 'Special thanks or contacts area', 'wp-vitrines-master' ) ?>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-100">
                    <?php 
                        $content   = html_entity_decode($responsibility, ENT_COMPAT, 'UTF-8');
                        $editor_id = 'responsibility';
                        $settings  = array(
                            'media_buttons' => true,
                            'wpautop'=> false,
                            'default_editor'=> false,
                            'editor_height' => 100
                        );
                        wp_editor($content, $editor_id, $settings);
                    ?>
                </div>
            </div>
        </div>
    </div>

    <?php //Modal CSS ?>
    <div class="spacer"></div>
    <div class="box_modal" id="modal-window-css" style="display: none_S;">
        <div class="summary">
            <a  onclick="mudarEstado('csseditor_box')" title="<?php _e( 'CSS Editor', 'wp-vitrines-master' ); ?>"><i class="fas fa-code bv-icon"></i><?php _e( 'CSS Editor', 'wp-vitrines-master' ); ?></a>
        </div>
        <div class="vitrine_box" id="csseditor_box" style="display: none;">
            <div class="row">
                <div class="col-100">
                    <div class="helper">
                        <i class="fas fa-info-circle"></i> 
                        <?php _e( 'Use this editor if you need to configure something specific to this Window. The CSS included in this field will only affect this Window.', 'wp-vitrines-master' ) ?>
                    </div>
                </div>
                <div class="row">
                    <label><?php _e( 'Your CSS', 'wp-vitrines-master' ) ?></label><br>
                    <textarea name="my_css" rows="8" class="input100 csstextarea"><?php echo $my_css; ?></textarea>
                </div>
            </div>
        </div>
    </div>
    <div class="spacer"></div>
<?php
} //End of display_basic_vitrine_meta_box
?>
<?php
function display_post_vitrine_meta_box( $post_vitrine ) {
?>
    <div class="vitrine_description">
        <p><?php echo esc_html( __( "In the fields below we can create the highlighted components of the Window, at least 4 and at most 8 components, the system will organize the best display of the highlighted components and  images.", 'wp-vitrines-master' ) ); ?></p>
    </div>
    <?php
        for ($metaboxID=1; $metaboxID<=8; $metaboxID++) { //abre o loop dos componentes 
            //On Off Metabox
            ${"vitrine_onOff_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "onOff_vitrine_0" . $metaboxID . "", true ) );
            // Titulo do Metabox
            ${"vitrine_title_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "title_vitrine_0" . $metaboxID . "", true ) );
            // Link do titulo do Metabox
            ${"vitrine_titleLink_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "titleLink_vitrine_0" . $metaboxID . "", true ) );
            // linkTitleTarget do Metabox
            ${"vitrine_linkTitleTarget_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkTitleTarget_vitrine_0" . $metaboxID . "", true ) );
            // Cor do titulo do Metabox
            ${"vitrine_titleColor_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "titleColor_vitrine_0" . $metaboxID . "", true ) );
            // text do Metabox
            ${"vitrine_text_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "text_vitrine_0" . $metaboxID . "", true ) );
            // linkText do Metabox
            ${"vitrine_linkText_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkText_vitrine_0" . $metaboxID . "", true ) );
            // linkTarget do Metabox
            ${"vitrine_linkTarget_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkTarget_vitrine_0" . $metaboxID . "", true ) );
            // linkUrl do Metabox
            ${"vitrine_linkUrl_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkUrl_vitrine_0" . $metaboxID . "", true ) );    
            // linkColor do Metabox
            ${"vitrine_linkColor_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "linkColor_vitrine_0" . $metaboxID . "", true ) );    
            // Tipo de Icone
            ${"vitrine_imageType_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "imageType_vitrine_0" . $metaboxID . "", true ) );
            // icon do Metabox
            ${"vitrine_icon_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "icon_vitrine_0" . $metaboxID . "", true ) );
            // iconCor do Metabox
            ${"vitrine_iconColor_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "iconColor_vitrine_0" . $metaboxID . "", true ) );
            // imageURL do Metabox
            ${"vitrine_imageURL_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "imageURL_vitrine_0" . $metaboxID . "", true ) );
            // notes do Metabox
            ${"vitrine_notes_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "notes_vitrine_0" . $metaboxID . "", true ) );
    ?>
            <!-- Início do Loop do Componente 01 de 08 --->
            <div class="componente_box compontente_<?php echo $metaboxID; ?>">
                <h1 class="componente_title"><?php _e( 'Component', 'wp-vitrines-master' ) ?> 0<?php echo $metaboxID; ?> <i><?php echo ${"vitrine_title_0$metaboxID"}; ?></i></h1>
                <div class="componente_content" id="content_comp01">
                    <div class="row">
                        <div class="col-100">
                            <p><?php _e( 'Public Content', 'wp-vitrines-master' ) ?>: </p>
                            <div class="onoffswitch">
                                <?php if(${"vitrine_onOff_0$metaboxID"} == "on") ${"field_id_checked_0$metaboxID"} = 'checked="checked"'; ?>
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
                            <label><?php _e( 'Component Title', 'wp-vitrines-master' ) ?>:</label><br>
                            <input type="text" class="vitrine_title" name="title_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_title_0$metaboxID"}; ?>" />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-60">
                            <label><?php _e( 'Link', 'wp-vitrines-master' ) ?>: </label><br>
                            <input type="text" class="vitrine_title_link input100" name="titleLink_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_titleLink_0$metaboxID"}; ?>" />
                        </div>
                        <div class="col-20">
                            <label><?php _e( 'Title Color', 'wp-vitrines-master' ) ?>: </label><br>
                            <?php if (empty(${"vitrine_titleColor_0$metaboxID"})) { ${"vitrine_titleColor_0$metaboxID"} = "#00539c"; } ?>
                            <input type="color" class="vitrine_titleColor" name="titleColor_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_titleColor_0$metaboxID"}; ?>" />
                        </div>
                        <div class="col-20">
                            <label><?php _e( 'Open in new window', 'wp-vitrines-master' ) ?>?: </label><br>
                            <?php if(${"vitrine_linkTitleTarget_0$metaboxID"} == "on") ${"field_linkTitleTarget_checked_0$metaboxID"} = 'checked="checked"'; ?>
                            <input type="checkbox" name="linkTitleTarget_0<?php echo $metaboxID; ?>_vitrine" id="linkTitleTarget_0<?php echo $metaboxID; ?>_vitrine" <?php echo ${"field_linkTitleTarget_checked_0$metaboxID"}; ?> />
                        </div>
                    </div>
                    <div class="row">
                        <hr />
                        <div class="col-100 vitrine_text_editor">
                            <?php 
                                $content   = html_entity_decode(${"vitrine_text_0$metaboxID"}); 
                                $editor_id = 'text_0'. $metaboxID .'_vitrine';
                                $settings  = array( 
                                        'media_buttons' => true,
                                        'wpautop'=> false,
                                        'default_editor'=> false,
                                        'editor_height' => 100
                                    );    
                                wp_editor($content, $editor_id, $settings);
                            ?>    
                        </div>
                    </div>
                    <hr />
                    <div class="spacer"></div>
                    <div class="row">
                        <div class="col-50 icon_select">
                            <label><?php _e( 'Icon', 'wp-vitrines-master' ) ?>: </label><br>
                            <span class="comp_info"><?php _e( 'Select the source of the icon that represents the component', 'wp-vitrines-master' ) ?>:</span><br>
                            <?php
                                $selected_option = ${"vitrine_imageType_0$metaboxID"};
                            ?>
                            <select name="imageType_0<?php echo $metaboxID; ?>_vitrine" id="imageType_0<?php echo $metaboxID; ?>_vitrine">
                                <option value="1" <?php selected($selected_option, '1') ?>><?php _e( 'FontAwesome', 'wp-vitrines-master' ) ?></option>
                                <option value="2" <?php selected($selected_option, '2') ?>><?php _e( 'Image URL', 'wp-vitrines-master' ) ?></option>
                            </select>
                        </div> 
                        <div class="col-50 icon-image">
                            <br>
                            <label><?php _e( 'Image URL', 'wp-vitrines-master' ) ?>: </label><br>
                            <input type="text" name="imageURL_0<?php echo $metaboxID; ?>_vitrine" id="imageURL_0<?php echo $metaboxID; ?>_vitrine" class="regular-text" value="<?php echo ${"vitrine_imageURL_0$metaboxID"}; ?>">                
                        </div>
                        <div class="spacer"></div>
                    </div>
                    <div class="spacer"></div>
                    <div class="row">
                        <div class="col-30 icon_select">
                            <div class="jquery-script-clear"></div>
                            <label><?php _e( 'FontAwesome Icons', 'wp-vitrines-master' ) ?>:</label><br>
                            <input type="text" class="input<?php echo $metaboxID; ?> vitrine_icon" name="icon_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_icon_0$metaboxID"}; ?>" /><br>
                        </div>
                        <div class="col-30">
                            <label><?php _e( 'Icon Color', 'wp-vitrines-master' ) ?>:<br>
                            <?php if (empty(${"vitrine_iconColor_0$metaboxID"})) { ${"vitrine_iconColor_0$metaboxID"} = "#00539c"; } ?>
                            <input type="color" class="data_color" name="iconColor_0<?php echo $metaboxID; ?>_vitrine" value="<?php echo ${"vitrine_iconColor_0$metaboxID"}; ?>" /><br>
                        </div>   
                    </div>
                    <div class="row">
                        <div class="col-100">
                            <label><?php _e( 'Notes', 'wp-vitrines-master' ) ?>: </label><br>
                            <textarea id="vitrine_notes_0<?php echo $metaboxID; ?>" name="notes_0<?php echo $metaboxID; ?>_vitrine"
                              rows="10"><?php echo ${"vitrine_notes_0$metaboxID"}; ?></textarea>
                            <span class="comp_info">
                            <?php _e( 'The Notes field is internal and only used for the website´s information team, you can attach information that you think is necessary.', 'wp-vitrines-master' ); ?>
                            </span><br>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Fim dos Componente no Loop -->
    <?php } // Fecha Loop dos componentes ?>
<?php } //fecha function display_post_vitrine_meta_box ?>
<?php 
// inserir aqui novo metabox 
function display_adjustVitrine_meta_box( $post_vitrine ) {
    //Caixa de Configurações da Vitrine
    $titleFont_color = esc_html (get_post_meta( $post_vitrine->ID, "titleFont_color", true ) );
    $titleBg_color = esc_html (get_post_meta( $post_vitrine->ID, "titleBg_color", true ) );
    $boxBorder_color = esc_html (get_post_meta( $post_vitrine->ID, "boxBorder_color", true ) );
    $boxLines_color = esc_html (get_post_meta( $post_vitrine->ID, "boxLines_color", true ) );
    $data = esc_html (get_post_meta( $post_vitrine->ID, "data", true ) );
    $presentation_font_size = esc_html (get_post_meta( $post_vitrine->ID, "presentation_font_size", true ) );
    $font_size = esc_html (get_post_meta( $post_vitrine->ID, "font_size", true ) );
    $showWPEditor = esc_html (get_post_meta( $post_vitrine->ID, "showWPEditor", true ) );
?>
    <div class="confBox">
        <div class="row">
            <div class="col-100">
                <span><b>WordPress Editor</b></span>
            </div>
        </div>
        <div class="row">
            <div class="col-70">
                <label><?php _e( 'Display WordPress Editor?', 'wp-vitrines-master' ) ?></label><br>
            </div>
            <div class="col-30">
                <?php if($showWPEditor == "on") $fieldShowWPEditor = 'checked="checked"'; ?>
                <input type="checkbox" name="showWPEditor" id="showWPEditor" <?php echo $fieldShowWPEditor; ?> />                    
            </div>
            <?php if ($showWPEditor == "on") : ?>
                <style>
                    #basic_vitrine_meta_box { display: none; }
                </style>
            <?php else : ?>
                <style>
                    #postdivrich { display: none; }
                </style>
            <?php endif; ?>
            <div class="spacer"></div>
        <hr />            
        </div>
        <div class="row">
            <div class="col-100">
                <span><b><?php _e( 'Window Title', 'wp-vitrines-master' ) ?></b></span>
            </div>
        </div>
        <div class="row">
            <div class="col-70">
                <label><?php _e( 'Text Color', 'wp-vitrines-master' ) ?></label><br>
            </div>
            <div class="col-30">
                <?php if (empty($titleFont_color)) { $titleFont_color = "#FFFFFF"; } ?>
                <input type="color" class="color" name="titleFont_color" value="<?php echo $titleFont_color; ?>" />
            </div>
            <div class="spacer"></div>
        </div>
        <div class="row">
            <div class="col-70">
                <label><?php _e( 'Background Color', 'wp-vitrines-master' ) ?></label><br>
            </div>
            <div class="col-30">
                <?php if (empty($titleBg_color)) { $titleBg_color = "#00539b"; } ?>
                <input type="color" class="color" name="titleBg_color" value="<?php echo $titleBg_color; ?>" />
            </div>
            <div class="spacer"></div>
        </div>
        <hr />
        <div class="row">
            <div class="col-100">
                <span><b><?php _e( 'Font Size', 'wp-vitrines-master' ) ?></b></span>
            </div>
        </div>
        <div class="row">
            <div class="col-70">
                <label><?php _e( 'Presentation', 'wp-vitrines-master' ) ?>:</label><br>
            </div>
            <div class="col-30">
                <?php if (empty($presentation_font_size)) { $presentation_font_size = "18px"; } ?>
                <input type="text" class="font_size" name="presentation_font_size" value="<?php echo $presentation_font_size; ?>" />
            </div>
            <div class="spacer"></div>
        </div>
        <div class="row">
            <div class="col-70">
                <label><?php _e( 'Window Texts', 'wp-vitrines-master' ) ?></label><br>
            </div>
            <div class="col-30">
                <?php if (empty($font_size)) { $font_size = "18px"; } ?>
                <input type="text" class="font_size" name="font_size" value="<?php echo $font_size; ?>" />
            </div>
            <div class="spacer"></div>
        </div>
        <hr />
        <div class="row">
            <div class="col-100">
                <span><b><?php _e( 'Borders', 'wp-vitrines-master' ) ?></b></span>
            </div>
        </div>
        <div class="row">
            <div class="col-70">
                <label><?php _e( 'Color of Boxes Borders, Images and Lines', 'wp-vitrines-master' ) ?></label><br>
            </div>
            <div class="col-30">
                <?php if (empty($boxBorder_color)) { $boxBorder_color = "#d3e8fb"; } ?>
                <input type="color" class="color" name="boxBorder_color" value="<?php echo $boxBorder_color; ?>" />
            </div>
            <div class="spacer"></div>
        </div>
        <hr />
        <div class="row">
            <div class="col-100">
                <i class="fas fa-info-circle"></i> 
                <?php _e( 'Date the content was updated. This item is important to inform the user of recent changes in the content.', 'wp-vitrines-master' ) ?>
            </div>
        </div>
        <div class="row">
            <div class="col-100">
                <label><?php _e( 'Date', 'wp-vitrines-master' ) ?>:</label><br>
                <input type="date" class="data" name="data" value="<?php echo $data; ?>" /><br>
            </div>
        </div>
        <div class="spacer"></div>
    </div>
<?php
}
?>
<?php
function display_order_meta_box( $post_vitrine ) {
    $order1 = esc_html (get_post_meta( $post_vitrine->ID, "order1", true ) );
    $order2 = esc_html (get_post_meta( $post_vitrine->ID, "order2", true ) );
    $order3 = esc_html (get_post_meta( $post_vitrine->ID, "order3", true ) );
    $order4 = esc_html (get_post_meta( $post_vitrine->ID, "order4", true ) );
    $order5 = esc_html (get_post_meta( $post_vitrine->ID, "order5", true ) );
    $order6 = esc_html (get_post_meta( $post_vitrine->ID, "order6", true ) );
    $order7 = esc_html (get_post_meta( $post_vitrine->ID, "order7", true ) );
    $order8 = esc_html (get_post_meta( $post_vitrine->ID, "order8", true ) );

    $metabox = get_post_meta( $post_vitrine->ID, "metabox", true );
    for ($metaboxID=1; $metaboxID<=8; $metaboxID++) { //abre o loop dos componEentes
        ${"vitrine_title_0$metaboxID"} = esc_html (get_post_meta( $post_vitrine->ID, "title_vitrine_0" . $metaboxID . "", true ) );
    }
?>
    <p><i class="fas fa-info-circle"></i> <?php echo esc_html( __( "Drag to change the order of the highlighted components  in the Window", 'wp-vitrines-master' ) ); ?></p>
    <ul id="sortableContainer">
        <?php
            $boxes = 0;
            for ($metaboxID=1; $metaboxID<=8; $metaboxID++) { //abre o loop dos componEentes
                $onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. $metaboxID, true ) );
                if ( $onOff == 'on' ) { 
                    $boxes ++;
                }
            }

            if ( $boxes >= 1 ) { 
                $btn_on = "display: block;";
                for ($metaboxID=1; $metaboxID<=8; $metaboxID++) { //abre o loop dos componEentes
                    $item = ${"order$metaboxID"};
                    ${"item_$metaboxID"} = substr(${"order$metaboxID"}, -1);
                    $value = ${"item_$metaboxID"};
                    $title = esc_html (get_post_meta( $post_vitrine->ID, "title_vitrine_0" . $value . "", true ) );
                    ?>
                    <li alt="ALT" title="<?php echo $title; ?>" class="ui-state-default" id="item-<?php echo ${"item_$metaboxID"};?>">
                    <?php
                    echo "<i class='fas fa-sort item_icon'></i>";
                    echo $metaboxID;
                    echo ". ";
                    echo "<span class='number_component'>";
                    echo ${"item_$metaboxID"};
                    echo "</span>";
                    $onOff = ( get_post_meta( get_the_ID(), 'onOff_vitrine_0'. ${"item_$metaboxID"}, true ) );
                    if ( $onOff != 'on' ) { 
                        echo "<span class='component_off'>";
                        echo esc_html( __( "DISABLED", 'wp-vitrines-master' ) );
                        echo "</span>";                            
                    }    
                    //echo $title;
                    echo substr($title, 0, 30);
                    echo "...";
                    echo "</li>";
                } //fecho loop
            } else {  
                $btn_on = "display: none;";
                ?>
                <b><?php _e( 'The order of the components can only be changed after saving the post', 'wp-vitrines-master' ) ?></b>
                <?php 
            };
        ?>
    </ul>
    <?php
        $varTextOrder = __( 'Update order of the components', 'wp-vitrines-master' );
        $varTextUpdated = __( 'Updated', 'wp-vitrines-master' );
    ?>

    <div id="btnArea" style="<?php echo $btn_on; ?>"></div>
    <div id="msg"></div>
    <div id="resultado" style="display: none;">

    <?php
        for ($metaboxID=1; $metaboxID<=8; $metaboxID++) { //abre o loop dos componEentes
            $item = ${"order$metaboxID"};
            ${"item_$metaboxID"} = substr(${"order$metaboxID"}, -1);
            $value = ${"item_$metaboxID"};
            $title = esc_html (get_post_meta( $post_vitrine->ID, "title_vitrine_0" . $value . "", true ) );
            ?>
                <label>Posição do Box<?php echo $metaboxID; ?> :</label>
                <?php if (empty(${"order$metaboxID"})) { ?>
                    <input type='text' id="position<?php echo $metaboxID; ?>" class='position' name='order<?php echo $metaboxID; ?>' value='item-<?php echo $metaboxID; ?>' />
                <?php } else { ?>
                    <input type='text' id="position<?php echo $metaboxID; ?>" class='position' name='order<?php echo $metaboxID; ?>' value='<?php echo ${"order$metaboxID"}; ?>' />
                <?php } ?>
                <br>
        <?php } //fecho loop
    ?>
    </div>
    <div class="spacer"></div>
<?php 
} // fecha function display_order_meta_box
?>
<?php
function add_post_vitrine_fields( $post_vitrine_id, $post_vitrine ) {
    // Check post type for post_vitrines
    if ( $post_vitrine->post_type == 'post_vitrines' ) {
        //Store data in post meta table if present in post data
        //Custom Fields da Versão Basica da Vitrine - Apresentação
        update_post_meta( $post_vitrine_id, 'basic_vitrine_title', $_POST['basic_vitrine_title'] );
        update_post_meta( $post_vitrine_id, 'basic_vitrine_presentation', $_POST['basic_vitrine_presentation'] );
        update_post_meta( $post_vitrine_id, 'basic_vitrine_presentation_textColor', $_POST['basic_vitrine_presentation_textColor'] );
        update_post_meta( $post_vitrine_id, 'basic_vitrine_presentation_bg', $_POST['basic_vitrine_presentation_bg'] );
        update_post_meta( $post_vitrine_id, 'basic_vitrine_presentation_id', $_POST['basic_vitrine_presentation_id'] );

        // Order dos MetaBoxes
        update_post_meta( $post_vitrine_id, 'order1', $_POST['order1'] );
        update_post_meta( $post_vitrine_id, 'order2', $_POST['order2'] );
        update_post_meta( $post_vitrine_id, 'order3', $_POST['order3'] );
        update_post_meta( $post_vitrine_id, 'order4', $_POST['order4'] );
        update_post_meta( $post_vitrine_id, 'order5', $_POST['order5'] );
        update_post_meta( $post_vitrine_id, 'order6', $_POST['order6'] );
        update_post_meta( $post_vitrine_id, 'order7', $_POST['order7'] );
        update_post_meta( $post_vitrine_id, 'order8', $_POST['order8'] );

        // Infografico Tableu custom fields
        update_post_meta( $post_vitrine_id, 'infographic_collumns', $_POST['infographic_collumns'] );
        for ($number_of_infographics=1; $number_of_infographics<=6; $number_of_infographics++) {
            update_post_meta( $post_vitrine_id, 'title_infografico_0' . $number_of_infographics, $_POST['title_infografico_0' . $number_of_infographics] );
            update_post_meta( $post_vitrine_id, 'text_infografico_0' . $number_of_infographics, $_POST['text_infografico_0' . $number_of_infographics] );
            update_post_meta( $post_vitrine_id, 'basic_vitrine_infografico_color_0' . $number_of_infographics, $_POST['basic_vitrine_infografico_color_0' . $number_of_infographics] );
            update_post_meta( $post_vitrine_id, 'basic_vitrine_infografico_bg_0' . $number_of_infographics, $_POST['basic_vitrine_infografico_bg_0' . $number_of_infographics] );
            update_post_meta( $post_vitrine_id, 'basic_vitrine_infografico_id_0' . $number_of_infographics, $_POST['basic_vitrine_infografico_id_0' . $number_of_infographics] );
        }

        //Custom Fields Videos
        update_post_meta( $post_vitrine_id, 'video_01', $_POST['video_01'] );
        update_post_meta( $post_vitrine_id, 'video_02', $_POST['video_02'] );
        update_post_meta( $post_vitrine_id, 'video_03', $_POST['video_03'] );
        update_post_meta( $post_vitrine_id, 'more_videos', $_POST['more_videos'] );
        update_post_meta( $post_vitrine_id, 'more_videos_target', $_POST['more_videos_target'] );
        update_post_meta( $post_vitrine_id, 'videos_bg', $_POST['videos_bg'] );
        update_post_meta( $post_vitrine_id, 'videos_color', $_POST['videos_color'] );
        update_post_meta( $post_vitrine_id, 'videos_id', $_POST['videos_id'] );

        //Custom fields relacionados ao modal Textos
        update_post_meta( $post_vitrine_id, 'highlights_collumns', $_POST['highlights_collumns'] );
        update_post_meta( $post_vitrine_id, 'texts_collumns', $_POST['texts_collumns'] );
        for ($number_of_texts=1; $number_of_texts<=20; $number_of_texts++) {
            update_post_meta( $post_vitrine_id, 'texts_content_0' . $number_of_texts . '_title', $_POST['texts_content_0' . $number_of_texts . '_title'] );
            update_post_meta( $post_vitrine_id, 'texts_vitrine_content_0' . $number_of_texts, $_POST['texts_vitrine_content_0' . $number_of_texts] );
            update_post_meta( $post_vitrine_id, 'texts_vitrine_content_id_0' . $number_of_texts, $_POST['texts_vitrine_content_id_0' . $number_of_texts] );
            update_post_meta( $post_vitrine_id, 'texts_vitrine_content_bg_0' . $number_of_texts, $_POST['texts_vitrine_content_bg_0' . $number_of_texts] );
            update_post_meta( $post_vitrine_id, 'texts_vitrine_content_color_0' . $number_of_texts, $_POST['texts_vitrine_content_color_0' . $number_of_texts] );
        }

        //responsibility
        update_post_meta( $post_vitrine_id, 'responsibility', $_POST['responsibility'] );
        update_post_meta( $post_vitrine_id, 'responsibility_color', $_POST['responsibility_color'] );
        update_post_meta( $post_vitrine_id, 'responsibility_bg', $_POST['responsibility_bg'] );

        //custom css
        update_post_meta( $post_vitrine_id, 'my_css', $_POST['my_css'] );

        //Custom Fields Caixa de Configurações da Vitrine
        update_post_meta( $post_vitrine_id, 'titleFont_color', $_POST['titleFont_color'] );
        update_post_meta( $post_vitrine_id, 'titleBg_color', $_POST['titleBg_color'] );
        update_post_meta( $post_vitrine_id, 'boxBorder_color', $_POST['boxBorder_color'] );
        update_post_meta( $post_vitrine_id, 'boxLines_color', $_POST['boxLines_color'] );
        update_post_meta( $post_vitrine_id, 'data', $_POST['data'] );
        update_post_meta( $post_vitrine_id, 'presentation_font_size', $_POST['presentation_font_size'] );
        update_post_meta( $post_vitrine_id, 'font_size', $_POST['font_size'] );
        update_post_meta( $post_vitrine_id, 'showWPEditor', $_POST['showWPEditor'] );

        //Custom Fields da Versão Basica imagens e textos até 20 de cada.
        for ($number_of_fields=1; $number_of_fields<=20; $number_of_fields++) {
            update_post_meta( $post_vitrine_id, 'basic_content_0' . $number_of_fields . '_title', $_POST['basic_content_0' . $number_of_fields . '_title'] );
            update_post_meta( $post_vitrine_id, 'image_url_0' . $number_of_fields, $_POST['image_url_0' . $number_of_fields] );
            update_post_meta( $post_vitrine_id, 'basic_vitrine_content_0' . $number_of_fields, $_POST['basic_vitrine_content_0' . $number_of_fields] );
            update_post_meta( $post_vitrine_id, 'basic_vitrine_content_bg_0' . $number_of_fields, $_POST['basic_vitrine_content_bg_0' . $number_of_fields] );
            update_post_meta( $post_vitrine_id, 'basic_vitrine_content_color_0' . $number_of_fields, $_POST['basic_vitrine_content_color_0' . $number_of_fields] );
            update_post_meta( $post_vitrine_id, 'basic_vitrine_content_id_0' . $number_of_fields, $_POST['basic_vitrine_content_id_0' . $number_of_fields] );
        }

        for ($metaboxUpdate=1; $metaboxUpdate<=8; $metaboxUpdate++) {
            update_post_meta( $post_vitrine_id, 'onOff_vitrine_0' . $metaboxUpdate, $_POST['onOff_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'title_vitrine_0' . $metaboxUpdate, $_POST['title_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'titleLink_vitrine_0' . $metaboxUpdate, $_POST['titleLink_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'titleColor_vitrine_0' . $metaboxUpdate, $_POST['titleColor_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'text_vitrine_0' . $metaboxUpdate, $_POST['text_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'linkText_vitrine_0' . $metaboxUpdate, $_POST['linkText_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'linkColor_vitrine_0' . $metaboxUpdate, $_POST['linkColor_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'linkUrl_vitrine_0' . $metaboxUpdate, $_POST['linkUrl_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'linkTitleTarget_vitrine_0' . $metaboxUpdate, $_POST['linkTitleTarget_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'linkTarget_vitrine_0' . $metaboxUpdate, $_POST['linkTarget_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'imageType_vitrine_0' . $metaboxUpdate, $_POST['imageType_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'icon_vitrine_0' . $metaboxUpdate, $_POST['icon_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'iconColor_vitrine_0' . $metaboxUpdate, $_POST['iconColor_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'imageURL_vitrine_0' . $metaboxUpdate, $_POST['imageURL_0' . $metaboxUpdate . '_vitrine'] );
            update_post_meta( $post_vitrine_id, 'notes_vitrine_0' . $metaboxUpdate, $_POST['notes_0' . $metaboxUpdate . '_vitrine'] );
        }
    } // fecha if $post_vitrine
} // fecha function add_post_vitrine_fields
add_action( 'save_post', 'add_post_vitrine_fields', 10, 2 );

function include_template_function( $template_path ) {
    if ( get_post_type() == 'post_vitrines' ) {
        if ( is_single() ) {
            $template_path = plugin_dir_path( __FILE__ ) . '/templates/single_vitrines.php';
        }
        if ( is_archive() ) {
            $template_path = plugin_dir_path( __FILE__ ) . '/templates/archive_vitrines.php';
        }
    }
    return $template_path;
}
add_filter( 'template_include', 'include_template_function', 1 );

if (function_exists('add_theme_support')) {
    add_theme_support('post-thumbnails');
    add_image_size('vitrine_image', 320, 320, true);
    add_image_size('vitrine_highlight', 225, 140, true);
}

function wp_vitrines_custom_css() {
    global $post;
    $my_css = stripslashes(get_post_meta( $post->ID, "my_css", true ));

    if ( $my_css ) {
?>

<style type="text/css">
    <?php echo $my_css; ?>
</style>

<?php
    }
}
add_action( 'wp_head', 'wp_vitrines_custom_css' );

function admin_menu() {
    add_submenu_page( 'options-general.php', __('WP-Vitrines Settings', 'wp-vitrines-master'), __('WP-Vitrines', 'wp-vitrines-master'), 'manage_options', 'wp-vitrines', 'wp_vitrines_page_admin');
    // call register settings function
    add_action( 'admin_init', 'register_settings' );
}
add_action( 'admin_menu', 'admin_menu' );

function register_settings() {
    register_setting('wp-vitrines-settings-group', 'wp_vitrines_config');
}

function settings_link($links) {
    $settings_link = '<a href="options-general.php?page=wp-vitrines.php">Settings</a>';
    array_unshift($links, $settings_link);
    return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'settings_link' );

// Update CSS within in Admin
function admin_enqueue() {
    global $pagenow;
    $post_type = get_post_type();

    if ( 'post_vitrines' == $post_type && 'post.php' == $pagenow ) {
        wp_enqueue_style('jquery-ui', '//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css');
        wp_enqueue_style('font-awesome', WP_VITRINES_PLUGIN_URL.'fontawesome/css/all.min.css');
        wp_enqueue_style('simple-iconpicker', WP_VITRINES_PLUGIN_URL.'simple-iconpicker/simple-iconpicker.min.css');
        wp_enqueue_style('admin-styles', WP_VITRINES_PLUGIN_URL.'templates/css/admin.css');

        // wp_enqueue_script('font-awesome', WP_VITRINES_PLUGIN_URL.'fontawesome/js/all.min.js', array(), null, true);
        wp_enqueue_script('simple-iconpicker', WP_VITRINES_PLUGIN_URL.'simple-iconpicker/simple-iconpicker.min.js', array(), null, true);
        wp_enqueue_script('admin-scripts', WP_VITRINES_PLUGIN_URL.'templates/js/admin.js', array(), null, true);
    }
}
add_action('admin_enqueue_scripts', 'admin_enqueue');

function remove_custom_meta_form() {
    remove_meta_box( 'postcustom', 'post_vitrines', 'normal' );
}
add_action( 'admin_menu' , 'remove_custom_meta_form' );
?>
