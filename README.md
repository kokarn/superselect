# Yet-Another [jQuery] Select

## Native

yaselect provides a CSS customizable ``select`` box, while introducing minimum HTML & keeping maximum widget usability -- native support for arrow keys, search-as-you-type, scroll wheel, proper z-index, etc.

## Short

yaselect uses the actual ``select`` widget for displaying options, after activating it's ``size`` attribute. That is it.

## Long

Regular "select box styling" scripts uses unnecessary markups like ``ul`` & ``li`` to render select options. This approach means having to add reams of javascript to create new html elements, copy option values into those elements, manage arrow keys, pass chosen option values back into hidden input fields.

Was ``iframe`` shims added to manage z-index issues? Is there support for search-as-you-type? What if ajax scripts changes the select ``options``?

## Usage

Given a select box,

```html
<!-- your select tag -->
<select name="my-select">
  <!-- your option tags -->
</select>
```

Include jQuery, yaselect script & apply it to your ``select`` element

```html
<script src="jquery.min.js"></script>
<script src="jquery.yaselect.min.js"></script>
<script>
  jQuery('select').yaselect();
</script>
```

## Result

Your ``select`` will become

```html
<div class="yaselect-anchor">
  <div class="yaselect-wrap yaselect-?">
    <div class="yaselect-current"><!-- current selection --></div>
  </div>
  <!-- your select tag -->
  <select name="my-select" style="z-index: 0; display: none;" class="yaselect-select" size="?">
    <!-- your option tags -->
  </select>
</div>
```

## Options

Adds a custom class to each select element allowing individual styling
```html
  individualStyling: true
```

Set the number of options to show when clicked
```html
  size: 5
```

Make yaselect mimic the default browser behaviour and set the width of each select to that of it's children
```html
  reuseWidth: true
```

## Compatibility 

Tested with
* IE 7-9
* Firefox
* Safari
* Chrome
* Android 2.3.3 (stock browser)
* iOS 5-6 (both iPhone & iPad)

## Credits

Original code written by Chew Choon Keat, http://github.com/choonkeat/yaselect in 2011 under the MIT license

90% rewritten in 2012 by [jwilsson](Jonathan Wilsson) & Oskar Risberg for Supernormal and re-released under MIT.
