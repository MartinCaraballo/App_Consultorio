FROM maven:3.9.9 AS build
WORKDIR /build
COPY . .
RUN mvn clean package

FROM openjdk:21-slim
WORKDIR /app
COPY --from=build /build/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar", "--debug"]
