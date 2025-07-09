using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<Order?> GetOrderByIdAsync(int id, string buyerEmail); // <- FIXED here
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();
        Task<Order?> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress);
    }
}
