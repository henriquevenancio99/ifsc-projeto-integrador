namespace SalonScheduling.Data.Identity
{
    public class UserRefreshToken
    {
        public Guid Id { get; set; }
        public required User User { get; set; }
        public Guid UserId { get; set; }
        public required string RefreshToken { get; set; }
        public required DateTimeOffset Expiration { get; set; }

        public bool Validate(string refreshToken)
        {
            return RefreshToken == refreshToken && Expiration < DateTimeOffset.UtcNow;
        }
    }
}
