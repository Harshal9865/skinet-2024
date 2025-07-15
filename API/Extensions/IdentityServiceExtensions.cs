using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            var tokenKey = config["Token:Key"];
            var issuer = config["Token:Issuer"];
            var audience = config["Token:Audience"];

            if (string.IsNullOrWhiteSpace(tokenKey))
                throw new ArgumentException("Missing Token:Key in configuration");
            if (string.IsNullOrWhiteSpace(issuer))
                throw new ArgumentException("Missing Token:Issuer in configuration");
            if (string.IsNullOrWhiteSpace(audience))
                throw new ArgumentException("Missing Token:Audience in configuration");

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = issuer,
                        ValidateAudience = true,
                        ValidAudience = audience,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey))
                    };
                });

            return services;
        }
    }
}
