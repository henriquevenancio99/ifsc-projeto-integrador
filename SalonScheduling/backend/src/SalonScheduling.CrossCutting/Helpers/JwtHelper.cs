using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SalonScheduling.CrossCutting.Helpers
{
    public record JwtConfig(string Secret, string ValidAudience, string ValidIssuer);

    public static class JwtHelper
    {
        public const string AdminRoleName = "admin";

        public static string GenerateToken(JwtConfig jwtConfig, string username, IList<string> roles)
        {
            var handler = new JwtSecurityTokenHandler();

            var token = handler.CreateToken(new()
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

            return handler.WriteToken(token);
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
    }
}
