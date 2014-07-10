;var BetterHTML4 = BetterHTML4 || {};

BetterHTML4.polyfill = (function(window, document){

	var Polyfill = {
		init : function() {
			/* fix Style.sheet, cssRules, insertRule(), deleteRule() */
			/* @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Style-20001113/css.html#CSS-CSSStyleSheet-insertRule
			 * @see http://msdn.microsoft.com/en-us/library/ie/aa358796(v=vs.85).aspx
			 * @see http://msdn.microsoft.com/en-us/library/ie/ms531195(v=vs.85).aspx
			 */
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
						return CSSStyleSheet.prototype.addRule.apply(this, [selector, rule, idx]);
					};
				}
				if ( typeof CSSStyleSheet.prototype.deleteRule == 'undefined' ) {
					CSSStyleSheet.prototype.deleteRule = function(idx){
						CSSStyleSheet.prototype.removeRule.apply(this, [idx]);
					};
				}
			}

			/* fix Cross domain  XMLHTTPRequest */
			/* @see http://msdn.microsoft.com/en-us/library/ms760403(v=vs.85).aspx
			 * @see http://msdn.microsoft.com/ja-jp/library/ie/cc288060(v=vs.85).aspx
			 */
			if ( window.XDomainRequest ) {
				window.XMLHttpRequest = function() {
		            var ax = new ActiveXObject('Msxml2.XMLHTTP.6.0');

		            var hook = {
		                _ax: ax,
		                _xdr: null,
		                readyState: 0,
		                responseBody: null,
		                responseStream: null,
		                responseText: '',
		                responseXml: null,
		                status: 0,
		                statusText: '',
		                onreadystatechange: null
		            };

		            hook._onReadyStateChange = function() {
		                var self = hook;
		                return function() {
		                	self.readyState = self._ax.readyState;
		                	if ( self.readyState > 3 ) {
			                    self.responseBody = self._ax.responseBody;
			                    self.responseStream  = self._ax.responseStream;
			                    self.responseText = self._ax.responseText;
			                    self.responseXml = self._ax.responseXml;
			                    self.status = self._ax.status;
			                    self.statusText = self._ax.statusText;
		                	}
		                    if ( self.onreadystatechange ) self.onreadystatechange();
		                }
		            }();

		            hook.abort = function(){ return (this._xdr | this._ax).abort(); };
		            hook.getAllResponseHeaders = function(){ return this._ax.getAllResponseHeaders(); };

		            hook.getOption = function(option){ return this._ax.getOption(option); };
		            hook.getResponseHeader = function(bstrHeader){ return this._ax.getResponseHeader(bstrHeader); };

		            hook.open = function(bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword) {
		                varAsync = (varAsync !== false);
		                this._ax.onReadyStateChange = this._onReadyStateChange
		                try {
		                    return this._ax.open(bstrMethod, bstrUrl, varAsync, bstrUser, bstrPassword);
		                } catch (e) {
		                    var self = hook;
		                    /* Fix the Cross-Domain issue. */
		                    this._xdr = new XDomainRequest();
		                    this.readyState = 0; // UNSENT
		                    this.status = 0;
		                    this.statusText = '';

		                    this._xdr.onprogress = function(){
		                        self.readyState = 2; // HEADERS_RECEIVED
		                        if (self.onreadystatechange) self.onreadystatechange();
		                    };

		                    this._xdr.onload = function(){
		                        self.readyState = 3;    // LOADING  
		                        if (self.onreadystatechange) self.onreadystatechange();

		                        self.readyState = 4;    // DONE
		                        self.status = 200;
		                        self.statusText = '200 OK';
		                        self.responseText = self._xdr.responseText;
		                        if (self.onreadystatechange) self.onreadystatechange();

		                        self._xdr = null;
		                    };
		                    return this._xdr.open(bstrMethod, bstrUrl);
		                }
		            };

		            hook.send = function(varBody) { return (this._xdr || this._ax).send(varBody); };
		            
		            hook.setOption = function(option, value){ return this._ax.setOption(option, value); };
		            hook.setProxy = function(proxySetting, varProxyServer, varBypassList){ return this._ax.setProxy(oproxySetting, varProxyServer, varBypassList); };
		            
		            hook.setProxyCredentials = function(bstrUserName, bstrPassword){ return this._ax.setProxyCredentials(bstrUserName, bstrPassword); };
		            hook.setRequestHeader = function(bstrHeader, bstrValue){ return this._ax.setRequestHeader(bstrHeader, bstrValue); };
		            
		            hook.setTimeouts = function(resolveTimeout, connectTimeout, sendTimeout, receiveTimeout){ 
		            	if ( this._xdr ) { this._xdr.timeout = connectTimeout; };
		            	return this._ax.setTimeouts(resolveTimeout, connectTimeout, sendTimeout, receiveTimeout); 
		            };
		            
		            hook.waitForResponse = function(timeoutInSeconds){ return this._ax.waitForResponse(timeoutInSeconds); };

		            return hook;
		        }
			}
		}
	};

	Polyfill.init();

	return Polyfill;

})(this, document);