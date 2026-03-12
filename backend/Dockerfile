# Stage 1: Build Stage (using Maven + Java 21)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy only pom.xml first to cache dependencies (speeds up future builds)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Copy source and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Stage (Slim Java 21)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy the built jar from the first stage
COPY --from=build /app/target/*.jar app.jar

# 3. Optimize for Render Free Tier (512MB RAM)
# -Xmx350m: Limits the heap so the container doesn't get killed (OOM)
# -XX:+UseSerialGC: Saves memory overhead on low-resource machines
ENV JAVA_OPTS="-Xmx350m -Xms350m -XX:+UseSerialGC"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]