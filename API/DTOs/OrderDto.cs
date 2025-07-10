namespace API.Dtos
{
    public class OrderDto
    {
        public string? Email { get; set; }
        public string? BasketId { get; set; }
        public int DeliveryMethodId { get; set; }
        public AddressDto ShippingAddress { get; set; } = null!;
    }
}
