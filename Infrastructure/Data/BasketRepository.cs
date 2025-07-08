using System.Collections.Concurrent;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private static readonly ConcurrentDictionary<string, Basket> _baskets = new();

        public Task<Basket?> GetBasketAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return Task.FromResult<Basket?>(null);

            _baskets.TryGetValue(id, out var basket);
            return Task.FromResult<Basket?>(basket);
        }

        public Task<Basket?> UpdateBasketAsync(Basket basket)
        {
            if (string.IsNullOrWhiteSpace(basket.Id))
                return Task.FromResult<Basket?>(null); // or throw an exception if you prefer

            _baskets[basket.Id] = basket;
            return Task.FromResult<Basket?>(basket);
        }

        public Task<bool> DeleteBasketAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return Task.FromResult(false);

            return Task.FromResult(_baskets.TryRemove(id, out _));
        }
    }
}
