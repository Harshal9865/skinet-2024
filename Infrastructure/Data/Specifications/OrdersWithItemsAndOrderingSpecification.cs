using Core.Entities.OrderAggregate;
using Core.Specifications;

namespace Infrastructure.Data.Specifications
{
    public class OrdersWithItemsAndOrderingSpecification : BaseSpecification<Order>
    {
        // For fetching all orders by user
        public OrdersWithItemsAndOrderingSpecification(string email)
            : base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        // For paginated query
        public OrdersWithItemsAndOrderingSpecification(string email, int pageIndex, int pageSize)
            : base(o => o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
            ApplyPaging(pageIndex * pageSize, pageSize); // 0-based index
        }

        // For count-only queries
        public OrdersWithItemsAndOrderingSpecification(string email, bool forCountOnly)
            : base(o => o.BuyerEmail == email)
        {
            if (!forCountOnly)
            {
                AddInclude(o => o.OrderItems);
                AddInclude(o => o.DeliveryMethod);
                AddOrderByDescending(o => o.OrderDate);
            }
        }
    }
}
