using API.Dtos;
using API.DTOs;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        [HttpPost]
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder([FromBody] OrderDto orderDto)
        {
            var email = User?.Identity?.Name;
            if (email == null) return Unauthorized("User email not found in token");

            if (string.IsNullOrWhiteSpace(orderDto.BasketId))
                return BadRequest("Basket ID is required.");

            if (orderDto.ShippingAddress == null)
                return BadRequest("Shipping address is required.");

            var shippingAddress = _mapper.Map<Address>(orderDto.ShippingAddress);

            var order = await _orderService.CreateOrderAsync(
                email,
                orderDto.DeliveryMethodId,
                orderDto.BasketId,
                shippingAddress
            );

            if (order == null)
                return BadRequest("Problem creating order");

            var result = _mapper.Map<OrderToReturnDto>(order);
            return Ok(result);
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            var email = User?.Identity?.Name;
            if (string.IsNullOrWhiteSpace(email)) return Unauthorized("Email not found in token");

            var orders = await _orderService.GetOrdersForUserAsync(email);
            var result = _mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders);

            return Ok(result);
        }
    }
}
