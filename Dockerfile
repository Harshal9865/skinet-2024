# Build stage
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy solution and projects
COPY skinet.sln ./
COPY API/API.csproj ./API/
COPY Core/Core.csproj ./Core/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy the rest of the code
COPY . .

# Publish API project
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/out

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out .

# Set environment and port (5051 based on your note)
ENV ASPNETCORE_URLS=http://0.0.0.0:5051
EXPOSE 5051

ENTRYPOINT ["dotnet", "API.dll"]
