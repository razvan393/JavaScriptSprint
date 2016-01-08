$.fn.numePlugin = function(options) {
    var defaults = {
        optiune1: 'valoare optiune #1'
    };

    var methods = {
        numeMetoda: function () {
            //aici this e chiar el
        }
    };

    return this.each(function () {
        if (!options || typeof options == 'object') {
            options = $.extend(defaults, options);

            //aici construiesc obiectele
            //si ascult evenimente
        } else {
            if (methods.hasOwnProperty(options)) {
                methods[options].call(this);
            }
        }
    });
};