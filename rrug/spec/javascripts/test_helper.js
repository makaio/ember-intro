//= require application
//= require_tree .
//= require_self

document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

App.rootElement = '#ember-testing';
App.setupForTesting();
App.injectTestHelpers();

function exists(selector) {
  return !!find(selector).length;
}
