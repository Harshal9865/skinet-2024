using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class OrderDto
    {
        public string? BasketId { get; set; }
        public int DeliveryMethodId { get; set; }
        public Address? ShippingAddress { get; set; }
    }
}
