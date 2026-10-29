class PostsController < ApplicationController
  def create
    user_id = current_user_id
    body = request.request_parameters["body"]
    raise ApiError.bad_request("body must be a string of 1 to #{Post::MAX_BODY} characters") unless body.is_a?(String)

    post = Post.new(user_id: user_id, body: body)
    unless post.save
      message = post.errors.include?(:user) ? "unknown user" : post.errors.full_messages.to_sentence
      raise ApiError.bad_request(message)
    end

    render json: post.as_api_json, status: :created
  end
end
