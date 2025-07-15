using Core.Entities.Identity;

namespace API.DTOs
{
    public class UserUpdateDto
    {
        public string DisplayName { get; set; } = string.Empty;
        public UserAddress Address { get; set; } = new UserAddress();
    }
}
