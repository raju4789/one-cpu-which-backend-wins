# Errors the API returns, with the status codes from contract/openapi.yaml.
class ApiError < StandardError
  attr_reader :status

  def initialize(status, message)
    super(message)
    @status = status
  end

  def self.bad_request(message) = new(400, message)
  def self.not_found(message) = new(404, message)
end
