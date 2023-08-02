# Base image
FROM openjdk:17-alpine

# Set the JAR file path in the build context
ARG JAR_FILE=/build/libs/*.jar

# Copy the JAR file from the build context to the container
COPY ${JAR_FILE} /app.jar

# Copy the modified application-aws.properties file to the container
COPY src/main/resources/application-aws.properties /app/application.properties

# Expose port 8081 (if your application listens on this port)
EXPOSE 8081

# Set the entry point for the container to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app.jar"]
