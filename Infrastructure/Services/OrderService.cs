using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Infrastructure.Data.Specifications;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketRepository _basketRepo;

        public OrderService(IUnitOfWork unitOfWork, IBasketRepository basketRepo)
        {
            _unitOfWork = unitOfWork;
            _basketRepo = basketRepo;
        }

        public async Task<Order?> CreateOrderAsync(string buyerEmail, int deliveryMethodId, string basketId, Address shippingAddress)
        {
            Console.WriteLine($"📥 Creating order for {buyerEmail}, basket: {basketId}, delivery method: {deliveryMethodId}");
            Console.WriteLine($"📦 Shipping to: {shippingAddress.Street}, {shippingAddress.City}, {shippingAddress.State}, {shippingAddress.Zipcode}");

            var basket = await _basketRepo.GetBasketAsync(basketId);
            if (basket == null)
            {
                Console.WriteLine("❌ Basket not found.");
                return null;
            }

            if (basket.Items.Count == 0)
            {
                Console.WriteLine("❌ Basket is empty.");
                return null;
            }

            var items = new List<OrderItem>();
Console.WriteLine($"🧺 Basket retrieved. Items count: {basket.Items.Count}");
            foreach (var item in basket.Items)
            {
                var productItem = await _unitOfWork.Repository<Product>().GetByIdAsync(item.ProductId);
                if (productItem == null)
                {
                    Console.WriteLine($"❌ Product not found with ID: {item.ProductId}");
                    return null;
                }

                var itemOrdered = new ProductItemOrdered
                {
                    ProductItemId = productItem.Id,
                    ProductName = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };

                items.Add(new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                });
            }

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            if (deliveryMethod == null)
            {
                Console.WriteLine($"❌ Delivery method not found: ID {deliveryMethodId}");
                return null;
            }

            var subtotal = items.Sum(i => i.Price * i.Quantity);
            var order = new Order(buyerEmail, shippingAddress, deliveryMethod, items, subtotal);

            _unitOfWork.Repository<Order>().Add(order);
            var result = await _unitOfWork.Complete();

            if (result <= 0)
            {
                Console.WriteLine("❌ Failed to save order.");
                return null;
            }

            await _basketRepo.DeleteBasketAsync(basketId);
            Console.WriteLine("✅ Order created and basket cleared.");
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
        }

        public async Task<Order?> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrderWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntityWithSpec(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }

        // ✅ New: Paginated orders
        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail, int pageIndex, int pageSize)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail, pageIndex, pageSize);
            return await _unitOfWork.Repository<Order>().ListAsync(spec);
        }

        // ✅ New: Count orders for pagination
        public async Task<int> CountUserOrdersAsync(string buyerEmail)
        {
            var countSpec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().CountAsync(countSpec);
        }
    }
}
