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
$ `rails generate model topic title:string description:text`

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
		attributes :id, :title, :description
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
	  title: DS.attr('string'),
	  description: DS.attr('string')
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
	</ul>
	  
## Show details for a topic
	# app/assets/javascripts/router.js
	this.resource('topics', {path: '/'}, function() {
    	this.resource('topic', {path: '/topics/:id'});
	});
	
	# app/assets/javascripts/topics/topic_route.js
	App.TopicRoute = Ember.Route.extend({
	  model: function(params) { return this.store.find('topic', params.id) }
	});
	
	# app/assets/javascripts/templates/topics/topic.js.hbs
	<h2>{{ title }}</h2>
	<div>{{ description }}</div>
	
	# app/assets/javascripts/templates/topics.js.hbs
	<h2>Topics</h2>
	<ul>
	  {{#each topic in controller}}
	    <li>
	      {{#link-to 'topic' topic}}
	        {{ topic.title }}
	      {{/link-to}}
	    </li>
	  {{/each}}
	 </ul>
	 
	 {{ outlet }}
	 
## Remove /#/ from URLs
	# app/assets/javascripts/router.js
	App.Router.reopen({
	  location: 'auto'
	});
	
	# config/router.rb
	match '*path', :to => 'static#index', :via => [:get, :post]


## Finish fleshing out the API in Rails
	# app/controllers/api/v1/topics_controller.rb
	class Api::V1::TopicsController < ApplicationController
	  def index
	    respond_with Topic.all
	  end

	  def show
	    begin
	      @topic = Topic.find(params[:id])
	      respond_with @topic
	    rescue ActiveRecord::RecordNotFound => message
	      render_error(message)
	    end
	  end

	  def create
	    @topic = Topic.new(topic_params)
	    if @topic.save
	      respond_with :api, @topic
	    else
	      render_error(@topic.errors.full_messages)
	    end
	  end
  
	  def update
		begin
	      @topic = Topic.find(params[:id])
	      if @topic.update_attributes(topic_params)
	        respond_with :api, @topic
	      else
	        render_error(@topic.errors.full_messages)
	      end
	    rescue ActiveRecord::RecordNotFound => message
	      render_error(message)
	    end
	  end

	  def destroy
	    begin
	      @topic = Topic.find(params[:id])
	      @topic.destroy!
	      respond_with :status => :ok
	    rescue ActiveRecord::RecordNotFound => message
	      render_error(message)
	    end
	  end

	  private
	  def topic_params
	    params.require(:topic).permit(:title, :description)
	  end

	  def render_error(errors)
	    render :json => {:errors => errors }, :status => 422
	  end
	end

## Setting up a Test Environment
	# Gemfile
	group :development, :test do
		gem 'rspec-rails'
		gem 'qunit-rails'
	end
	
	# config/routes.rb
	mount QUnit::Rails::Engine => 'qunit'
	
	# config/environments/development.rb
	config.qunit.tests_path = "spec"
	
	# config/initializers/assets.rb
	Rails.application.config.assets.precompile += %w( qunit.css test_helper.css qunit.js test_helper.js)

	
$ `rails generate rspec:install`

$ `rails generate qunit:install`

## First Test
	# spec/javascripts/integration/topicsTest.js
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
	
	# spec/javascripts/test_helper.js
	document.write('<div id="ember-testing-container"><div id="ember-testing"></div></div>');

	App.rootElement = '#ember-testing';
	App.setupForTesting();
	App.injectTestHelpers();

	function exists(selector) {
	  return !!find(selector).length;
	}
	
	# spec/stylesheets/test_helper.css
	#ember-testing-container {
	 position: absolute;
	 background: white;
	 bottom: 0;
	 right: 0;
	 width: 640px;
	 height: 384px;
	 overflow: auto;
	 z-index: 9999;
	 border: 1px solid #ccc; 
	}

	#ember-testing {
	  zoom: 50%;
	}



