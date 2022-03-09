$.getJSON('file:///Users/mwill88/Projects/sentimental-analysis/covid-19-sentimental/data/GlobalSentiment_Data.json', function( data ) {
  countries = new Set(Object.keys(data));
});

// Assign handlers immediately after making the request,
// and remember the jqxhr object for this request
var jqxhr = $.getJSON( "file:///Users/mwill88/Projects/sentimental-analysis/covid-19-sentimental/data/GlobalSentiment_Data.json", function() {
  console.log( "success" );
})
  .done(function() {
    console.log( "second success" );
  })
  .fail(function() {
    console.log( "error" );
  })
  .always(function() {
    console.log( "complete" );
  });
