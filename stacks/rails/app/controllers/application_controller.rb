class ApplicationController < ActionController::API
  # Every error leaves as { "error": "..." } with the contract's status code.
  # rescue_from checks the most recently declared handler first.
  rescue_from StandardError do |e|
    Rails.logger.error("request failed: #{e.class}: #{e.message}")
    render json: { error: "internal server error" }, status: :internal_server_error
  end

  rescue_from ActionDispatch::Http::Parameters::ParseError do
    render json: { error: "invalid JSON" }, status: :bad_request
  end

  rescue_from ActiveRecord::InvalidForeignKey do |e|
    status, message = DatabaseErrors.for_foreign_key(e.message)
    raise e unless status

    render json: { error: message }, status: status
  end

  rescue_from ApiError do |e|
    render json: { error: e.message }, status: e.status
  end

  def not_found
    render json: { error: "not found" }, status: :not_found
  end

  private

  # X-User-Id identifies the caller (no auth, by design of the contract).
  def current_user_id
    RequestIds.parse(request.headers["X-User-Id"]) ||
      raise(ApiError.bad_request("X-User-Id must be the id of an existing user"))
  end
end
