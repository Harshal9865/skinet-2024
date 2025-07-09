using Core.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Data
{
    public class SpecificationEvaluator<T> where T : BaseEntity
    {
        public static IQueryable<TResult> GetQuery<TResult>(
            IQueryable<T> inputQuery,
            ISpecification<T, TResult> spec)
        {
            var query = ApplyBaseQuery(inputQuery, spec);

            if (spec.Select != null)
            {
                return query.Select(spec.Select);
            }

            throw new InvalidOperationException("No Select projection specified for TResult");
        }

        public static IQueryable<T> GetQuery(
            IQueryable<T> inputQuery,
            ISpecification<T> spec)
        {
            return ApplyBaseQuery(inputQuery, spec);
        }

        // ✅ Shared logic for both overloads
        private static IQueryable<T> ApplyBaseQuery(IQueryable<T> query, ISpecification<T> spec)
        {
            if (spec.Criteria != null)
                query = query.Where(spec.Criteria);

            foreach (var include in spec.Includes)
                query = query.Include(include);

            if (spec.OrderBy != null)
                query = query.OrderBy(spec.OrderBy);

            if (spec.OrderByDescending != null)
                query = query.OrderByDescending(spec.OrderByDescending);

            if (spec.IsDistinct)
                query = query.Distinct();

            if (spec.IsPagingEnabled)
                query = query.Skip(spec.Skip).Take(spec.Take);

            return query;
        }
    }
}
