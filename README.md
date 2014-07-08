# Introduction to Ember on Rails

## Initial Setup

### Create blank Rails Project
_Note: Make sure ruby is 2.1.1_

$ `rails new rrug -T`

$ `rails generate rspec:install`

$ `rake db:create`


	# gemfile
	gem 'turbolinks' # Remove this
	
	gem 'ember-rails'
	gem 'ember-source'
	group :development, :test do
		gem 'rspec-rails'
		gem 'qunit-rails'
	end

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
    root to: 'static#index'
    
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
	
	# app/assets/javascripts/models/topic.js
	App.Topic = DS.Model.extend({
	  title: DS.attr('string')
	});


## List the leads
	# app/assets/javascripts/router.js
	App.Router.map(function() {
	  this.resource('topics', { path: '/' })
	});
	
	# app/assets/javascripts/topics_route.js
	App.TopicRoute = Ember.Route.extend({
	  model: function() { return this.store.find('topic') }
	});
	
	# app/assets/javascripts/templates/topics.js.hbs
	<h2>Topics</h2>
	<ul>
	  {{#each}}
    	<li>{{ title }}</li>
	  {{/each}}
	  
# TODO:
* Get this working
* Flesh out API
* Introduce testing
* Introduce error handling
* Introduce route globbing

