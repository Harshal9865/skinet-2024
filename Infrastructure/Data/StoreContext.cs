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

            modelBuilder.Entity<Order>().OwnsOne(o => o.ShipToAddress);

            modelBuilder.Entity<OrderItem>().OwnsOne(oi => oi.ItemOrdered);

            // Configure decimal precision/scale to avoid truncation warnings
            modelBuilder.Entity<DeliveryMethod>()
                .Property(dm => dm.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Order>()
                .Property(o => o.Subtotal)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(oi => oi.Price)
                .HasColumnType("decimal(18,2)");
        }
    }
}
