using Core.Entities.OrderAggregate;

public class UserDto
{
    public string DisplayName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public string AvatarUrl { get; set; } = string.Empty;

    public Address? Address { get; set; }  
}
