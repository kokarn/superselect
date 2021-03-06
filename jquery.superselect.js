/*
* superselect
* is a jquery plugin for making <select> elements stylable by CSS
* http://github.com/kokarn/superselect
*
* Released under the MIT license and the Beerware license
*/
;(function ( $ ) {
	$.fn.superselect = function ( config ) {
		var defaults = {
			individualStyling: true,
			size: 5,
			reuseWidth: true
		};

		config = $.extend(defaults, config);

		function getText ( jselect ) {
			var text = '',
				selectedIndex = 0;

			if ( jselect[0].selectedIndex ) {
				selectedIndex = jselect[0].selectedIndex;
			}

			text = jselect.find( 'option:nth(' + selectedIndex + ')' ).text();

			return text;
		}

		function setText ( jselect, curr, wrap ) {
			var text = getText( jselect );

			if ( text === '' ) {
				text = jselect.children( 'option:selected' ).text();
			}

			curr.empty();

			text = '<span class="superselect-current-label">' + text + '</span>';
			text = text + '<div class="superselect-right-image"></div>';

			// Fix for html() duplicating content in IE8 under jQuery 1.10.x
			wrap.html( '<div class="superselect-current">' + text + '</div>' );
		}

		function setValue ( jselect, curr, wrap, focusWrap ) {
			jselect.blur();

			setText( jselect, curr, wrap );

			if ( focusWrap ) {
				wrap.focus();
			}
		}

		function toggleOpen ( wrap ) {
			wrap.toggleClass( 'superselect-open superselect-close' );
		}

		function isMobile () {
			return 'ontouchstart' in document;
		}

		return this.each( function ( index ) {
			var jselect = $( this ),
				wrap,
				anchor,
				curr,
				width = 0,
				options,
				selectedOption,
				fontSize;

			// Prevent multiple instances on the same select
			if ( jselect.hasClass( 'superselect-select' ) ) {
				return true;
			}

			wrap = $( '<div class="superselect-wrap superselect-open"><div class="superselect-current"></div></div>' );
			anchor = wrap.wrap( '<div class="superselect-anchor"></div>' ).parent();
			curr = wrap.find( '.superselect-current' );
			options = jselect.find( 'option' );
			selectedOption = jselect[0].selectedIndex;

			jselect.addClass( 'superselect-select' );

			setText( jselect, curr, wrap );

			if ( config.individualStyling ) {
				wrap.addClass( 'superselect-wrap-' + index );
			}

			if ( isMobile() ) {
				toggleOpen( wrap );

				// Becomes invisible and is placed above wrapper to receive screen tap - triggering native <select>
				jselect
					.before( anchor )
					.css({
						opacity: 0.001,
						left: 0,
						top: 0,
						zIndex: 10
					})
					.on( 'change', function () {
						setText( jselect, curr, wrap );
					})
					.appendTo( anchor );
			} else {
				jselect
					.before( anchor )
					.on( 'keydown', function ( e ) {
						if (e.keyCode === 13 || e.keyCode === 32) {
							e.preventDefault();

							setValue( jselect, curr, wrap, true );
						}
					})
					.on( 'change', function () {
						setText( jselect, curr, wrap );
					})
					.on( 'blur', function () {
						jselect
							.css( 'z-index', 0 )
							.hide();

						toggleOpen( wrap );
					})
					.on( 'click', function () {
						if ( jselect.is( ':hidden' ) ) {
							toggleOpen( wrap );

							jselect
								.css( 'z-index', 1 )
								.show();

							setTimeout( function () {
								jselect.focus();
							}); // Avoid trampling confusion with triggered blur
						} else {
							setValue( jselect, curr, wrap, true );
						}
					})
					.appendTo(anchor);
			}

			wrap
				.on( 'mousedown', function () {
					jselect.click();
				})
				.on( 'keydown', function ( e ) {
					var keys = [13, 32, 37, 38, 39, 40];

					// Avoid pagescroll
					if ( $.inArray( e.keyCode, keys ) !== -1 ) {
						e.preventDefault();

						jselect.click();
					}
				});

			if ( config.reuseWidth ) {
				options.each( function () {
					var optionWidth = 0;

					options
						.removeAttr( 'selected' );

					$( this )
						.attr( 'selected', 'selected' );

					setText( jselect, curr, wrap );

					optionWidth = anchor.outerWidth();

					if ( optionWidth > width ) {
						width = optionWidth;
					}
				});

				options
					.removeAttr( 'selected' )
					.eq( selectedOption )
					.attr( 'selected', 'selected' );

				width += wrap.find( '.superselect-right-image' ).outerWidth();

				anchor.width( width );
			}

			if ( isMobile() ) {
				jselect
					.css( 'width', anchor.width() );

				// Android won't set height so we'll increase the font size instead
				while ( jselect.outerHeight() < anchor.outerHeight() ) {
					fontSize = parseInt( jselect.css( 'fontSize' ), 10 );

					jselect.css( 'fontSize', fontSize + 1 + 'px' );
				}

				// We're resetting it here to prevent height issues on Android and since it's never used it's OK
				config.size = 1;
			}

			this.size = config.size;
			setValue( jselect, curr, wrap, false );
		});
	};
}( jQuery ) );