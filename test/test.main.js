var console = jstestdriver.console;

AsyncTestCase('PolyfillTest', {

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

    'test: xhr and xdr' : function(queue) {
        var responseText1 = '';
        var responseText2 = '';
        var responseText3 = '';

        var xhr = new XMLHttpRequest();

        queue.call('Step1: xhr test.', function(callbacks){

            var onComplete = callbacks.add(function(xhr){
                responseText1 = xhr.responseText;
                console.log('===== onComplete1: ' + responseText1);                
            });
            
            xhr.open( 'GET', '/test/test/xhrTest1.js', true );
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ){ onComplete(xhr); }
            };
            xhr.send( null );
        });

        queue.call('Step2: xdr test.', function(callbacks){

            var onComplete = callbacks.add(function(xhr){
                responseText2 = xhr.responseText.substr(4, 14);
                console.log('===== onComplete2: ' + responseText2);                
            });
            
            xhr.open( 'GET', 'http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js', true );
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ){ onComplete(xhr); }
            };
            xhr.send( null );
        });

        queue.call('Step3: xhr test again.', function(callbacks){

            var onComplete = callbacks.add(function(xhr){
                responseText3 = xhr.responseText;
                console.log('===== onComplete3: ' + responseText3);                
            });

            xhr.open( 'GET', '/test/test/xhrTest2.js', true );
            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ){ onComplete(xhr); }
            };
            xhr.send( null );
        });

        queue.call('Step4', function(){
            assertEquals( '"Hello world.";', responseText1);
            assertEquals( 'jQuery v1.11.1', responseText2);
            assertEquals( '"Change the world.";', responseText3);
        });
    },
    
});