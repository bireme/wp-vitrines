jQuery(document).ready(function($) {
    $('.input1').iconpicker(".input1");
    $('.input2').iconpicker(".input2");
    $('.input3').iconpicker(".input3");
    $('.input4').iconpicker(".input4");
    $('.input5').iconpicker(".input5");
    $('.input6').iconpicker(".input6");
    $('.input7').iconpicker(".input7");
    $('.input8').iconpicker(".input8");
});

jQuery(document).ready(function($) {
    $(".componente_title").on("click",function(){
    	$(this).next().slideToggle();
    });
});

jQuery(document).ready(function($) {
    $('#sortableContainer').sortable();
    $('#sortableContainer').on( "sortbeforestop", function( event, ui ) {
        var itemOrder = $('#sortableContainer').sortable("toArray");
        var item = 1;
        for (var i = 0; i <= 7; i++) {
            $("#position"+item).val(itemOrder[i]);
            item++;
        }
    });
});

/*
jQuery(document).ready(function($) {
	$("#showWPEditor").on("change",function(){
    	if ($(this).is(':checked')) {
    		$("#postdivrich").show();
    		$("#basic_vitrine_meta_box").hide();
    	} else {
    		$("#postdivrich").hide();
    		$("#basic_vitrine_meta_box").show();
    	}
    });
});
*/

function mudarEstado(el) {
    var display = document.getElementById(el).style.display;
    if(display == "none")
        document.getElementById(el).style.display = 'block';
    else
        document.getElementById(el).style.display = 'none';
}