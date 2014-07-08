module("Ember.js Library", {
  setup: function() {
    Ember.run(App, App.advanceReadiness);
  },
  teardown: function() {
    App.reset();
  }
});

test("Topics#index", function() {
  expect(1);

  visit("/").then(function() {
    ok(exists("*"), "Page loads");
  });
});
