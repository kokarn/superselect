/*
* yaselect
* is yet-another jquery plugin for making <select> elements stylable by CSS
* http://github.com/choonkeat/yaselect
*
* Copyright (c) 2011 Chew Choon Keat
* Released under the MIT license
*
* Modified by Supernormal
*/

(function ($) {
	$.fn.yaselect = function (config) {
		var defaults = {
			hoverOnly: false,
			size: 5,
			individualStyling: true,
			useSelectCss: {
				reuseWidth: true,
				addWidthToOriginal: 0
			}
		};

		config = $.extend(defaults, config);

		function getText(jselect) {
			var text = '',
				selectedIndex = 0;

			if (jselect[0].selectedIndex) {
				selectedIndex = jselect[0].selectedIndex;
			}

			text = jselect.find('option:nth(' + selectedIndex + ')').text();

			return text;
		}

		function setText(jselect, curr) {
			var text = getText(jselect);

			if (text === '') {
				text = jselect.children( 'option:selected' ).text() + '';
			}

			text = text + '<div class="yaselect-right-image"></div>';

			curr.html(text);
		}

		function setValue(jselect, curr, wrap, to_focus_wrap) {
			jselect.blur();

			setText(jselect, curr);

			/*jselect.css({
				top: wrap.outerHeight()
			});*/

			if (to_focus_wrap) {
				wrap.focus();
			}
		}

		function toggleOpen(wrap) {
			wrap.toggleClass('yaselect-open yaselect-close');
		}

		return this.each(function (index, select) {
			var jselect = $(select).addClass('yaselect-select'),
				wrap = $('<div class="yaselect-wrap yaselect-open"><div class="yaselect-current"></div></div>'),
				anchor = wrap.wrap('<div class="yaselect-anchor"></div>').parent(),
				curr = wrap.find('.yaselect-current');

			setText(jselect, curr);

			if (config.individualStyling) {
				jselect.addClass( 'yaselect-wrap-' + index );
			}

			if (config.hoverOnly || window.navigator && navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i)) {
				toggleOpen(wrap);

				return jselect /* becomes invisible and is placed above wrapper to receive screen tap -- triggering native <select> */
					.before(anchor)
					.css("opacity", 0.001)
					.on("change", function () {
						setText(jselect, curr);
					})
					.appendTo(anchor);
			}

			jselect
				.before(anchor)
				.on("keydown", function (e) {
					if (e.keyCode == 13 || e.keyCode == 32) {
						e.preventDefault();

						setValue(jselect, curr, wrap, true);
					}
				})
				.on("change", function () {
					setText(jselect, curr);
				})
				.on("blur", function () {
					jselect.hide();

					toggleOpen(wrap);
				})
				.on("click", function () {
					if (jselect.is(':hidden')) {
						toggleOpen(wrap);

						jselect.show();

						setTimeout(function () {
							jselect.focus();
						}); /* avoid trampling confusion with triggered blur */
					} else {
						setValue(jselect, curr, wrap, true);
					}
				})
				.appendTo(anchor);

			wrap
				.on("mousedown", function () {
					jselect.click();
				})
				.on("keydown", function (e) {
					var keys = [13, 32, 37, 38, 39, 40];

					if ($.inArray(e.keyCode, keys) !== -1) {
						e.preventDefault();

						jselect.click();
					}
				}); /* preventDefault avoid pagescroll */

			if (config.useSelectCss.reuseWidth) {
				var width = 0,
					options = jselect.find("option");

				options.each(function () {
					var optionWidth = 0;

					options.removeAttr("selected");

					$(this).attr("selected", "selected");

					setText(jselect, curr);

					optionWidth = anchor.outerWidth();

					if (optionWidth > width) {
						width = optionWidth;
					}
				});

				width += $(".yaselect-right-image").outerWidth();

				anchor.width(width + config.useSelectCss.addWidthToOriginal);
			}

			select.size = config.size;
			setValue(jselect, curr, wrap, false);
		});
	};
})(jQuery);