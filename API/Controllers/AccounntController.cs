using Core.Entities;
using Core.Entities.DTOs;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
      // 🧠 Ensure email is lowercase and not null
      var email = dto.Email?.ToLower();
      if (string.IsNullOrEmpty(email)) return BadRequest("Email is required");

      // ❌ If email is taken
      if (await _userManager.Users.AnyAsync(x => x.Email == email))
        return BadRequest("Email is already taken");

      var user = new AppUser
      {
        DisplayName = dto.DisplayName,
        Email = email,
        UserName = email.Split('@')[0]
      };

      var result = await _userManager.CreateAsync(user, dto.Password);
      if (!result.Succeeded) return BadRequest(result.Errors);

      await _userManager.AddToRoleAsync(user, "Member");

      var token = await _tokenService.CreateToken(user);

      return new UserDto
      {
        DisplayName = user.DisplayName,
        Email = user.Email!,
        Token = token,
        Roles = new List<string> { "Member" }
      };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto dto)
    {
      var email = dto.Email?.ToLower();
      if (string.IsNullOrEmpty(email)) return BadRequest("Email is required");

      var user = await _userManager.FindByEmailAsync(email);
      if (user == null) return Unauthorized("Invalid email");

      var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
      if (!result.Succeeded) return Unauthorized("Invalid password");

      var token = await _tokenService.CreateToken(user);
      var roles = await _userManager.GetRolesAsync(user);

      return new UserDto
      {
        DisplayName = user.DisplayName,
        Email = user.Email!,
        Token = token,
        Roles = roles.ToList()
      };
    }
  }
}
