using API.Dtos;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Unauthorized("User email not found.");

            if (string.IsNullOrEmpty(orderDto.BasketId))
                return BadRequest("Basket ID is required.");

            if (orderDto.ShippingAddress == null)
                return BadRequest("Shipping address is required.");

            var order = await _orderService.CreateOrderAsync(
                email,
                orderDto.DeliveryMethodId,
                orderDto.BasketId,
                orderDto.ShippingAddress
            );

            if (order == null) return BadRequest("Problem creating order");

            return Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Order>>> GetOrdersForUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Unauthorized("User email not found.");

            return Ok(await _orderService.GetOrdersForUserAsync(email));
        }
    }
}
