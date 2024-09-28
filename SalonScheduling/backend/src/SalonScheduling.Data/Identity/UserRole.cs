using Microsoft.AspNetCore.Identity;

namespace SalonScheduling.Data.Identity
{
    public class UserRole : IdentityUserRole<Guid>
    {
        public required User User { get; set; }
        public required Role Role { get; set; }
    }
}
