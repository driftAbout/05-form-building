'use strict';
//var marked = require('vendor/scripts/marked');
const dateStamp = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;
let articleView = {};

articleView.populateFilters = () => {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      let val = $(this).find('address a').text();
      let optionTag = `<option value="${val}">${val}</option>`;

      if ($(`#author-filter option[value="${val}"]`).length === 0) {
        $('#author-filter').append(optionTag);
      }

      val = $(this).attr('data-category');
      optionTag = `<option value="${val}">${val}</option>`;
      if ($(`#category-filter option[value="${val}"]`).length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};

articleView.handleAuthorFilter = () => {
  $('#author-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-author="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleCategoryFilter = () => {
  $('#category-filter').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $(`article[data-category="${$(this).val()}"]`).fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#author-filter').val('');
  });
};

articleView.handleMainNav = () => {
  $('.main-nav').on('click', '.tab', function() {
    $('.tab-content').hide();
    $(`#${$(this).data('content')}`).fadeIn();
  });

  $('.main-nav .tab:first').click();
};

articleView.setTeasers = () => {
  $('.article-body *:nth-of-type(n+2)').hide();
  $('article').on('click', 'a.read-on', function(e) {
    e.preventDefault();
    if ($(this).text() === 'Read on →') {
      $(this).parent().find('*').fadeIn();
      $(this).html('Show Less &larr;');
    } else {
      $('body').animate({
        scrollTop: ($(this).parent().offset().top)
      },200);
      $(this).html('Read on &rarr;');
      $(this).parent().find('.article-body *:nth-of-type(n+2)').hide();
    }
  });
};

// COMMENT: Where is this function called? Why
// PUT YOUR RESPONSE HERE
// This function is called from a script tag in the new.html file. This ensures that only the code we need for creating blogs is executed.
articleView.initNewArticlePage = () => {
  $('#published-chk').prop('disabled', true).parent().addClass('label-disbled');
  //$('#publish-form')[0].checkValidity()

  articleView.handleMainNav();
  // DONE: Ensure the main .tab-content area is revealed. We might add more tabs later or otherwise edit the tab navigation.
  $('#write').show();

  // DONE: The new articles we create will be copy/pasted into our source data file.
  // Set up this "export" functionality. We can hide it for now, and show it once we have data to export.
  $('#article-export').hide();
  $('#article-json').on('focus', function(){
    this.select();
  });


  $('#draft-body-text').on('change', function(){
    $('#draft-body-html').val(marked($(this).val())).change()

    // //convert all line feeds to double line feeds to get marked to reconize each line as a seperate paragraph
    // let bodyHtml_list =[];
    // let code = false;
    // let paragraphs = $(this).val().trim().split('\n');
    // paragraphs.forEach( (paragraph) => {
    //   if (paragraph.indexOf('```') === -1 ){
    //     (!code) ? paragraph = `${paragraph}\n\n` : paragraph = `${paragraph}\n`;
    //   } else {
    //     paragraph = `\n${paragraph}\n`;
    //     (code) ? code = false : code = true;
    //   }
    //   bodyHtml_list.push(paragraph)
    //   let bodyText = bodyHtml_list.join('')
    //   $('#draft-body-html').val(marked(bodyText)).change();
    // });

  })

  $('#published-chk').on('click', function(){
    $(this).prop('checked') ? $('#published-date').val(dateStamp).change() : $('#published-date').val('').change();
  })

  $('#preview-btn').on('click', function(){
    $('#articles').slideToggle(350, () => {
      let btnTxt = 'Show Preview';
      if ($(this).text() === btnTxt) btnTxt = 'Hide Preview';
      $(this).text(btnTxt);
    })
  })

  // DONE: Add an event handler to update the preview and the export field if any inputs change.
  $('#publish-form input[name]').on('change', articleView.create);
};

articleView.create = () => {
  // Clear out the #articles element, so we can put in the updated preview
  $('#articles').empty();

  // all imputs have a name attribute to use as the property name in the object
  let formData = {};
  $('#publish-form input[name]').each(function(){
    formData[$(this).attr('name')] = $(this).val();
  });

  // Done: Set up a variable to hold the new article we are creating.
  // Done: Instantiate an article based on what's in the form fields:
  let articleDraft = new Article(formData);

  // Done: Use our interface to the Handblebars template to put this new article into the DOM:
  $('#articles').append(articleDraft.toHtml());

  // DONE: Activate the highlighting of any code blocks; look at the documentation for hljs to see how to do this by placing a callback function in the .each():
  $('pre code').each(function(i, block){
    hljs.highlightBlock(block);
  });

  // if the form data is valid, allow the article to be published
  if($('#publish-form')[0].checkValidity()) $('#published-chk').prop('disabled', false).parent().removeClass('label-disbled');

  // DONE: Show our export field, and export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
  $('#article-json').val(JSON.stringify(articleDraft));
  $('#article-export').show();
};

// COMMENT: Where is this function called? Why?
// PUT YOUR RESPONSE HERE
articleView.initIndexPage = () => {
  articles.forEach(article => $('#articles').append(article.toHtml()));
  articleView.populateFilters();
  articleView.handleCategoryFilter();
  articleView.handleAuthorFilter();
  articleView.handleMainNav();
  articleView.setTeasers();
};
