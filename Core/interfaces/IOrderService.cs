using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order?> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress);

        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();

        Task<Order?> GetOrderByIdAsync(int id, string buyerEmail);

        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);

        // ✅ Pagination support
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail, int pageIndex, int pageSize);
        Task<int> CountUserOrdersAsync(string buyerEmail);
    }
}
