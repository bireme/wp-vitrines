<?php if ( $onOff == 'on') {
    include ("part_icon_x_image.php");
    ?>
    <span class="component_content">
        <span class="component_title">
            <?php
                $linkTarget = ( get_post_meta( get_the_ID(), 'linkTitleTarget_vitrine_0'. $comp, true ) );
                if ( $linkTarget == 'on' ) { $target = "_blank"; } else {  $target = "_self"; }
            ?>
            <a 
                target="<?php echo $target; ?>"
                href="<?php echo ( get_post_meta( get_the_ID(), 'titleLink_vitrine_0'. $comp, true ) ); ?>" 
                alt="<?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>"
                style="color: <?php echo ( get_post_meta( get_the_ID(), 'titleColor_vitrine_0'. $comp, true ) ); ?> !important;">
                <?php echo ( get_post_meta( get_the_ID(), 'title_vitrine_0'. $comp, true ) ); ?>
            </a>
        </span>
        <span class="component_text">
            <?php echo ( get_post_meta( get_the_ID(), 'text_vitrine_0'. $comp, true ) ); ?>
        </span>
    </span>    
    <?php
    }
?>