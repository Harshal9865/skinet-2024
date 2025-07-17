# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
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
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview
WORKDIR /app
COPY --from=build /app/out .

# Set environment and port
ENV ASPNETCORE_URLS=http://0.0.0.0:5051
EXPOSE 5051

ENTRYPOINT ["dotnet", "API.dll"]
