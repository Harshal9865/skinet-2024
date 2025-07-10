using API.Dtos;
using API.DTOs;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrdersController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(OrderDto orderDto)
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

            return Ok(_mapper.Map<Order, OrderToReturnDto>(order));
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrdersForUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrEmpty(email)) return Unauthorized("User email not found.");

            var orders = await _orderService.GetOrdersForUserAsync(email);
            var mappedOrders = _mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders);

            return Ok(mappedOrders);
        }
    }
}
