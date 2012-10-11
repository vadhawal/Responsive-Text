Responsive-Text
===============

A mechanism to make text responsive by attempting to maintain a predefined number of characters in a line and defining the font size of the text in various elements in proportion with  each other.

Usage
=====

Define the number of characters in  a media query like fashion for each tag:

$.extend($.fn.responsiveText.defaults, {
					'480': {'h1': 20, 'p': 40, 'div': 150}, 
					'760': {'h1': 30, 'p': 30, 'div': 100},
					'1024': {'h1': 40, 'p': 35, 'div': 200},
					h1': 10, 'p': 40, 'div': 300
					});

As per above a 'h1' should have 20 chars for width < 480px, 30 chars for width < 760 and so on. The last line signifies the default values.

$.fn.responsiveText.defaults.characters defines the default characters for any element. Min and Max font size can also be set.

Initialise Responsive Text on any element:

$('p#RespText').responsiveText({multiplier: 2.4}); Specify the number of characters this element should have as multiple of values set above.

Sample code has been applied on the page from www.fittextjs.com

Code is inspired by the fittext plugin for to create responsive headings.