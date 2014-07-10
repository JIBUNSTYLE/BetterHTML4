var console = jstestdriver.console;

TestCase('PolyfillTest', {

    setUp: function() {

    },

	'test: get the Style.sheet property' : function() {
		var style = document.createElement('style');
    	document.getElementsByTagName('head')[0].appendChild(style);
    	assertTrue('Style.sheet is *not* undefined', typeof style.sheet == 'object');
    },

    'test: get the Style.sheet.cssRules property' : function() {
		var style = document.createElement('style');
    	document.getElementsByTagName('head')[0].appendChild(style);
    	var sheet = style.sheet;
    	assertTrue('Style.sheet.cssRules is *not* undefined', typeof sheet.cssRules == 'object');
    },

    'test: use the Style.sheet.insertRule method' : function() {
		var style = document.createElement('style');
    	document.getElementsByTagName('head')[0].appendChild(style);
    	var sheet = style.sheet;

    	var idx = sheet.cssRules.length;
    	console.log('===== idx:' + idx);	
    	sheet.insertRule('.class1 { color:"green"; }', idx);
    	sheet.insertRule('.class2 { color:"yellow"; }', idx + 1);
    	sheet.insertRule('.class3 { color:"red"; }', idx + 2);

    	console.log('===== insert:');
    	for(var i=0; i<sheet.cssRules.length; i++) {
    		console.log('    (' + i + ') ' + sheet.cssRules.item(i).selectorText + ', ' + sheet.cssRules.item(i).cssText);	
    	}
    	
    	sheet.deleteRule(idx + 2);
    	sheet.deleteRule(idx + 1);
		sheet.deleteRule(idx);

		console.log('===== delete:');
		for(i=0; i<sheet.cssRules.length; i++) {
    		console.log('    (' + i + ') ' + sheet.cssRules.item(i).selectorText + ', ' + sheet.cssRules.item(i).cssText);	
    	}

    	assertTrue('Style.sheet.cssRules.length is 0.', sheet.cssRules.length == 0);
    },
    
});