using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Data.Identity
{
    public interface IUserRefreshTokenRepository : IBaseRepository<UserRefreshToken>
    {
        Task<UserRefreshToken?> GetByUserId(Guid id);
        Task RecreateRefreshToken(User identityUser, string refreshToken);
    }
}
