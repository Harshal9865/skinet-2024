using Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IProductRepository
    {
        Task<IReadOnlyList<Product>> GetProductsAsync(string? brand, string? type, string? sort);
        Task<Product?> GetProductByIdAsync(int id);  // ✅ Renamed correctly
        Task<IReadOnlyList<Product>> GetSellerProductsAsync(string email);  // ✅ NEW
        Task<IReadOnlyList<string>> GetBrandsAsync();
        Task<IReadOnlyList<string>> GetTypesAsync();
        void AddProduct(Product product);
        void UpdateProduct(Product product);
        void DeleteProduct(Product product);
        bool ProductExists(int id);
        Task<bool> SaveChangesAsync();
    }
}
