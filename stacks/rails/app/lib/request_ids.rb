# Parses ids from headers and paths. Ids are bigint in Postgres, so anything
# that isn't a positive integer up to 2^63 - 1 is the caller's mistake (400),
# never a database error. Plain Ruby, unit tested.
module RequestIds
  MAX = 2**63 - 1

  def self.parse(value)
    return nil unless value.is_a?(String) && value.match?(/\A[1-9][0-9]{0,18}\z/)

    id = Integer(value, 10)
    id <= MAX ? id : nil
  end
end
