# Introduction to Ember on Rails

## Initial Setup

### Create blank Rails Project
_Note: Created using ruby 2.1.1 and rails 4.1.1_

$ `rails new rrug -T`

$ `rake db:create`


	# gemfile
	gem 'turbolinks' # Remove this
	
	gem 'ember-rails'
	gem 'ember-source'

$ `bundle`

### Remove turbolinks from the following files
	# app/assets/javascripts/application.js
	# app/views/layouts/application.html.erb

### Generate our Ember files
$ `rails generate ember:install`

$ `rails generate ember:bootstrap -n App --javascript-engine js`

### Set ember environment
	# config/environments/test.rb
	config.ember.variant = :development

	# config/environments/development.rb
	config.ember.variant = :development

	# config/environments/production.rb
	config.ember.variant = :production


## Create a static page
    # config/route.rb
    root :to => 'static#index'
    
    # app/controllers/static_controller.rb
    class StaticController < ApplicationController
    end
    
    # app/views/static/index.html.erb
    <!-- blank -->
    
    # app/assets/javascripts/templates/application.js.hbs
    <h1>Hello World</h1>
    
## Create model
$ `rails generate model topic title:string`

$ `rake db:migrate`

## Create controller
	# config/routes.rb
	namespace :api do
		namespace :v1 do
			resources :topics
		end
	end
	
	# app/controllers/api/v1/topics_controller.rb
	class Api::V1::TopicsController < ApplicationController
		def index
			...
		end
	end
	
## Returning JSON from the API
#### Method #1
	# app/controllers/api/v1/topics_controller.rb
	def index
		@topics = Topic.all
		respond_to do |format|
			format.json do
				render :json => @topics
			end
		end
	end
	
#### Method #2
	# app/controllers/api/v1/topics_controller.rb
	respond_to :json
	
	def index
		@topics = Topic.all
		respond_with @topics
	end
	
## Create a serializer
	# app/serializers/topic_serializer.rb
	class TopicSerializer < ActiveModel::Serializer
		attributes :id, :title
	end

_Note: After creating a serializer, restart the rails server_

## Create the Ember layout
	# app/assets/javascripts/templates/application.js.hbs
	<header><h1><a href="/">Suggest a topic</a></h1></header>

	<div class="main">
	  {{outlet}}
	</div>
	
## Set up the model in Ember
	# app/assets/javascripts/store.js at the top
	DS.RESTAdapter.reopen({
	  namespace: 'api/v1'
	});
	App.ApplicationStore = DS.Store.extend({});
	
	# app/assets/javascripts/models/topic.js
	App.Topic = DS.Model.extend({
	  title: DS.attr('string')
	});


## Set up the routes in Ember
	# app/assets/javascripts/router.js
	App.Router.map(function() {
	  this.resource('topics', { path: '/' })
	});
	
	# app/assets/javascripts/topics_route.js
	App.TopicsRoute = Ember.Route.extend({
	  model: function() { return this.store.find('topic') }
	});

_Note: At this point your Data tab in Ember should show your topics_
	
## Render the topics
	# app/assets/javascripts/templates/topics.js.hbs
	<h2>Topics</h2>
	<ul>
	  {{#each}}
    	<li>{{ title }}</li>
	  {{/each}}
	  

	  
# TODO:
* Show details for a topic
* Introduce route globbing
* Flesh out API
* Introduce testing
* Introduce error handling

## Setting up a Test Environment
	# Gemfile
	group :development, :test do
		gem 'rspec-rails'
		gem 'qunit-rails'
	end
	
	# config/environments/development.rb
	config.qunit.tests_path = "spec"
	
$ `rails generate rspec:install`

$ `rails generate qunit:install`



