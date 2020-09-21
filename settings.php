<?php
function wp_vitrines_page_admin() {
    $config = get_option('wp_vitrines_config');
?>
    <div class="wrap">
        <div id="icon-options-general" class="icon32"></div>
        <h2><?php _e('WP-Vitrines Settings', 'wp-vitrines-master'); ?></h2>

        <form method="post" action="options.php">

            <?php settings_fields('wp-vitrines-settings-group'); ?>

            <table class="form-table">
                <tbody>
                    <tr valign="top">
                        <th scope="row"><?php _e('Home URL', 'wp-vitrines-master'); ?>:</th>
                        <td><input type="text" name="wp_vitrines_config[home_url]" value="<?php echo $config['home_url']; ?>" class="regular-text code"></td>
                    </tr>
                </tbody>
            </table>
            <p class="submit">
                <input type="submit" class="button-primary" value="<?php _e('Save changes'); ?>" />
            </p>
        </form>
    </div>
<?php
}
?>
