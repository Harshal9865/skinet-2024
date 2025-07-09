using System;
using System.Collections;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        private readonly StoreContext _context;
        private Hashtable _repositories = new();

        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            var type = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);
                var repoInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);
                if (repoInstance is not IGenericRepository<TEntity> typedRepo)
                {
                    throw new InvalidOperationException($"Could not create repository instance for type {type}");
                }
                _repositories.Add(type, typedRepo);
                return typedRepo;
            }

            return _repositories[type] as IGenericRepository<TEntity>
                ?? throw new InvalidOperationException($"Repository for type {type} is not of expected type.");
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
