// easy d3-based word cloud plugin https://github.com/wvengen/d3-wordcloud
// requires https://github.com/jasondavies/d3-cloud
// based on https://github.com/shprink/d3js-wordcloud
(function() {
  function wordcloud() {
    var selector = '#wordcloud',
        element = d3.select(selector),
        transitionDuration = 200,
        scale = 'sqrt',
        fill = d3.scale.category20b(),
        layout = d3.layout.cloud(),
        fontSize = null,
        svg = null,
        vis = null,
        onwordclick = undefined;

    wordcloud.element = function(x) {
      if (!arguments.length) return element;
      element = x == null ? '#wordcloud' : x;
      return wordcloud
    };

    wordcloud.selector = function(x) {
      if (!arguments.length) return selector;
      element = d3.select(x == null ? selector : x);
      return wordcloud;
    };

    wordcloud.transitionDuration = function(x) {
      if (!arguments.length) return transitionDuration;
      transitionDuration = typeof x == 'function' ? x() : x;
      return wordcloud;
    };

    wordcloud.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x == null ? 'sqrt' : x;
      return wordcloud;
    };

    wordcloud.fill = function(x) {
      if (!arguments.length) return fill;
      fill = x == null ? d3.scale.category20b() : x;
      return wordcloud;
    };

    wordcloud.onwordclick = function (func) {
        onwordclick = func;
        return wordcloud;
    }

    wordcloud.start = function() {
      init();
      layout.start(arguments);
      return wordcloud;
    };

    function init() {
      layout
        .fontSize(function(d) {
          return fontSize(+d.size);
        })
        .text(function(d) {
          return d.text;
        })
        .on("end", draw);

      svg = element.append("svg");
      vis = svg.append("g").attr("transform", "translate(" + [layout.size()[0] >> 1, layout.size()[1] >> 1] + ")");

      update();
      svg.on('resize', function() { update() });
    }

    function draw(data, bounds) {
      var w = layout.size()[0],
          h = layout.size()[1];

      svg.attr("width", w).attr("height", h);

      scaling = bounds ? Math.min(
        w / Math.abs(bounds[1].x - w / 2),
        w / Math.abs(bounds[0].x - w / 2),
        h / Math.abs(bounds[1].y - h / 2),
        h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;

      var text = vis.selectAll("text")
        .data(data, function(d) {
          return d.text.toLowerCase();
        });
      text.transition()
        .duration(transitionDuration)
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("font-size", function(d) {
          return d.size + "px";
        });
      text.enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("font-size", function(d) {
          return d.size + "px";
        })
        .style("opacity", 1e-6)
        .transition()
        .duration(transitionDuration)
        .style("opacity", 1);
      text.style("font-family", function(d) {
          return d.font || layout.font() || svg.style("font-family");
        })
        .style("fill", function(d) {
          return fill(d.text.toLowerCase());
        })
        .text(function(d) {
          return d.text;
        })
        // clickable words
        .style("cursor", function(d, i) {
          if (onwordclick !== undefined) return 'pointer';
        })
        .on("mouseover", function(d, i) {
          if (onwordclick !== undefined) {
            d3.select(this).transition().style('font-size', d.size + 3 + 'px');
          }
        })
        .on("mouseout", function(d, i) {
          if (onwordclick !== undefined) {
            d3.select(this).transition().style('font-size', d.size + 'px');
          }
        })
        .on("click", function(d, i) {
          if (onwordclick !== undefined) {
                onwordclick(d,i);
            }
        });

      vis.transition()
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scaling + ")");
    };

    function update() {
      var words = layout.words();
      fontSize = d3.scale[scale]().range([10, 100]);
      if (words.length) {
        fontSize.domain([+words[words.length - 1].size || 1, +words[0].size]);
      }
    }

    return d3.rebind(wordcloud, layout, 'on', 'words', 'size', 'font', 'fontStyle', 'fontWeight', 'spiral', 'padding');
  }

  if (typeof module === "object" && module.exports) module.exports = wordcloud;
  else d3.wordcloud = wordcloud;
})();
