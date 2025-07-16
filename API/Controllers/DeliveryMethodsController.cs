using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveryMethodsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public DeliveryMethodsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            var methods = await _unitOfWork.Repository<DeliveryMethod>().ListAllAsync();
            return Ok(methods);
        }
    }
}
