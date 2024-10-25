using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SalonScheduling.CrossCutting.Helpers
{
    public record JwtConfig(string Secret, string ValidAudience, string ValidIssuer);

    public static class JwtHelper
    {
        public static (string Token, string RefreshToken) GenerateToken(JwtConfig jwtConfig, string username, IList<string> roles)
        {
            var handler = new JwtSecurityTokenHandler();

            var jwtToken = handler.CreateToken(new()
            {
                Subject = GenerateClaims(username, roles),
                Expires = DateTime.UtcNow.AddMinutes(15),
                Issuer = jwtConfig.ValidIssuer,
                Audience = jwtConfig.ValidAudience,
                SigningCredentials = new(
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.Secret)),
                    SecurityAlgorithms.HmacSha256Signature
                ),
            });

            var token = handler.WriteToken(jwtToken);
            var refreshToken = GenerateRefreshToken();

            return (token, refreshToken);
        }

        private static ClaimsIdentity GenerateClaims(string username, IList<string> roles)
        {
            var claims = new ClaimsIdentity([
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(ClaimTypes.Email, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            ]);

            foreach (var role in roles)
                claims.AddClaim(new Claim(ClaimTypes.Role, role));

            return claims;
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
