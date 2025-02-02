using SalonScheduling.CrossCutting.Extensions;
using SalonScheduling.Domain.Interfaces.QueriesHandlers;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Domain.Queries.Handlers
{
    public class SchedulingQueriesHandlers(ISchedulingRepository schedulingRepository) : ISchedulingQueriesHandlers
    {
        public async Task<SchedulingQuery[]> Handle()
        {
            var result = await schedulingRepository.GetAllWithIncludesAsNoTracking();

            return result
                ?.Select(scheduling => new SchedulingQuery(
                    scheduling.Id,
                    scheduling.Client!.Id,
                    scheduling.Employees!.Select(s => s.Id).ToArray(),
                    scheduling.SalonServices!.Select(s => s.Id).ToArray(),
                    scheduling.Start.FromUtcToString(),
                    scheduling.End.FromUtcToString()
                ))
                .ToArray() ?? [];
        }

        public async Task<SchedulingQuery?> Handle(Guid id)
        {
            var scheduling = await schedulingRepository.GetByIdWithIncludes(id);

            return scheduling is not null
                ? new(
                    scheduling.Id,
                    scheduling.Client!.Id,
                    scheduling.Employees!.Select(s => s.Id).ToArray(),
                    scheduling.SalonServices!.Select(s => s.Id).ToArray(),
                    scheduling.Start.FromUtcToString(),
                    scheduling.End.FromUtcToString())
                : default;
        }
    }
}
