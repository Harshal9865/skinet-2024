using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateProductDto
{
    [Required(ErrorMessage = "Product name is required.")]
    [MinLength(1, ErrorMessage = "Product name cannot be empty.")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Product description is required.")]
    [MinLength(1, ErrorMessage = "Description cannot be empty.")]
    public string? Description { get; set; }

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Picture URL is required.")]
    [Url(ErrorMessage = "PictureUrl must be a valid URL.")]
    public string? PictureUrl { get; set; }

    [Required(ErrorMessage = "Product type is required.")]
    [MinLength(1, ErrorMessage = "Type cannot be empty.")]
    public string? Type { get; set; }

    [Required(ErrorMessage = "Brand is required.")]
    [MinLength(1, ErrorMessage = "Brand cannot be empty.")]
    public string? Brand { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantity in stock must be at least 1.")]
    public int QuantityInStock { get; set; }
}
