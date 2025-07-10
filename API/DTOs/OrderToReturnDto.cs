using System;
using System.Collections.Generic;

namespace API.DTOs
{
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public string DeliveryMethod { get; set; } = string.Empty;
        public decimal ShippingPrice { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string PictureUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
