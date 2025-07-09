namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order() {}

        public Order(string buyerEmail, Address shipToAddress, DeliveryMethod deliveryMethod, ICollection<OrderItem> items, decimal subtotal)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = items;
            Subtotal = subtotal;
        }

        public string BuyerEmail { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public Address ShipToAddress { get; set; } = null!;
        public DeliveryMethod DeliveryMethod { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public decimal Subtotal { get; set; }

        public decimal GetTotal() => Subtotal + DeliveryMethod.Price;
    }
}
