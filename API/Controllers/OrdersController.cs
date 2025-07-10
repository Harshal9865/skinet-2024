using API.Dtos;
using API.DTOs;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
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
            if (string.IsNullOrWhiteSpace(orderDto.Email))
                return BadRequest("Email is required.");

            if (string.IsNullOrWhiteSpace(orderDto.BasketId))
                return BadRequest("Basket ID is required.");

            if (orderDto.ShippingAddress == null)
                return BadRequest("Shipping address is required.");

            // 🔁 Map AddressDto to Address (domain)
            var shippingAddress = _mapper.Map<Address>(orderDto.ShippingAddress);

            var order = await _orderService.CreateOrderAsync(
                orderDto.Email,
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
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            var orders = await _orderService.GetOrdersForUserAsync(email);
            var result = _mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders);

            return Ok(result);
        }
    }
}
