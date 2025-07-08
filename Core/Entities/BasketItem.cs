namespace Core.Entities
{
    public class BasketItem
    {
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? PictureUrl { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string? Brand { get; set; }
        public string? Type { get; set; }
    }
}
