# Spring Boot's recommended container layout: build the jar with Maven, then
# extract it into layers (dependencies apart from the app's own classes) and
# run it on a JRE. Both images are pinned by digest (bin/pin), like the harness
# images, so every build uses the same bytes.

# ---- build: resolve dependencies, run the unit tests, package the jar
FROM maven:3.9.11-eclipse-temurin-25 AS build
WORKDIR /build
COPY pom.xml .
# Dependencies in their own layer: later builds reuse it unless pom.xml changes.
RUN mvn -B -q dependency:go-offline
COPY src src
# package runs the unit tests: an image with a failing test is never built.
RUN mvn -B -q package \
 && java -Djarmode=tools -jar target/app.jar extract --layers --launcher --destination /extracted

# ---- runtime: a JRE and the extracted layers, as an unprivileged user
FROM eclipse-temurin:25-jre
WORKDIR /app
RUN groupadd --system --gid 1000 spring \
 && useradd spring --uid 1000 --gid 1000 --no-create-home --shell /usr/sbin/nologin
# Least-changing layers first, so a code change only rebuilds the last one.
COPY --from=build /extracted/dependencies/ ./
COPY --from=build /extracted/spring-boot-loader/ ./
COPY --from=build /extracted/snapshot-dependencies/ ./
COPY --from=build /extracted/application/ ./
USER 1000:1000
EXPOSE 8080 9464
# The JVM at its defaults: it sizes the heap from the VM's memory and picks its
# own GC for one CPU. Both are tuning steps (README, tuning log).
# Java as PID 1, so SIGTERM reaches it and Spring shuts down gracefully.
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
