using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
        {
            var email = dto.Email?.ToLower() ?? throw new ArgumentNullException(nameof(dto.Email));
            if (await _userManager.Users.AnyAsync(x => x.Email == email))
                return BadRequest("Email already taken");

            var user = new AppUser
            {
                DisplayName = dto.DisplayName,
                Email = email,
                UserName = email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded) return BadRequest(result.Errors);

            await _userManager.AddToRoleAsync(user, "Member");

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email!,
                Token = await _tokenService.CreateToken(user),
                Roles = new List<string> { "Member" }
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto dto)
        {
            var email = dto.Email?.ToLower() ?? throw new ArgumentNullException(nameof(dto.Email));
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Unauthorized("Invalid email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid password");

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email!,
                Token = await _tokenService.CreateToken(user),
                Roles = roles.ToList()
            };
        }
    }
}
