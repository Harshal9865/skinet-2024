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

            var created = await _database.StringSetAsync(
                basket.Id,
                JsonSerializer.Serialize(basket),
                TimeSpan.FromDays(30)
            );

            return created ? basket : null;
        }

        public async Task<bool> DeleteBasketAsync(string id)
        {
            return await _database.KeyDeleteAsync(id);
        }
    }
}
