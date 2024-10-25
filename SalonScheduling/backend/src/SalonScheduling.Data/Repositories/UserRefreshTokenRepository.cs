using Microsoft.EntityFrameworkCore;
using SalonScheduling.Data.Identity;

namespace SalonScheduling.Data.Repositories
{
    public class UserRefreshTokenRepository(SalonSchedulingContext context)
        : BaseRepository<UserRefreshToken>(context), IUserRefreshTokenRepository
    {
        public async Task<UserRefreshToken?> GetByUserId(Guid id) =>
            await dbSet.FirstOrDefaultAsync(f => f.UserId == id);

        public async Task RecreateRefreshToken(User identityUser, string refreshToken)
        {
            await Delete(d => d.UserId == identityUser.Id);
            await Create(new()
            {
                RefreshToken = refreshToken,
                User = identityUser,
                Expiration = DateTimeOffset.UtcNow.AddHours(1),
            });

            await Commit();
        }
    }
}
