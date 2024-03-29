<?php 
// Highlights2 
// Part of Form-Vitrine
// Plugin Vitrine do Conhecimento
?>
<div class="highlights highlight_2_coluns row">
    <?php 
        $highlight = 0;

        for ($count=1; $count<=20; $count++) {
            $highlight_title   = get_post_meta( get_the_ID(), "basic_content_0".$count."_title", true );
            $highlight_content = get_post_meta( get_the_ID(), 'basic_vitrine_content_0'. $count, true );
            if (!empty($highlight_title) || !empty($highlight_content)) { $highlight++; }
        }

        for ($count=1; $count<=$highlight; $count++) {
            $title = get_post_meta( get_the_ID(), "basic_content_0".$count."_title", true );
            $content = get_post_meta( get_the_ID(), 'basic_vitrine_content_0'. $count, true );
            $fontcolor = get_post_meta( get_the_ID(), 'basic_vitrine_content_color_0'. $count, true );
            $bgcolor = get_post_meta( get_the_ID(), 'basic_vitrine_content_bg_0'. $count, true );
            $id = get_post_meta( get_the_ID(), 'basic_vitrine_content_id_0'. $count, true );
            
            if ($count % 2 == 0) { 
                $checkDIV = 1;  
            } else { 
                $checkDIV = 0;  
            }
        ?>
        <?php if ($checkDIV == 0) { echo "<div class='checkDIV'>";};?>
            <div id="<?php if (empty($id)) { echo 'highlight_'.$count; } else { echo $id; }; ?>" class="highlightBox" style="<?php if (isset($bgcolor)) { echo "background-color: $bgcolor !important;"; } ?> <?php if (isset($fontcolor)) { echo "color: $fontcolor !important;"; } ?>">
                <h2><?php echo $title; ?></h2>
                <div class="contentHighlight">
                    <?php $content = do_shortcode( $content ); ?>
                    <?php echo $content; ?>
                </div>
            </div>
        <?php if ($checkDIV == 1) { echo "</div>"; } ?>
        <?php
        }
        // checa se o numero de boxes é impar e fecha a div checkDIV aberta no ultimo elemento
        if ($count % 2 == 1) { echo "</div>"; }
    ?>
</div>
</div>