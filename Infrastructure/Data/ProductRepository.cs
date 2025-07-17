using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly StoreContext _context;

        public ProductRepository(StoreContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public void AddProduct(Product product)
        {
            _context.Products.Add(product);
        }

        public void DeleteProduct(Product product)
        {
            _context.Products.Remove(product);
        }

        public void UpdateProduct(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
        }

        public bool ProductExists(int id)
        {
            return _context.Products.Any(x => x.Id == id);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
        }

        public async Task<IReadOnlyList<string>> GetBrandsAsync()
        {
            return await _context.Products
                .Select(x => x.Brand)
                .Distinct()
                .ToListAsync()
                .ConfigureAwait(false);
        }

        public async Task<IReadOnlyList<string>> GetTypesAsync()
        {
            return await _context.Products
                .Select(x => x.Type)
                .Distinct()
                .ToListAsync()
                .ConfigureAwait(false);
        }

        public async Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type, string? sort)
        {
            var query = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(brand))
                query = query.Where(x => x.Brand == brand);

            if (!string.IsNullOrWhiteSpace(type))
                query = query.Where(x => x.Type == type);

            query = sort?.ToLowerInvariant() switch
            {
                "priceasc" => query.OrderBy(x => x.Price),
                "pricedesc" => query.OrderByDescending(x => x.Price),
                _ => query.OrderBy(x => x.Name)
            };

            return await query.ToListAsync().ConfigureAwait(false);
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id)
                .ConfigureAwait(false);
        }

        public async Task<IReadOnlyList<Product>> GetSellerProductsAsync(string email)
        {
            return await _context.Products
                .Where(p => p.SellerEmail == email)
                .OrderByDescending(p => p.Id)
                .ToListAsync()
                .ConfigureAwait(false);
        }
    }
}
