using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string? RetrieveEmailFromPrincipal(this ClaimsPrincipal user)
        {
            // Use ClaimTypes.Name instead of ClaimTypes.Email based on your JWT
            return user?.FindFirstValue(ClaimTypes.Name);
        }
    }
}
