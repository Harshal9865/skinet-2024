using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public string AvatarUrl { get; set; } = string.Empty;

        public UserAddress Address { get; set; } = new UserAddress();
    }
}
