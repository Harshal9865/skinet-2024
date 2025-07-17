using Core.Entities;
using Core.Interfaces;
using StackExchange.Redis;
using System.Text.Json;

namespace Infrastructure.Data
{
    public class BasketRepository : IBasketRepository
    {
        private readonly IDatabase _database;

        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase();
        }

        public async Task<Basket?> GetBasketAsync(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return null;

            var data = await _database.StringGetAsync(id);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<Basket>(data!, options);
        }

        public async Task<Basket?> UpdateBasketAsync(Basket basket)
        {
            if (string.IsNullOrWhiteSpace(basket.Id)) return null;

            // ✅ Set a TTL of 1 day (adjustable)
            var created = await _database.StringSetAsync(
                basket.Id,
                JsonSerializer.Serialize(basket),
                TimeSpan.FromDays(1) // ⏰ TTL: Basket expires after 1 day of inactivity
            );

            return created ? basket : null;
        }

        public async Task<bool> DeleteBasketAsync(string id)
        {
            return await _database.KeyDeleteAsync(id);
        }
    }
}
