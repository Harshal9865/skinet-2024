# 🔧 Build Stage using .NET 8 SDK
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY skinet.sln ./
COPY API/API.csproj ./API/
COPY Core/Core.csproj ./Core/
COPY Infrastructure/Infrastructure.csproj ./Infrastructure/

# Restore dependencies
RUN dotnet restore

# Copy the entire source
COPY . .

# Publish the API project to /app/out
WORKDIR /src/API
RUN dotnet publish -c Release -o /app/out

# 🚀 Runtime Stage using .NET 8 ASP.NET runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out ./

# Set environment variable and expose port
ENV ASPNETCORE_URLS=http://0.0.0.0:5051
EXPOSE 5051

ENTRYPOINT ["dotnet", "API.dll"]
