using SalonScheduling.CrossCutting.Helpers;
using SalonScheduling.Domain.Dtos.Role;
using SalonScheduling.Domain.Dtos.User;

namespace SalonScheduling.Domain.Interfaces
{
    public interface IIdentityManager : IValidatorHelper
    {
        Task<UserRequestResponseDto[]> GetAllUsersWithRolesAsNoTracking();
        Task<string?> Login(LoginDto user);
        Task<Guid> CreateUser(UserDto user);
        Task<UserDto?> CreateAdminUser();
        Task<bool> DeleteUser(Guid id);
        Task<bool> AssignRoles(Guid id, RoleDto requestBody);
        Task<bool> ExistsByUsername(string username);
    }
}
