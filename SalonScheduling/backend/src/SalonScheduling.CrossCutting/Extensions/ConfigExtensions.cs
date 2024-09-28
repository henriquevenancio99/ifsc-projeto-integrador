using Microsoft.Extensions.Configuration;
using SalonScheduling.CrossCutting.Helpers;

namespace SalonScheduling.CrossCutting.Extensions
{
    public static class ConfigExtensions
    {
        public static JwtConfig GetJwtConfig(this IConfiguration configuration) =>
            configuration.GetSection(nameof(JwtConfig)).Get<JwtConfig>()!;
    }
}
