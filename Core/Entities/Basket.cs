namespace Core.Entities
{
    public class Basket
    {
        public string? Id { get; set; } // Could be user ID or anonymous ID
        public List<BasketItem> Items { get; set; } = new();
    }
}
