(function( $, window, document, undefined ){
    $.fn.slidespinbox = function(options) {
        var settings = $.extend( {
        min: 0,
        max: 100,
        step: 1,
        values: 0,
        change: $.noop
    }, options);
    return this.each(function() {
        var input = $(this);
        var label = input.data('label');
        //console.log(input);
        input.val(settings.values);
        var prevelmnt = $(this).prev();
        var prevtable = prevelmnt.hasClass('sstable');
        var prevtr = prevelmnt[0].nodeName.toLowerCase();
        var prevhtml = prevelmnt.html();
        if (prevtable==true || prevtr=='tr') {
            if (prevtable==true) {
                input.wrap('<tr>');
                var inputparent = input.parent();
                prevelmnt.append(inputparent);
            }
            if (prevtr=='tr' && prevhtml == '') {
                prevelmnt.remove();
                input.wrap('<tr>');
                var inputparent = input.parent();
                prevelmnt.append(inputparent);
            }
        }
        else {
            input.wrap('<table class="sstable"><tr>');
        }
        
        input.before('<span class="label">'+label+'</span><div class="slider"></div>')
            .attr('size', '7');
        var previous = input.prev();
        var prevprev = input.prev().prev();
        prevprev.wrap('<td valign="middle" class="label">').click(function() {
            input.focus().select();
        });
        previous.wrap('<td valign="middle">')
        .slider({
            min: settings.min,
            max: settings.max,
            step: settings.step,
            value: settings.values,
            slide: function(event, ui) {
                input.val(ui.value).focus().select();
            },
            stop: function(event, ui) {
                input.val(ui.value).focus().select();
                if($.isFunction(settings.change)) {
                    //settings.change.call();
                    input.trigger('change');
                }
            }
        });
        input.spinbox({
            min: settings.min,
            max: settings.max,
            step: settings.step
        }).change(function() {
            previous.slider('value', input.val());
            if($.isFunction(settings.change)) {
                settings.change.call();
            }
        }).keyup(function() {
            $(this).trigger('change');
        });
        input.wrap('<td>');
    });
    };
})( jQuery );

(function( $, window, document, undefined ){
    $.fn.realdialog = function(options) {
        var settings = $.extend( {
        confirm: $.noop,
        change: $.noop,
        monitor: [],
        width: '350',
        open: $.noop,
    }, options);
    return this.each(function() {
        var $this = $(this);
        //console.log(options);
        if (options.dmodal == 'f') {
            //console.log('true');
            $this.dialog({
                buttons: {
                    "Close": function() {
                        if($.isFunction(settings.confirm)) {
                            settings.confirm.call();
                        }
                    }
                },
                minWidth: settings.width,
                open: function(event, ui) { 
                    $(this).parent().children().children(".ui-dialog-titlebar-close").hide(); 
                }
            });
        }
        else {
            //console.log('ok');
            $this.dialog({
                buttons: {
                    Cancel: function() {
                        tempcanvas.width = tempcanvas.width;
                        $(this).dialog('close');
                    },
                    "OK": function() {
                        if($.isFunction(settings.confirm)) {
                            settings.confirm.call();
                        }
                    }
                },
                modal: true,
                minWidth: settings.width,
                open: function(event, ui) { 
                    settings.open.call();
                    $(this).parent().children().children(".ui-dialog-titlebar-close").hide(); 
                }
            });
        }

        settings.change.call();
        for (var i = 0; i < settings.monitor.length; i++) {
            $(settings.monitor[i]).change(function() {
                if($.isFunction(settings.change)) {
                    settings.change.call();
                }
            });
        }
    });
    };
})( jQuery );

(function( $, window, document, undefined ){
    $.fn.kbds = function(options) {
        var settings = $.extend( {
        min: 0
    }, options);
    return this.each(function() {
        var input = $(this);
        var label = input.data('kbd');
        //console.log(input);
        input.wrapInner('<table width="200" cellpadding="0" cellspacing="0"><tr><td>');
        var td = input.find('td');
        td.after('<td align="right">'+label+'</td>');
    });
    };
})( jQuery );

(function( $, window, document, undefined ){
    $.fn.initiate = function(options) {
        var settings = $.extend( {
        change: $.noop,
        confirm: $.noop,
        kbd: null,
        width: '300',
        monitor: [],
    }, options);
    return this.each(function() {
        var $this = $(this);
        $this.realdialog({
            width: settings.width,
            confirm: function() {
                if($.isFunction(settings.confirm)) {
                    settings.confirm.call();
                }
            },
            monitor: settings.monitor
        });
        
    });
    };
})( jQuery );