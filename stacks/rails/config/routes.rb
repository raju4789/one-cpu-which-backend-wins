Rails.application.routes.draw do
  get "/health", to: "health#show"
  get "/feed", to: "feed#show"
  post "/posts", to: "posts#create"
  post "/posts/:id/like", to: "likes#create"

  # Anything else is a 404 in the contract's error format.
  match "*path", to: "application#not_found", via: :all
  match "/", to: "application#not_found", via: :all
end
