/**
 * fitRows layout mode
 */

( function( window, factory ) {
  // universal module definition
  /* jshint strict: false */ /*globals define, module, require */
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
        '../layout-mode'
      ],
      factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      require('../layout-mode')
    );
  } else {
    // browser global
    factory(
      window.Isotope.LayoutMode
    );
  }

}( window, function factory( LayoutMode ) {
'use strict';

var FitRows = LayoutMode.create('fitRows');

var proto = FitRows.prototype;

proto._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this.row = 0;
  this.rows = [];
  this._getMeasurement( 'gutter', 'outerWidth' );

  if (this.options.equalheight) {
    for (var i=0; i < this.isotope.items.length; i++) {
      this.isotope.items[i].css({
        height: 'auto'
      });
    }
  }
};

proto._getItemLayoutPosition = function( item ) {
  item.getSize();

  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;

  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  if (this.x == 0 && this.y != 0) {
    this.row++;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max(this.maxY, this.y + item.size.outerHeight);
  this.x += itemWidth;

  // Compare Y from this row and previous row
  if (typeof this.rows[this.row] == 'undefined') {
    this.rows[this.row] = [];
    this.rows[this.row].start = this.y;
    this.rows[this.row].end = this.maxY;
  }
  else {
    this.rows[this.row].end = Math.max(this.rows[this.row].end, this.maxY);
  }

  // Record row number to item
  item.row = this.row;

  return position;
};

proto._equalHeight = function() {

  // Should we use this.isotope.filteredItems or this.isotope.items?

  for (var i=0; i < this.isotope.items.length; i++) {
    var row = this.isotope.items[i].row,
        data = this.rows[row];

    if (data) {
      var height =  data.end - data.start;

      height -= this.isotope.items[i].size.borderTopWidth + this.isotope.items[i].size.borderBottomWidth;
      height -= this.isotope.items[i].size.marginTop + this.isotope.items[i].size.marginBottom;
      height -= this.gutter.height || 0;

      if (this.isotope.items[i].size.isBorderBox == false) {
        height -= this.isotope.items[i].size.paddingTop + this.isotope.items[i].size.paddingBottom;
      }

      this.isotope.items[i].size.height = height;

      this.isotope.items[i].css({
        height : height.toString() + 'px',
      });
    }
  }
}

proto._getContainerSize = function() {
  if (this.options.equalheight) {
    this._equalHeight();
  }

  return { height: this.maxY };
};

return FitRows;

}));
