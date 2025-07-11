using Core.Entities.OrderAggregate;

public class UserUpdateDto
{
    public required string DisplayName { get; set; }
    public required Address Address { get; set; }
}
