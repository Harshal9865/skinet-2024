using API.Dtos;
using API.DTOs;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        // ✅ Create Order
        [HttpPost]
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder([FromBody] OrderDto orderDto)
        {
            try
            {
                Console.WriteLine("📦 Creating order");
                var email = User.RetrieveEmailFromPrincipal();
                if (string.IsNullOrWhiteSpace(email))
                    return Unauthorized("❌ User email not found in token.");

                if (string.IsNullOrWhiteSpace(orderDto.BasketId))
                    return BadRequest("❌ Basket ID is required.");

                if (orderDto.ShippingAddress == null)
                    return BadRequest("❌ Shipping address is required.");

                var shippingAddress = _mapper.Map<Address>(orderDto.ShippingAddress);
                if (shippingAddress == null)
                    return BadRequest("❌ Failed to map shipping address.");

                var order = await _orderService.CreateOrderAsync(
                    email,
                    orderDto.DeliveryMethodId,
                    orderDto.BasketId,
                    shippingAddress
                );

                if (order == null)
                    return BadRequest("❌ Problem creating order. Check basket ID or delivery method.");

                var result = _mapper.Map<OrderToReturnDto>(order);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"🔥 Internal Server Error: {ex.Message}");
            }
        }

        // ✅ GET: Non-paginated - returns flat list of orders
        [HttpGet]
        public async Task<ActionResult<List<OrderToReturnDto>>> GetOrdersForUser()
        {
            var email = User.RetrieveEmailFromPrincipal();
            if (string.IsNullOrWhiteSpace(email))
                return Unauthorized("❌ Email not found in token.");

            var orders = await _orderService.GetOrdersForUserAsync(email);
            var result = _mapper.Map<IReadOnlyList<Order>, List<OrderToReturnDto>>(orders);

            return Ok(result);
        }

        // ✅ GET: Paginated - optional endpoint (you can rename route to avoid conflict)
        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetOrdersPaged([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 6)
        {
            var email = User.RetrieveEmailFromPrincipal();
            if (string.IsNullOrWhiteSpace(email))
                return Unauthorized("❌ Email not found in token.");

            var orders = await _orderService.GetOrdersForUserAsync(email, pageIndex, pageSize);
            var totalCount = await _orderService.CountUserOrdersAsync(email);

            var result = _mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders);

            return Ok(new
            {
                data = result,
                totalCount,
                pageIndex,
                pageSize
            });
        }
    }
}
