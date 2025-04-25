
### Dockerfile for API Gateway en multi-stage build pour redure la taille de limage 

FROM golang:1.22 AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

FROM golang:1.22-alpine
WORKDIR /app
COPY --from=build app .
CMD ["go", "run", "."]