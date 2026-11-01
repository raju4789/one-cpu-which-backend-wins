# The app-cache phase: the serialized feed is kept for ttl seconds.
#
# Single flight: when the entry expires, the first thread reloads it while the
# others wait on the lock and then get the fresh copy, instead of all of them
# querying Postgres at once (a cache stampede). A failed load is not cached.
# Plain Ruby, unit tested.
class FeedCache
  def initialize(ttl:, clock: -> { Process.clock_gettime(Process::CLOCK_MONOTONIC) }, on_lookup: ->(_hit) {}, &load)
    @ttl = ttl
    @clock = clock
    @on_lookup = on_lookup
    @load = load
    @lock = Mutex.new
    @entry = nil # [value, expires_at], replaced as one frozen object
  end

  def get
    if (value = fresh_value)
      @on_lookup.call(true)
      return value
    end

    @lock.synchronize do
      if (value = fresh_value) # another thread reloaded it while we waited
        @on_lookup.call(true)
        return value
      end
      @on_lookup.call(false)
      value = @load.call
      @entry = [value, @clock.call + @ttl].freeze
      value
    end
  end

  private

  # Value and expiry live in one object, swapped in one assignment, so a
  # thread never sees a new value with an old expiry or the other way round.
  def fresh_value
    entry = @entry
    entry[0] if entry && entry[1] > @clock.call
  end
end
