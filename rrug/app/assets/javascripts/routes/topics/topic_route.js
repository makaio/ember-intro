App.TopicRoute = Ember.Route.extend({
  model: function(params) { return this.store.find('topic', params.id) }
});
