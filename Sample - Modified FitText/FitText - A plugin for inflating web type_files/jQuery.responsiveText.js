(function( $ ) {
	
	var tolerance = 0.1;
	// Helper functions
	
	var GetCharactersFromMediaQuery = function (tagNameUpper)
	{
		var found = false;
		var tagNameLower = tagNameUpper.toLowerCase();
		var chars = 0;
		$.each($.fn.responsiveText.defaults, function (mQuery, data){
			if (found == false)
			{
				if ($(window).width() < mQuery)
				{
					if (data[tagNameUpper])
					{
						chars = data[tagNameUpper];
						found = true;
					} else if (data[tagNameLower])
					{
						chars = data[tagNameLower];
						found = true;
					}
				}
			}
		});
		
		return chars;
	}
	
	var GetCharactersForTagName = function (tagNameUpper)
	{
		var chars = GetCharactersFromMediaQuery(tagNameUpper);
		if (chars == 0)
		{
			chars = $.fn.responsiveText.defaults.characters;
			var tagNameLower = tagNameUpper.toLowerCase();
			if ($.fn.responsiveText.defaults[tagNameUpper])
			{
				chars = $.fn.responsiveText.defaults[tagNameUpper];
			} else if ($.fn.responsiveText.defaults[tagNameLower])
			{
				chars = $.fn.responsiveText.defaults[tagNameLower];
			}
		}
		return chars;
	}
	
	var GetNumberOfCharacters = function($ele, data)
	{
		var tagName = $ele.get(0).tagName;
		var chars = GetCharactersForTagName(tagName);
		console.log( tagName + ' ' + chars + ' ' + chars * data.mQueries.multiplier);
		return ( chars * data.mQueries.multiplier);
	}
	
	var GetApprpriateString = function (characters)
	{
		var theString = '';
		for (var i = 0; i< characters; ++i)
			theString += 'p';
		return theString;
	}
	// Do the awesome responsive text management here
	
	var methods = 
	{	
		init: function (options)
		{
			return this.each(function () {

				// See if the data exists
				var $this = $(this),
					data = $this.data('mQueries');

				var resizeText = function () {
					var data = $this.data('mQueries');
					if (data)
					{
						// Get the number of characters in a line
						var numChars = GetNumberOfCharacters($this, data);
						// Get an appropriately sized string
						var theString = GetApprpriateString(numChars);
						
						//Create a temporary div with same properies
						var theP = document.createElement('p');
						var $theP = $(theP);
						document.body.appendChild(theP);
						$theP.css({
							position: 'absolute',
							left: -1000,
							top: -1000,
							display: 'none'
							});

						var styles = ['font-size','font-style', 'font-weight', 'font-family','line-height', 'text-transform', 'letter-spacing'];
						$(styles).each(function() {
							var s = this.toString();
							$theP.css(s, $this.css(s));
						});
						
						$theP.html(theString);
						var w = $theP.width();
						var availableWidth = $this.width();
						var lookingForFontSize = true;
						var responsiveFontSize = parseFloat( $this.css('font-size'));
                        console.log($this.toArray() + ' ' + w +' '+ responsiveFontSize + ' '+ availableWidth);
						// should either keep increasing or decreasing;
						var shouldIncrease = (w < availableWidth);
						while (lookingForFontSize)
						{	
							if (w < availableWidth)
							{
								if (!shouldIncrease)
									break;
									
								if ( ((availableWidth - w ) / availableWidth) < (tolerance))
								{
									lookingForFontSize = false;
								}
								else
								{
									responsiveFontSize += 0.5;
									$theP.css('font-size', responsiveFontSize + 'px');
									w = $theP.width();
									console.log('w < AW' + $this.toArray() + ' ' + w +' '+ responsiveFontSize + ' '+ availableWidth);
								}
							}
							else // w >= availableWidth
							{
								if (shouldIncrease)
									break;
									
								if ( ((w - availableWidth) / w) < (tolerance))
								{
									lookingForFontSize = false;
								}
								else
								{
									responsiveFontSize -= 0.5;
									$theP.css('font-size', responsiveFontSize + 'px');
									w = $theP.width();
									console.log('w > AW' + $this.toArray() + ' ' + w +' '+ responsiveFontSize + ' '+ availableWidth);
								}
							}
						}

						if (responsiveFontSize < data.mQueries.minFontSize)
							responsiveFontSize = data.mQueries.minFontSize;
						else if (responsiveFontSize > data.mQueries.maxFontSize)
							responsiveFontSize = data.mQueries.maxFontSize;

						$this.css('font-size', responsiveFontSize + 'px');
						// remove the temporary P
						$theP.remove();					
					}
				}

				// if no data exists store the mQueries
				if (!data)
				{
					var opts = $.extend({}, eleDefaults, options);
					console.log(opts);
					$this.data('mQueries', {
						target: $this,
						mQueries: opts
					});
				}
							
				// Bind to the resize event
				$(window).bind('resize.responsiveText', resizeText);
				// Initialize it once
				resizeText();
			});
		},
		
		destroy: function()
		{
			// Iterate over each element for which this plugin is invoked
			return this.each( function(){
											
				var $this = $(this),
					data = $this.data('mQueries');
					
				// Namespacing FTW
				$(window).unbind('.responsiveText'); // Remove the event handler
				if (data)
				{
					$this.removeData('mQueries');
				}
			});
		},
		
		setGlobalDefaults: function(options)
		{
			$.extend($.fn.responsiveText.defaults, options);
		}
	}

	$.fn.responsiveText = function(method) {
		// Method Calling Logic
		if (methods[method]){
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( ( ! method )  || (typeof (method) === 'object') ){
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.responsiveText' );
		} 
	};
	
	// Global Defaults
	$.fn.responsiveText.defaults = {
		minFontSize : Number.NEGATIVE_INFINITY,
		maxFontSize : Number.POSITIVE_INFINITY,
		characters: '140'
	};
	
	var eleDefaults = {
		minFontSize : Number.NEGATIVE_INFINITY,
		maxFontSize : Number.POSITIVE_INFINITY,
		multiplier: '1'
	}
	
})( jQuery );
