using FluentValidation;
using SalonScheduling.CrossCutting.Extensions;
using SalonScheduling.Domain.Commands.SchedulingCommands;

namespace SalonScheduling.Domain.Validators.SchedulingValidator
{
    public class UpdateSchedulingCommandValidator : AbstractValidator<UpdateSchedulingCommand>
    {
        public UpdateSchedulingCommandValidator()
        {
            RuleFor(r => r.ClientId)
                .NotEmpty()
                .WithMessage("O Cliente deve ser informado.");

            RuleFor(r => r.Start)
                .NotEmpty()
                .WithMessage("O Horário inicial deve ser informado.");

            RuleFor(r => r.End)
                .NotEmpty()
                .WithMessage("O Horário final deve ser informado.")
                .Must((scheduling, end) => end.ToDateTimeOffsetUtc() > scheduling.Start.ToDateTimeOffsetUtc())
                .WithMessage("O Horário final do agendamento deve ser maior que Horário inicial.");
        }
    }
}