'use strict';

var $ = require('jquery');

var Selectivity = require('./selectivity-base');
var MultipleSelectivity = require('./selectivity-multiple');


function createFreeItem(token) {
    
    console.log('createFreeItem', token);
    console.log('trim', token.trim());
    
    var a  = 1;
    
    token.trim() ? a = 22 : a = 33;
    
    console.log('a', a);
    
    return (token.trim() ? { id: token, text: token } : null);
}

function freeItemTokenizer(input, selection, createToken) {
    
    console.log('freeItemTokenizer:', input, '|', selection);
    
    function hasToken(input) {
        
        if (input) {
            for (var i = 0, length = input.length; i < length; i++) {
                switch (input[i]) {
                case ';':
                case ',':
                case '\n':
                    return true;
                case ' ':
                case '\t':
                    return true;
                case '"':
                    do { i++; } while(i < length && input[i] !== '"');
                    break;
                default:
                    continue;
                }
            }
        }
        return false;
    }

    function takeToken(input) {
        for (var i = 0, length = input.length; i < length; i++) {
            switch (input[i]) {
            case ';':
            case ',':
            case '\n':
                return { term: input.slice(0, i), input: input.slice(i + 1) };
            case ' ':
            case '\t':
                return { term: input.slice(0, i), input: input.slice(i + 1) };
            case '"':
                do { i++; } while(i < length && input[i] !== '"');
                break;
            default:
                continue;
            }
        }
        return {};
    }

    while (hasToken(input)) {
        var token = takeToken(input);
        if (token.term) {
            var item = createFreeItem(token.term);
            if (item && !(item.id && Selectivity.findById(selection, item.id))) {
                createToken(item);
            }
        }
        input = token.input;
    }

    return input;
}

/**
 * FreeMultiple Constructor.
 *
 * @param options Options object. Accepts all options from the MultipleSelectivity Constructor.
 */
function FreeMultiple(options) {

    options.placeholder = options.placeholder || $(options.element).data('placeholder') || '';
    
    MultipleSelectivity.call(this, options);
}

/**
 * Methods.
 */
var callSuper = Selectivity.inherits(FreeMultiple, MultipleSelectivity, {

    /**
     * @inherit
     */
    initSearchInput: function($input) {

        callSuper(this, 'initSearchInput', $input);

        $input.on('blur', function() {
            var term = $input.val();
            // this.add(createFreeItem(term));
            console.log( this._data );
        }.bind(this));
    },

    /**
     * @inherit
     *
     * Note that for the Email input type the option showDropdown is set to false and the tokenizer
     * option is set to a tokenizer specialized for freeItem addresses.
     */
    setOptions: function(options) {

        options = $.extend({
            createTokenItem: createFreeItem,
            tokenizer: freeItemTokenizer
        }, options);

        callSuper(this, 'setOptions', options);
    }

});

module.exports = Selectivity.InputTypes.FreeMultiple = FreeMultiple;
