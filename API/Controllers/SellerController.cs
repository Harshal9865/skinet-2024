using API.DTOs;
using Core.Entities;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class SellerController : BaseApiController
    {
        private readonly IWebHostEnvironment _env;
        private readonly IProductRepository _productRepo;
        private readonly StoreContext _context;

        public SellerController(IWebHostEnvironment env, IProductRepository productRepo, StoreContext context)
        {
            _env = env;
            _productRepo = productRepo;
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<Product>> UploadProduct([FromForm] ProductUploadDto dto)
        {
            var sellerEmail = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(sellerEmail)) return Unauthorized("Email not found");

            var file = dto.Image;
            if (file == null || file.Length == 0) return BadRequest("Image is required");

            var uploadsFolder = Path.Combine(_env.WebRootPath, "images", "products");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var uniqueFileName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var product = new Product
{
    Name = dto.Name,
    Description = dto.Description ?? string.Empty,
    Price = dto.Price,
    Brand = dto.Brand ?? string.Empty,
    Type = dto.Type ?? string.Empty,
    PictureUrl = $"/images/products/{uniqueFileName}",
    SellerEmail = sellerEmail
};


            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetSellerProducts()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var products = await _productRepo.GetSellerProductsAsync(email);
            return Ok(products);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var product = await _productRepo.GetProductByIdAsync(id);


            if (product == null) return NotFound();
            if (product.SellerEmail != email) return Forbid();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
