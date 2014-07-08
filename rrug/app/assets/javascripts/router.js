// For more information see: http://emberjs.com/guides/routing/

App.Router.map(function() {
  this.resource('topics', {path: '/'}, function() {
    this.resource('topic', {path: '/topics/:id'});
  });
});

App.Router.reopen({
  location: 'auto'
});
