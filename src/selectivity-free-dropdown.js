'use strict';

var Selectivity = require('./selectivity-base');
var SelectivityDropdown = require('./selectivity-dropdown');

/**
 * Extended dropdown that supports creating new items.
 */
function SelectivityFreeDropdown(options) {

    SelectivityDropdown.call(this, options);
}


var callSuper = Selectivity.inherits(SelectivityFreeDropdown, SelectivityDropdown, {

	showResults: function(results, options) {

	    var resultsHtml = this.renderItems(results);
	    if (options.hasMore) {
	        resultsHtml += this.selectivity.template('loadMore');
	    } else {
	        if (!resultsHtml && !options.add) {
	            resultsHtml = this.selectivity.template('noResults', { term: options.term });
	        }
	        else if( options.noResults ){
	        	resultsHtml += this.selectivity.template('noResults', { term: options.term });
	        }
	    }

	    if (options.add) {
	        this.$('.selectivity-loading').replaceWith(resultsHtml);

	        this.results = this.results.concat(results);
	    } else {
	        this.$results.html(resultsHtml);

	        this.results = results;
	    }

	    this.hasMore = options.hasMore;

	    if (!options.add || this.loadMoreHighlighted) {
	        this._highlightFirstItem(results);
	    }

	    this.position();
	},


	selectNewItem: function () {
		
		//! get Text as-is
		var text = this.selectivity.$searchInput.val();
		var options = { id: text, item: text };
		
		console.log( 'selectNewItem', options );
		
		if (this.selectivity.triggerEvent('selectivity-selecting', options)) {
		    this.selectivity.triggerEvent('selectivity-selected', options);
		}
	},

	/**
	 * @inherit
	 */
	selectHighlight: function() {
		
		callSuper(this, 'selectHighlight');
		return;
		
	    /*
		    text is empty ""
		      default action: select highlighted
		    text is partial:  text != tag
		      new item { text }
		    text is tag:  text == tag
		      default action: select highlighted
		    text is none: tag not found
		      new item {text}
	    */
	    
	    //! getTerm?
	    
	    var term = this.selectivity.term;
	    
	    if( term.trim().length < 1 ){
	    	callSuper(this, 'selectHighlight');
	    	return;
	    }
	    if (this.highlightedResult) {
	    	
	    	if( Selectivity.transformText(this.highlightedResult.text) == term ){
	    		callSuper(this, 'selectHighlight');
	    		return;
	    	}
	    }
	    
	    this.selectNewItem();
	    
	    //! what this does?
	    
	    // else if (this.loadMoreHighlighted) {
	    //     this._loadMoreClicked();
	    // }
	}
	
});

module.exports = Selectivity.FreeDropdown = SelectivityFreeDropdown;
