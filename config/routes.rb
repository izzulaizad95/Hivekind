Rails.application.routes.draw do
  root 'homepage#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  get "api/urls/new", to: "api/urls#new", as: "new_api_url" unless Rails.env.production?
  get "api/urls/user/:user_id", to: "api/urls#index", as: "api_urls_user" unless Rails.env.production?
  # patch "api/urls/user/:user_id/update", to: "api/urls#update", as: "api_urls_user_update" unless Rails.env.production?

  namespace :api do
    resources :urls, except: [:new, :index]

    namespace :users do
      get 'whoami'
      # resources :urls
    end

    namespace :top do
      get 'visited'
      get 'recent'
    end

    resources :reports
  end

  get 'o/:slug', to: 'links#visit', as: 'visit'
  post '/auth/:provider/callback', to: 'sessions#create'
  delete '/auth/logout', to: 'sessions#destroy'
  get 'a/:slug' => 'homepage#index', as: 'analytics'

  mount ActionCable.server => '/cable'

  get '/*path' => 'homepage#index'
end
