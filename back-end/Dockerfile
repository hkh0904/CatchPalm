FROM openjdk:17-alpine

# 애플리케이션 빌드된 JAR 파일 복사
COPY /build/libs/app.jar /app.jar

# 프로파일에 맞는 설정 파일 복사
COPY application-aws.properties /app/application-aws.properties
COPY application.properties /app/application.properties

EXPOSE 8080

ENTRYPOINT ["java","-jar", "-Dspring.profiles.active=aws", "/app.jar"]
