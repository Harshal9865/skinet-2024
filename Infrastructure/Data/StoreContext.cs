using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Config;
using Core.Entities.OrderAggregate; 

namespace Infrastructure.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions<StoreContext> options) : base(options) { }



public DbSet<Order> Orders { get; set; }
public DbSet<OrderItem> OrderItems { get; set; }
public DbSet<DeliveryMethod> DeliveryMethods { get; set; }


        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProductConfiguration).Assembly);
        }
    }
}
