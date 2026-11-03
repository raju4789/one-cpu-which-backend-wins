# Spring Boot's recommended container layout: build the jar with Maven, then
# extract it into layers (dependencies apart from the app's own classes) and
# run it on a JRE. Both images are pinned by digest (bin/pin), like the harness
# images, so every build uses the same bytes.

# ---- build: resolve dependencies, run the unit tests, package the jar
FROM maven:3.9.11-eclipse-temurin-25@sha256:407c4423cec0cf2981055bc2c6c0dc211d9605b6669279b95997f2d1c7e91e2c AS build
WORKDIR /build
COPY pom.xml .
# Dependencies in their own layer: later builds reuse it unless pom.xml changes.
RUN mvn -B -q dependency:go-offline
COPY src src
# package runs the unit tests: an image with a failing test is never built.
RUN mvn -B -q package \
 && java -Djarmode=tools -jar target/app.jar extract --layers --launcher --destination /extracted

# ---- runtime: a JRE and the extracted layers, as an unprivileged user
FROM eclipse-temurin:25-jre@sha256:ecdc0adb37bde1a281c4d245a3cd535004b1fc8322d560f5b09463b248c81df0
WORKDIR /app
# The Ubuntu base already has a user with id 1000 ("ubuntu"), so spring gets 1001.
RUN groupadd --system --gid 1001 spring \
 && useradd spring --system --uid 1001 --gid 1001 --no-create-home --shell /usr/sbin/nologin
# Least-changing layers first, so a code change only rebuilds the last one.
COPY --from=build /extracted/dependencies/ ./
COPY --from=build /extracted/spring-boot-loader/ ./
COPY --from=build /extracted/snapshot-dependencies/ ./
COPY --from=build /extracted/application/ ./
USER 1001:1001
EXPOSE 8080 9464
# Tuning change 2: a 256 MB heap instead of the JVM's default, a quarter of the
# VM's memory (473 MB). The heap grows towards its limit under load, and Java's
# memory outside the heap (threads, classes, buffers) comes on top: at the
# default, overload took Java past 650 MB and Linux killed it (README, tuning
# log). The GC stays the JVM's choice for one CPU, Serial.
# Java as PID 1, so SIGTERM reaches it and Spring shuts down gracefully.
ENTRYPOINT ["java", "-Xmx256m", "org.springframework.boot.loader.launch.JarLauncher"]
