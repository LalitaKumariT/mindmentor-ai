FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN ./mvnw dependency:go-offline

COPY src ./src



EXPOSE 8080

CMD ["java", "-jar", "target/mindmentor-api-0.0.1-SNAPSHOT.jar"]
