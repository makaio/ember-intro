Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :topics
    end
  end

  mount QUnit::Rails::Engine => 'qunit'

  match '*path', :to => 'static#index', :via => [:get, :post]
  root :to => 'static#index'
end
