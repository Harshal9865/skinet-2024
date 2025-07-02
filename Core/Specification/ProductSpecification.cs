using Core.Entities;
using Core.Specification;

namespace Core.Specifications
{
    public class ProductSpecification : BaseSpecification<Product>
    {
        public ProductSpecification(ProductSpecParams specParams)
            : base(x =>
                (string.IsNullOrEmpty(specParams.Search) || x.Name.ToLower().Contains(specParams.Search)) &&
                (specParams.Brands.Count == 0 || specParams.Brands.Contains(x.Brand)) &&
                (specParams.Types.Count == 0 || specParams.Types.Contains(x.Type))
            )
        {
            ApplyPaging(specParams.PageSize * (specParams.PageIndex - 1), specParams.PageSize);

            switch (specParams.Sort?.ToLower())
{
    case "priceasc":
        AddOrderBy(x => x.Price);
        break;
    case "pricedesc":
        AddOrderByDescending(x => x.Price);
        break;
    case "namedesc":
    case "alphadesc":
        AddOrderByDescending(x => x.Name.ToLower());
        break;
    default:
        AddOrderBy(x => x.Name.ToLower());
        break;
}

        }
    }
}
