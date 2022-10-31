$(document).ready(function () {

    Handlebars.registerHelper('select', function(value, options) {
        console.log("testvalue: ", value);
        var $el = $('<select />').html(options.fn(this));
        $el.find('[value="' + value + '"]').attr({'selected': 'selected'});
        return $el.html();
    });
});