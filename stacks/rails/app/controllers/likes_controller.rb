class LikesController < ApplicationController
  def create
    user_id = current_user_id
    post_id = RequestIds.parse(params[:id]) || raise(ApiError.bad_request("post id must be a positive integer"))
    Like.add(post_id: post_id, user_id: user_id)
    head :no_content
  end
end
