using Microsoft.AspNetCore.Identity;

namespace SalonScheduling.Data.Identity
{
    public class Role : IdentityRole<Guid>
    {
        public Role() { }
        public Role(string roleName) : base(roleName) { }

        public ICollection<UserRole> UserRoles { get; set; } = [];
    }
}
