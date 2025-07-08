using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/basket")]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _basketRepo;
        private readonly IGenericRepository<Product> _productRepo;

        public BasketController(IBasketRepository basketRepo, IGenericRepository<Product> productRepo)
        {
            _basketRepo = basketRepo;
            _productRepo = productRepo;
        }

        private async Task<Basket> MapBasketDtoToEntityAsync(BasketDto dto)
        {
            var items = new List<BasketItem>();

            foreach (var item in dto.Items)
            {
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product == null) continue;

                items.Add(new BasketItem
                {
                    ProductId = product.Id,
                    Quantity = item.Quantity,
                    ProductName = product.Name,
                    Price = product.Price,
                    PictureUrl = product.PictureUrl,
                    Brand = product.Brand,       // ✅ Updated to string property
                    Type = product.Type          // ✅ Updated to string property
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
            return basket ?? new Basket { Id = id };
        }

        [HttpPost]
        public async Task<ActionResult<Basket>> UpdateBasket(BasketDto basketDto)
        {
            var basket = await MapBasketDtoToEntityAsync(basketDto);
            var updated = await _basketRepo.UpdateBasketAsync(basket);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteBasket(string id)
        {
            var success = await _basketRepo.DeleteBasketAsync(id);
            return success ? Ok() : NotFound();
        }
    }
}
