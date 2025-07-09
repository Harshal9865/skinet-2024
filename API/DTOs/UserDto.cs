// Core/Entities/DTOs/UserDto.cs
namespace Core.Entities.DTOs
{
  public class UserDto
  {
    public string DisplayName { get; set; }
    public string Token { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; }
  }
}