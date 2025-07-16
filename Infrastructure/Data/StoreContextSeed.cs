using System.Text.Json;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context)
        {
            // 🔸 Seed Products
            if (!context.Products.Any())
            {
                var productsData = await File.ReadAllTextAsync("../Infrastructure/Data/SeedData/products.json");
                var products = JsonSerializer.Deserialize<List<Product>>(productsData);

                if (products != null)
                {
                    context.Products.AddRange(products);
                }
            }

            // 🔸 Seed Delivery Methods
            if (!context.DeliveryMethods.Any())
            {
                var deliveryMethods = new List<DeliveryMethod>
                {
                    new DeliveryMethod { ShortName = "Fast", Description = "Fast Delivery (1-2 days)", Price = 100, DeliveryTime = "1-2 days" },
                    new DeliveryMethod { ShortName = "Normal", Description = "Standard Delivery (3-5 days)", Price = 50, DeliveryTime = "3-5 days" },
                    new DeliveryMethod { ShortName = "Slow", Description = "Economy Delivery (5-7 days)", Price = 25, DeliveryTime = "5-7 days" }
                };

                context.DeliveryMethods.AddRange(deliveryMethods);
            }

            // 🔸 Save changes if any
            if (context.ChangeTracker.HasChanges())
            {
                await context.SaveChangesAsync();
            }
        }
    }
}
