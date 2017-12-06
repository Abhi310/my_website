(function() {
    var documentEl_1 = $(document),
    parallaxBg_1 = $('.speed_2');      
    documentEl_1.on('scroll', function() {
    var currScrollPos_1 = documentEl_1.scrollTop();
    parallaxBg_1.css('background-position', '0 ' + -currScrollPos_1/2 + 'px');
    });
})();

(function() {
    var documentEl_2 = $(document),
    parallaxBg_2 = $('.speed_3');      
    documentEl_2.on('scroll', function() {
    var currScrollPos_2 = documentEl_2.scrollTop();
    parallaxBg_2.css('background-position', '0 ' + -currScrollPos_2/3 + 'px');
    });
})();

(function() {
    var documentEl_3 = $(document),
    parallaxBg_3 = $('.speed_4');      
    documentEl_3.on('scroll', function() {
    var currScrollPos_3 = documentEl_3.scrollTop();
    parallaxBg_3.css('background-position', '0 ' + -currScrollPos_3/4 + 'px');
    });
})();

(function() {
    var documentEl_4 = $(document),
    parallaxBg_4 = $('.speed_5');      
    documentEl_4.on('scroll', function() {
    var currScrollPos_4 = documentEl_4.scrollTop();
    parallaxBg_4.css('background-position', '0 ' + -currScrollPos_4/5 + 'px');
    });
})();

(function() {
    var documentEl_5 = $(document),
    parallaxBg_5 = $('.speed_6');      
    documentEl_5.on('scroll', function() {
    var currScrollPos_5 = documentEl_5.scrollTop();
    parallaxBg_5.css('background-position', '0 ' + -currScrollPos_5/6 + 'px');
    });
})();

(function() {
    var documentEl_6 = $(document),
    parallaxBg_6 = $('.speed_7');      
    documentEl_6.on('scroll', function() {
    var currScrollPos_6 = documentEl_6.scrollTop();
    parallaxBg_6.css('background-position', '0 ' + -currScrollPos_6/7 + 'px');
    });
})();

(function() {
    var documentEl_7 = $(document),
    parallaxBg_7 = $('.speed_8');      
    documentEl_7.on('scroll', function() {
    var currScrollPos_7 = documentEl_7.scrollTop();
    parallaxBg_7.css('background-position', '0 ' + -currScrollPos_7/8 + 'px');
    });
})();

(function() {
    var documentEl_8 = $(document),
    parallaxBg_8 = $('.speed_9');      
    documentEl_8.on('scroll', function() {
    var currScrollPos_8 = documentEl_8.scrollTop();
    parallaxBg_8.css('background-position', '0 ' + -currScrollPos_8/9 + 'px');
    });
})();

(function() {
    var documentEl_9 = $(document),
    parallaxBg_9 = $('.speed_10');      
    documentEl_9.on('scroll', function() {
    var currScrollPos_9 = documentEl_9.scrollTop();
    parallaxBg_9.css('background-position', '0 ' + -currScrollPos_9/10 + 'px');
    });
})();

(function() {
    var documentEl_10 = $(document),
    parallaxBg_10 = $('.speed_15');      
    documentEl_10.on('scroll', function() {
    var currScrollPos_10 = documentEl_10.scrollTop();
    parallaxBg_10.css('background-position', '0 ' + -currScrollPos_10/15 + 'px');
    });
})();

(function() {
    var documentEl_11 = $(document),
    parallaxBg_11 = $('.speed_20');      
    documentEl_11.on('scroll', function() {
    var currScrollPos_11 = documentEl_11.scrollTop();
    parallaxBg_11.css('background-position', '0 ' + -currScrollPos_11/20 + 'px');
    });
})();

(function() {
    var documentEl_12 = $(document),
    parallaxBg_12 = $('.speed_25');      
    documentEl_12.on('scroll', function() {
    var currScrollPos_12 = documentEl_12.scrollTop();
    parallaxBg_12.css('background-position', '0 ' + -currScrollPos_12/25 + 'px');
    });
})();

(function() {
    var documentEl_13 = $(document),
    parallaxBg_13 = $('.speed_30');      
    documentEl_13.on('scroll', function() {
    var currScrollPos_13 = documentEl_13.scrollTop();
    parallaxBg_13.css('background-position', '0 ' + -currScrollPos_13/30 + 'px');
    });
})();

/*
* HeadsUp 1.5.6
* @author Kyle Foster (@hkfoster)
* @license MIT
*/
;(function( window, document, undefined ) {

  'use strict';

  // Extend function
  function extend( a, b ) {
    for( var key in b ) {
      if( b.hasOwnProperty( key ) ) {
        a[ key ] = b[ key ];
      }
    }
    return a;
  }

  // Throttle function (https://bit.ly/1eJxOqL)
  function throttle( fn, threshhold, scope ) {
    threshhold || ( threshhold = 250 );
    var previous, deferTimer;
    return function () {
      var context = scope || this,
          current = Date.now(),
          args    = arguments;
      if ( previous && current < previous + threshhold ) {
        clearTimeout( deferTimer );
        deferTimer = setTimeout( function () {
        previous   = current;
        fn.apply( context, args );
        }, threshhold );
      } else {
        previous = current;
        fn.apply( context, args );
      }
    };
  }

  // Class management functions
  function classReg( className ) {
    return new RegExp( '(^|\\s+)' + className + '(\\s+|$)' );
  }

  function hasClass( el, cl ) {
    return classReg( cl ).test( el.className );
  }

  function addClass( el, cl ) {
    if ( !hasClass( el, cl ) ) {
      el.className = el.className + ' ' + cl;
    }
  }

  function removeClass( el, cl ) {
    el.className = el.className.replace( classReg( cl ), ' ' );
  }

  // Main function definition
  function headsUp( selector, options ) {
    this.selector = document.querySelector( selector );
    this.options  = extend( this.defaults, options );
    this.init();
  }

  // Overridable defaults
  headsUp.prototype = {
    defaults : {
      delay       : 300,
      sensitivity : 20
    },

    // Init function
    init : function( selector ) {

      var self         = this,
          options      = self.options,
          selector     = self.selector,
          oldScrollY   = 0, 
          winHeight;

      // Resize handler function
      function resizeHandler() {
        winHeight = window.innerHeight;
        return winHeight;
      }

      // Scroll handler function
      function scrollHandler() {

        // Scoped variables
        var newScrollY = window.pageYOffset,
            docHeight  = document.body.scrollHeight,
            pastDelay  = newScrollY > options.delay,
            goingDown  = newScrollY > oldScrollY,
            fastEnough = newScrollY < oldScrollY - options.sensitivity,
            rockBottom = newScrollY < 0 || newScrollY + winHeight >= docHeight;

        // Where the magic happens
        if ( pastDelay && goingDown ) {
          addClass( selector, 'heads-up' );
        } else if ( !goingDown && fastEnough && !rockBottom || !pastDelay ) {
          removeClass( selector, 'heads-up' );
        }

        // Keep on keeping on
        oldScrollY = newScrollY;
      }

      // Attach listeners
      if ( selector ) {
        
        // Trigger initial resize
        resizeHandler();

        // Resize function listener
        window.addEventListener( 'resize', throttle( resizeHandler ), false );

        // Scroll function listener
        window.addEventListener( 'scroll', throttle( scrollHandler, 100 ), false );
      }
    }
  };

  window.headsUp = headsUp;

})( window, document );

// Instantiate HeadsUp
new headsUp( '.main-header' );