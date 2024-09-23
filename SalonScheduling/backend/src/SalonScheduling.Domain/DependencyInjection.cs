using Microsoft.Extensions.DependencyInjection;
using SalonScheduling.Domain.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;

namespace SalonScheduling.Domain
{
    public static class DependencyInjection
    {
        public static IServiceCollection ConfigureDomain(this IServiceCollection services)
        {
            services.AddCommandsHandlers();

            return services;
        }

        private static IServiceCollection AddCommandsHandlers(this IServiceCollection services)
        {
            services.AddScoped<IEmployeeCommandsHandlers, EmployeeCommandsHandlers>();

            return services;
        }
    }
}
