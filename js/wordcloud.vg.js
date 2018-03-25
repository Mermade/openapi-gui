var wordcloudVega = {
  "$schema": "https://vega.github.io/schema/vega/v3.json",
  "name": "wordcloud",
  "width": 400,
  "height": 200,
  "padding": 0,
  "autosize": "none",

  "signals": [
    {
      "name": "wordPadding", "value": 1,
      "bind": {"input": "range", "min": 0, "max": 5, "step": 1}
    },
    {
      "name": "fontSizeRange0", "value": 8,
      "bind": {"input": "range", "min": 8, "max": 42, "step": 1}
    },
    {
      "name": "fontSizeRange1", "value": 24,
      "bind": {"input": "range", "min": 8, "max": 42, "step": 1}
    },
    {
      "name": "rotate", "value": 45,
      "bind": {"input": "select", "options": [0, 30, 45, 60, 90]}
    }
  ],

  "data": [
    {
      "name": "table",
      "values": [],
      "transform": [
        {
          "type": "countpattern",
          "field": "data",
          "case": "upper",
          "pattern": "[\\w']{3,}",
          "stopwords": "(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)"
        },
        {
          "type": "formula", "as": "weight",
          "expr": "if(datum.text=='API', 600, 300)"
        },
        {
          "type": "formula", "as": "rotate",
          "expr": "[-rotate, 0, rotate][~~(random() * 3)]"
        },
        {
          "type": "wordcloud",
          "size": [{"signal": "width"}, {"signal": "height"}],
          "text": {"field": "text"},
          "font": "Helvetica Neue, Arial",
          "fontSize": {"field": "count"},
          "fontWeight": {"field": "weight"},
          "fontSizeRange": [{"signal": "fontSizeRange0"}, {"signal": "fontSizeRange1"}],
          "padding": {"signal": "wordPadding"},
          "rotate": {"field": "rotate"}
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "color",
      "type": "ordinal",
      "range": ["#d5a928", "#652c90", "#939597"]
    }
  ],

  "marks": [
    {
      "type": "text",
      "from": {"data": "table"},
      "encode": {
        "enter": {
          "text": {"field": "text"},
          "align": {"value": "center"},
          "baseline": {"value": "alphabetic"},
          "fill": {"scale": "color", "field": "text"},
          "font": {"value": "Helvetica Neue, Arial"},
          "fontWeight": {"field": "weight"}
        },
        "update": {
          "x": {"field": "x"},
          "y": {"field": "y"},
          "angle": {"field": "angle"},
          "fontSize": {"field": "fontSize"},
          "fillOpacity": {"value": 1}
        },
        "hover": {
          "fillOpacity": {"value": 0.5}
        }
      }
    }
  ]
};
