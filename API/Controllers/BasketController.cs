using API.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [ApiController]
    [Route("api/basket")]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IGenericRepository<Product> _productRepo;
        private readonly ILogger<BasketController> _logger;

        public BasketController(
            IBasketRepository basketRepo,
            IGenericRepository<Product> productRepo,
            ILogger<BasketController> logger)
        {
            _basketRepo = basketRepo;
            _productRepo = productRepo;
            _logger = logger;
        }

        private async Task<Basket> MapBasketDtoToEntityAsync(BasketDto dto)
        {
            var items = new List<BasketItem>();

            foreach (var item in dto.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product == null)
                {
                    _logger.LogWarning("⚠️ Product not found. ProductId: {ProductId}", item.ProductId);
                    continue;
                }

                items.Add(new BasketItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    ProductName = product.Name,
                    Price = product.Price,
                    PictureUrl = product.PictureUrl,
                    Brand = product.Brand,
                    Type = product.Type
                });
            }

            return new Basket
            {
                Id = dto.Id,
                Items = items
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Basket>> GetBasket(string id)
        {
            var basket = await _basketRepo.GetBasketAsync(id);

            if (basket == null)
            {
                _logger.LogInformation("🧺 No existing basket found for ID: {BasketId}. Returning empty basket.", id);
                return new Basket { Id = id };
            }

            _logger.LogInformation("✅ Basket retrieved successfully. BasketId: {BasketId}", id);
            return Ok(basket);
        }

        [HttpPost]
        public async Task<ActionResult<Basket>> UpdateBasket(BasketDto basketDto)
        {
            try
            {
                var basket = await MapBasketDtoToEntityAsync(basketDto);

                if (!basket.Items.Any())
                {
                    _logger.LogWarning("🚫 Basket has no valid items. BasketId: {BasketId}", basketDto.Id);
                    return BadRequest("Basket contains no valid products.");
                }

                var updated = await _basketRepo.UpdateBasketAsync(basket);

                if (updated == null)
                {
                    _logger.LogError("❌ Failed to save basket to Redis. BasketId: {BasketId}", basketDto.Id);
                    return StatusCode(500, "Failed to update basket");
                }

                _logger.LogInformation("📝 Basket updated successfully. BasketId: {BasketId}", basketDto.Id);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Exception during basket update. BasketId: {BasketId}", basketDto.Id);
                return StatusCode(500, "An error occurred while updating the basket.");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBasket(string id)
        {
            var success = await _basketRepo.DeleteBasketAsync(id);

            if (success)
            {
                _logger.LogInformation("🗑️ Basket deleted successfully. BasketId: {BasketId}", id);
                return Ok();
            }

            // ✅ Enhanced logging with source context
            _logger.LogWarning("⚠️ Attempted to delete non-existent basket. BasketId: {BasketId} (from {Source})", id, "DeleteBasket endpoint");
            return Ok();
        }
    }
}
