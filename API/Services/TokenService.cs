using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Services
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<AppUser> _userManager;

        public TokenService(IConfiguration config, UserManager<AppUser> userManager)
        {
            _config = config;
            _userManager = userManager;
        }

        public async Task<string> CreateToken(AppUser user)
        {
            var email = user.Email ?? throw new ArgumentNullException(nameof(user.Email));
            var userId = user.Id ?? throw new ArgumentNullException(nameof(user.Id));
            var username = user.UserName ?? throw new ArgumentNullException(nameof(user.UserName));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(JwtRegisteredClaimNames.NameId, userId),
                new Claim(ClaimTypes.Name, username)
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenKey = _config["Token:Key"] ?? throw new ArgumentNullException("Token:Key");
            var tokenIssuer = _config["Token:Issuer"] ?? throw new ArgumentNullException("Token:Issuer");
            var tokenAudience = _config["Token:Audience"] ?? throw new ArgumentNullException("Token:Audience");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: tokenIssuer,
                audience: tokenAudience,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
