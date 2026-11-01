# The shared schema (contract/schema.sql). Rails reads the columns from the
# database; no migrations or schema file are needed.
class User < ApplicationRecord
  has_many :posts
end
