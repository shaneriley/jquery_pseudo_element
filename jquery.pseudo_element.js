$(function() {
  $("p").click(function(e) {
    console.log($("p").afterElement({ color: "red" }));
  });
  $("li").click(function() {
    console.log($("li").pseudoElement());
  });
});

;(function($) {
  var ss = document.styleSheets;

  $.fn.beforeElement = function() {
    return parseStylesheets(this.selector + "::before");
  };
  $.fn.afterElement = function(css) {
    if (css) { return setStylesheets(this.selector + "::after", css); }
    return parseStylesheets(this.selector + "::after");
  };
  $.fn.pseudoElement = function() {
    return {
      before: parseStylesheets(this.selector + "::before"),
      after: parseStylesheets(this.selector + "::after")
    };
  };

  var parseStylesheets = function(selector) {
    var style_rule = false;
    $.each(ss, function(i) {
      $.each(ss[i].rules, function(j, v) {
        if (v.selectorText === selector) { style_rule = v; }
      });
    });
    style_rule && (style_rule = buildStyleObject(style_rule));
    return style_rule;
  };

  var setStylesheets = function(selector, css) {
    var style = [];
    $.each(ss, function(i) {
      $.each(ss[i].rules, function(j, v) {
        if (v.selectorText === selector) {
          $.each($.extend(buildStyleObject(v).style, css), function(k, val) {
            v.style[k.replace(/[A-Z]/g, function($1) {
              return "-" + $1.toLowerCase();
            })] = val;
          });
        }
      });
    });
  };

  var buildStyleObject = function(rule) {
    var o = {},
        css_text = rule.style.cssText.split(";"),
        css_pairs = {};
    $.each(css_text, function(i) {
      var k, v;
      if ($.trim(css_text[i])) {
        k = /^(.*): /.exec(css_text[i])[1].replace(/(-.{1})/g, function($1) {
          return $1.substr(1).toUpperCase();
        });
        v = /:\s?(.*)$/.exec(css_text[i])[1];
        css_pairs[k] = v;
      }
    });
    o.origin = rule.parentStyleSheet.href;
    o.style = css_pairs;
    return o;
  };
})($ || jQuery);
