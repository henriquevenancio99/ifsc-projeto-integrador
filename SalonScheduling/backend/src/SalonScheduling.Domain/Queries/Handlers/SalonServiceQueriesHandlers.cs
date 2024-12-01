using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Queries.Handlers
{
    public class SalonServiceQueriesHandlers(ISalonServiceRepository salonServiceRepository) : ISalonServiceQueriesHandlers
    {
        public async Task<SalonServiceQuery[]> Handle()
        {
            var result = await salonServiceRepository.GetAllAsNoTracking();

            return result
                ?.Select(salonService => new SalonServiceQuery(
                    salonService.Id,
                    salonService.Name,
                    salonService.Price,
                    salonService.Price?.ToString("C"),
                    salonService.ServiceTypes.ToDictionary(t => t.Key, t => t.Name),
                    salonService.ServiceTime.ToString(),
                    salonService.Description,
                    salonService.CreatedAt,
                    salonService.UpdatedAt
                ))
                .ToArray() ?? [];
        }

        public async Task<SalonServiceQuery?> Handle(Guid id)
        {
            var salonService = await salonServiceRepository.GetById(id);

            return salonService is not null
                ? new(
                    salonService.Id,
                    salonService.Name,
                    salonService.Price,
                    salonService.Price?.ToString("C"),
                    salonService.ServiceTypes.ToDictionary(t => t.Key, t => t.Name),
                    salonService.ServiceTime.ToString(),
                    salonService.Description,
                    salonService.CreatedAt,
                    salonService.UpdatedAt)
                : default;
        }
    }
}
