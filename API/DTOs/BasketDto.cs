namespace API.Dtos
{
    public class BasketItemDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }  // ✅ Client controls only this
    }

    public class BasketDto
    {
        public string Id { get; set; } = string.Empty;
        public List<BasketItemDto> Items { get; set; } = new();
    }
}
