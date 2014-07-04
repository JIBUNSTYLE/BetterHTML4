;var BetterHTML4 = BetterHTML4 || {};

BetterHTML4.polyfill = (function(window, document){

	var Polyfill = {
		init : function() {
			/* fix Style.sheet, cssRules, insertRule(), deleteRule() */
			if ( typeof HTMLStyleElement.prototype.sheet == 'undefined' ) {
				if ( Object.defineProperty ) {
					Object.defineProperty(HTMLStyleElement.prototype, 'sheet', {
						get: function() {
							return this.styleSheet;
						},
						set: function(v) {
							this.styleSheet = v;
						}
					});

					Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
						get: function() {
							return this.rules;
						},
						set: function(v) {
							this.rules = v;
						}
					});	
				}
				if ( typeof CSSStyleSheet.prototype.insertRule == 'undefined' ) {
					CSSStyleSheet.prototype.insertRule = function(style, idx){
						var selector = style.replace(new RegExp('\{.+?\}','g'), '');
						var rule = style.replace(selector, '');
						CSSStyleSheet.prototype.addRule.apply(this, [selector, rule, idx]);
					};
				}
				if ( typeof CSSStyleSheet.prototype.deleteRule == 'undefined' ) {
					CSSStyleSheet.prototype.deleteRule = function(idx){
						CSSStyleSheet.prototype.removeRule.apply(this, [idx]);
					};
				}
			}
		}
	};

	Polyfill.init();

	return Polyfill;

})(this, document);