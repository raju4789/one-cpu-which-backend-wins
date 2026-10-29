# Rails 8.1's generated Dockerfile, trimmed to what this API needs: Ruby on
# Debian slim, jemalloc, gems installed in a build stage, a non-root runtime.
# The Ruby image is pinned by digest (bin/pin), like the harness images: every
# build uses the same bytes, and once it's local, bin/up's rebuild before each
# run doesn't need Docker Hub.

# ---- base: what both stages share
FROM ruby:3.4.12-slim@sha256:dd852d6dd55f5d283839e940aeb0394bb5f5a4f51295a4eee545f732c46d1b41 AS base
WORKDIR /rails
# libjemalloc2: a memory allocator that fragments far less than glibc's with
# many threads, so Ruby's memory stays flat. Rails's generated Dockerfile uses it
# by default, and so does Catawiki's. libpq5: the Postgres client library.
RUN apt-get update -qq \
 && apt-get install --no-install-recommends -y libjemalloc2 libpq5 \
 && ln -s /usr/lib/$(uname -m)-linux-gnu/libjemalloc.so.2 /usr/local/lib/libjemalloc.so \
 && rm -rf /var/lib/apt/lists /var/cache/apt/archives
ENV RAILS_ENV=production \
    BUNDLE_DEPLOYMENT=1 \
    BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT=development:test \
    LD_PRELOAD=/usr/local/lib/libjemalloc.so

# ---- build: compile gems, run the tests, check the app loads
FROM base AS build
RUN apt-get update -qq \
 && apt-get install --no-install-recommends -y build-essential libpq-dev libyaml-dev pkg-config \
 && rm -rf /var/lib/apt/lists /var/cache/apt/archives
COPY Gemfile Gemfile.lock .ruby-version ./
RUN bundle install \
 && rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache \
 && bundle exec bootsnap precompile --gemfile
COPY . .
# Unit tests (plain Ruby, no database), then load every file the way production
# does (eager loading), so an image with a broken file or test is never built.
RUN bundle exec ruby -Itest -e 'Dir["./test/**/*_test.rb"].sort.each { |f| require f }' \
 && SECRET_KEY_BASE_DUMMY=1 DATABASE_URL=postgres://build/none bin/rails zeitwerk:check \
 && bundle exec bootsnap precompile app/ \
 && chmod -R a+rX /rails "${BUNDLE_PATH}"
# chmod: COPY keeps the source files' permissions. Files that are private on
# the host (mode 600) would be unreadable to the "rails" user at runtime.

# ---- runtime: gems and app only, as an unprivileged user
FROM base
# Ruby's GC at its defaults: keeping more of the heap free was tried and dropped
# (README, tuning log).
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails
RUN groupadd --system --gid 1000 rails \
 && useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash \
 && mkdir -p tmp/pids log \
 && chown -R rails:rails tmp log
USER 1000:1000
EXPOSE 8080 9464
# Puma as PID 1: on SIGTERM it stops accepting, finishes in-flight requests, exits.
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
