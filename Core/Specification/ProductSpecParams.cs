using System;
using System.Collections.Generic;
using System.Linq;

namespace Core.Specification
{
    public class ProductSpecParams
    {
        private const int MaxPageSize = 50;

        public int PageIndex { get; set; } = 1;

        private int _pageSize = 6;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        private List<string> _brands = new();
        public List<string> Brands
        {
            get => _brands;
            set
            {
                _brands = value
                    .SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    .Select(x => x.Trim())
                    .ToList();
            }
        }

        private List<string> _types = new();
        public List<string> Types
        {
            get => _types;
            set
            {
                _types = value
                    .SelectMany(x => x.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    .Select(x => x.Trim())
                    .ToList();
            }
        }

        private string? _search;
        public string? Search
        {
            get => _search;
            set => _search = value?.ToLower();
        }

        public string? Sort { get; set; }
    }
}
