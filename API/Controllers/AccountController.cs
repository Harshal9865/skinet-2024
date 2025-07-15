using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AutoMapper;
using API.Extensions;
using UserAddress = Core.Entities.Identity.UserAddress;
using API.Dtos;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
{
    var email = dto.Email.ToLower();
    if (await _userManager.Users.AnyAsync(x => x.Email == email))
        return BadRequest(new { errors = new { Email = new[] { "Email already taken" } } });

    var user = new AppUser
    {
        DisplayName = dto.DisplayName,
        Email = email,
        UserName = email,
        AvatarUrl = dto.AvatarUrl
    };

    var result = await _userManager.CreateAsync(user, dto.Password);
    if (!result.Succeeded)
    {
        return BadRequest(new
        {
            errors = result.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray())
        });
    }

    await _userManager.AddToRoleAsync(user, "Member");
    return await CreateUserDto(user);
}


        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto dto)
        {
            var email = dto.Email?.ToLower() ?? throw new ArgumentNullException(nameof(dto.Email));
            var user = await _userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
            if (user == null) return Unauthorized("Invalid email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded) return Unauthorized("Invalid password");

            return await CreateUserDto(user);
        }

        [Authorize]
        [HttpGet("current-user")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null) return Unauthorized("No email claim found");

            var user = await _userManager.Users
                .Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email == email);

            if (user == null) return NotFound("User not found");

            return await CreateUserDto(user);
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<ActionResult<UserDto>> UpdateUserProfile(UserUpdateDto dto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null) return Unauthorized("No email claim found");

            var user = await _userManager.Users.Include(x => x.Address).SingleOrDefaultAsync(x => x.Email == email);
            if (user == null) return NotFound("User not found");

            user.DisplayName = dto.DisplayName;
            user.Address = dto.Address;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest("Failed to update profile");

            return await CreateUserDto(user);
        }

        [Authorize]
        [HttpPut("address")]
        public async Task<ActionResult<UserDto>> UpdateAddress(AddressDto addressDto)
        {
            var user = await _userManager.FindByEmailFromClaimsPrincipal(User);
            if (user == null) return Unauthorized();

            user.Address = _mapper.Map<AddressDto, UserAddress>(addressDto);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest("Failed to update user address");

            var updatedUser = await _userManager.Users
                .Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email == user.Email);

            return await CreateUserDto(updatedUser!);
        }

        private async Task<UserDto> CreateUserDto(AppUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                DisplayName = user.DisplayName,
                Email = user.Email!,
                Token = await _tokenService.CreateToken(user),
                Roles = roles.ToList(),
                AvatarUrl = user.AvatarUrl,
                Address = user.Address
            };
        }
    }
}
