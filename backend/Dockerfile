# =========================
# Build stage
# =========================
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x gradlew

RUN ./gradlew clean bootJar --no-daemon

# Copy the Spring Boot executable JAR
# while ignoring the -plain.jar
RUN find build/libs -maxdepth 1 -type f -name "*.jar" ! -name "*-plain.jar" -exec cp {} app.jar \;

# =========================
# Runtime stage
# =========================
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
