using AutoMapper;
using Core.Entities.OrderAggregate;
using API.DTOs;
using API.Dtos;
using Core.Entities.Identity;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Order → OrderToReturnDto
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(dest => dest.DeliveryMethod, opt => opt.MapFrom(src => src.DeliveryMethod.ShortName))
                .ForMember(dest => dest.ShippingPrice, opt => opt.MapFrom(src => src.DeliveryMethod.Price))
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.GetTotal()))
                .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

            // OrderItem → OrderItemDto
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ItemOrdered!.ProductItemId))
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ItemOrdered!.ProductName))
                .ForMember(dest => dest.PictureUrl, opt => opt.MapFrom(src => src.ItemOrdered!.PictureUrl));

            // Address mapping
            CreateMap<AddressDto, Address>();
            CreateMap<UserAddress, AddressDto>().ReverseMap();
        }
    }
}
