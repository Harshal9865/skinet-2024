using Microsoft.AspNetCore.Identity;

namespace Core.Entities.Identity
{
    public class AppUser : IdentityUser
    {
        // Add any custom properties here
        public string DisplayName { get; set; }
    }
}
