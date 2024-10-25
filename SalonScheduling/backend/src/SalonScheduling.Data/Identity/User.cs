using Microsoft.AspNetCore.Identity;
using SalonScheduling.Domain.Entities;

namespace SalonScheduling.Data.Identity
{
    public class User : IdentityUser<Guid>
    {
        public ICollection<Employee>? Employees { get; set; }
        public ICollection<UserRole> UserRoles { get; set; } = [];
        public UserRefreshToken? UserRefreshToken { get; set; }
    }
}
