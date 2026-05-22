<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Classe-base para todo elemento de vitrine.
 * Cada elemento concreto estende esta classe.
 */
abstract class Vitrine_Element {

    /** Slug único do elemento. */
    abstract public function slug();

    /** Nome exibido na barra lateral. */
    abstract public function label();

    /** Classe de ícone Dashicon. */
    abstract public function icon();

    /** Valores padrão das configurações. */
    abstract public function defaults();

    /**
     * Campos de configuração exibidos na sidebar direita.
     * Retorna array de arrays com keys: name, label, type.
     * Tipos suportados: text, textarea, number, color, image.
     */
    abstract public function fields();

    /**
     * Renderiza o HTML final do elemento no frontend.
     *
     * @param array  $settings       Configurações salvas.
     * @param string $children_html  HTML dos elementos filhos (para containers).
     * @return string HTML.
     */
    abstract public function render( $settings, $children_html = '' );
}

/**
 * Registro global de elementos.
 */
class Vitrine_Element_Registry {

    private static $elements = array();

    /**
     * Registra um elemento.
     */
    public static function register( Vitrine_Element $element ) {
        self::$elements[ $element->slug() ] = $element;
    }

    /**
     * Retorna todos os elementos registrados.
     */
    public static function get_all() {
        return self::$elements;
    }

    /**
     * Retorna um elemento pelo slug ou null.
     */
    public static function get( $slug ) {
        return isset( self::$elements[ $slug ] ) ? self::$elements[ $slug ] : null;
    }
}
