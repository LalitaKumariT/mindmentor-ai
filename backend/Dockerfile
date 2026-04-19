FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY pom.xml .



COPY src ./src

COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "target/mindmentor-api-0.0.1-SNAPSHOT.jar"]
