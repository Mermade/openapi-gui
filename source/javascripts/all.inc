<script src="source/javascripts/lib/_jquery.js"></script>
<script src="source/javascripts/lib/_jquery.highlight.js"></script>
<script src="source/javascripts/lib/_lunr.js"></script>
<script src="source/javascripts/lib/_imagesloaded.min.js"></script>
<script src="source/javascripts/lib/_energize.js"></script>
<script src="source/javascripts/app/_lang.js"></script>
<script src="source/javascripts/app/_search.js"></script>
<script src="source/javascripts/app/_toc.js"></script>
<script type="text/javascript">
$(function() {
  loadToc($('#toc'), '.toc-link', '.toc-list-h2', 10);
  setupLanguages($('body').data('languages'));
  $('.content').imagesLoaded( function() {
    recacheHeights();
    refreshToc();
  });
});

window.onpopstate = function() {
  activateLanguage(getLanguageFromQueryString());
};
</script>
