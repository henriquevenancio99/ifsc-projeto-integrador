using Microsoft.Extensions.DependencyInjection;
using SalonScheduling.Domain.Commands.Handlers;
using SalonScheduling.Domain.Interfaces.CommandsHandlers;
using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Queries.Handlers;

namespace SalonScheduling.Domain
{
    public static class DependencyInjection
    {
        public static IServiceCollection ConfigureDomain(this IServiceCollection services)
        {
            services
                .AddCommandsHandlers()
                .AddQueriesHandlers();

            return services;
        }

        private static IServiceCollection AddCommandsHandlers(this IServiceCollection services)
        {
            services.AddScoped<IEmployeeCommandsHandlers, EmployeeCommandsHandlers>();
            services.AddScoped<IClientCommandsHandlers, ClientCommandsHandlers>();
            services.AddScoped<IUserCommandsHandlers, UserCommandsHandlers>();
            services.AddScoped<ISalonServiceCommandsHandlers, SalonServiceCommandsHandlers>();
            services.AddScoped<ISchedulingCommandsHandlers, SchedulingCommandsHandlers>();

            return services;
        }
        
        private static IServiceCollection AddQueriesHandlers(this IServiceCollection services)
        {
            services.AddScoped<IEmployeeQueriesHandlers, EmployeeQueriesHandlers>();
            services.AddScoped<IClientQueriesHandlers, ClientQueriesHandlers>();
            services.AddScoped<ISalonServiceQueriesHandlers, SalonServiceQueriesHandlers>();
            services.AddScoped<ISalonServiceTypeQueriesHandlers, SalonServiceTypeQueriesHandlers>();
            services.AddScoped<ISchedulingQueriesHandlers, SchedulingQueriesHandlers>();

            return services;
        }
    }
}
