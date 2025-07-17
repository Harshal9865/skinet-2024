namespace Core.Entities.OrderAggregate
{
    public class Order : BaseEntity
    {
        public Order() 
        {
            Status = OrderStatus.Pending; // ✅ Ensure default for parameterless constructor
        }

        public Order(string buyerEmail, Address shipToAddress, DeliveryMethod deliveryMethod, ICollection<OrderItem> items, decimal subtotal)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = items;
            Subtotal = subtotal;
            OrderDate = DateTime.UtcNow;
            Status = OrderStatus.Pending; // ✅ Set default in parameterized constructor
        }

        public string BuyerEmail { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public Address ShipToAddress { get; set; } = null!;
        public DeliveryMethod DeliveryMethod { get; set; } = null!;
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public decimal Subtotal { get; set; }

        public OrderStatus Status { get; set; } = OrderStatus.Pending; // ✅ Default value

        public decimal GetTotal() => Subtotal + DeliveryMethod.Price;
    }

    public enum OrderStatus
    {
        Pending,
        Processing,
        Shipped,
        Delivered,
        Cancelled
    }
}
