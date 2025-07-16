using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public static class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAndRolesAsync(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (!roleManager.Roles.Any())
            {
                await roleManager.CreateAsync(new IdentityRole("Member"));
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            if (!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Harsh",
                    Email = "harsh@example.com",
                    UserName = "harsh@example.com",
                    Address = new UserAddress
                    {
                        FirstName = "Harsh",
                        LastName = "Sharma",
                        Street = "123 Street",
                        City = "Mumbai",
                        State = "MH",
                        ZipCode = "400001"
                    }
                };

                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");

                var admin = new AppUser
                {
                    DisplayName = "Admin",
                    Email = "admin@example.com",
                    UserName = "admin@example.com",
                    Address = new UserAddress
                    {
                        FirstName = "Admin",
                        LastName = "User",
                        Street = "Admin Lane",
                        City = "Delhi",
                        State = "DL",
                        ZipCode = "110001"
                    }
                };

                await userManager.CreateAsync(admin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(admin, new[] { "Admin", "Member" });
            }
        }
    }
}
