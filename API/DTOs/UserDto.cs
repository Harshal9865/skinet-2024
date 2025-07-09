namespace API.DTOs
{
    public class UserDto
    {
        public string DisplayName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new();
    }
}
