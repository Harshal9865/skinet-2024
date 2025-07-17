using Microsoft.AspNetCore.Http;

namespace API.DTOs
{
    public class ProductUploadDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? Brand { get; set; }
        public string? Type { get; set; }
        public IFormFile Image { get; set; } = null!;
    }
}
