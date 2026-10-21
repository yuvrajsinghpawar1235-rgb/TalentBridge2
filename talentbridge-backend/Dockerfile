# Stage 1: Build the Spring Boot application using JDK 21 and Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package the JAR file
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create a minimal production image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 and run the app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]