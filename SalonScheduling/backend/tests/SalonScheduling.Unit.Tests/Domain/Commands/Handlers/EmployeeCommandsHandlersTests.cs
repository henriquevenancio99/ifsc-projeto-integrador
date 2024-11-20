using AutoFixture;
using FluentAssertions;
using FluentValidation.Results;
using Moq;
using SalonScheduling.Domain.Commands.EmployeeCommands;
using SalonScheduling.Domain.Commands.Handlers;
using SalonScheduling.Domain.Interfaces;
using SalonScheduling.Domain.Interfaces.Repositories;

namespace SalonScheduling.Unit.Tests.Domain.Commands.Handlers
{
    public class EmployeeCommandsHandlersTests
    {
        private readonly Mock<IEmployeeRepository> employeeRepositoryMock;
        private readonly Mock<IIdentityManager> identityManagerMock;
        private readonly Mock<EmployeeCommandsHandlers> handlerMock;
        private readonly Fixture fixture;

        public EmployeeCommandsHandlersTests()
        {
            fixture = new Fixture();
            employeeRepositoryMock = new Mock<IEmployeeRepository>();
            identityManagerMock = new Mock<IIdentityManager>();
            handlerMock = new Mock<EmployeeCommandsHandlers>(employeeRepositoryMock.Object, identityManagerMock.Object)
            {
                CallBase = true
            };
        }

        [Fact]
        public async Task Handle_Dado_ComandoInvalido_NaoDeveChamar_Commit_E_Handler_DeveConter_ValidationFailures()
        {
            // Arrange
            var command = fixture.Create<CreateEmployeeCommand>();

            List<ValidationFailure> expectedValidationFailures = [new("prop", "error")];

            handlerMock
                .Setup(s => s.Validate(It.IsAny<CreateEmployeeCommand>()))
                .ReturnsAsync((false, expectedValidationFailures));

            // Act
            await handlerMock.Object.Handle(command);

            // Assert
            employeeRepositoryMock.Verify(v => v.Commit(), Times.Never);
            handlerMock.Object.HasValidationFailures.Should().BeTrue();
            handlerMock.Object.ValidationFailures.Should().BeEquivalentTo(expectedValidationFailures);
        }

        [Fact]
        public async Task Handle_Dado_ComandoValido_DeveChamar_Commit_E_Handler_NaoDeveConter_ValidationFailures()
        {
            // Arrange
            var command = fixture.Create<CreateEmployeeCommand>();

            handlerMock
                .Setup(s => s.Validate(It.IsAny<CreateEmployeeCommand>()))
                .ReturnsAsync((true, []));

            handlerMock
                .Setup(s => s.CreateEmployeeUser(It.IsAny<CreateEmployeeCommand>()))
                .ReturnsAsync(true);

            // Act
            var result = await handlerMock.Object.Handle(command);

            // Assert
            employeeRepositoryMock.Verify(v => v.Commit(), Times.Once);
            handlerMock.Object.HasValidationFailures.Should().BeFalse();
        }

        [Fact]
        public async Task Handle_Quando_CreateEmployeeUser_RetornarFalse_NaoDeveChamar_Commit()
        {
            // Arrange
            var command = fixture.Create<CreateEmployeeCommand>();

            handlerMock
                .Setup(s => s.Validate(It.IsAny<CreateEmployeeCommand>()))
                .ReturnsAsync((true, []));

            handlerMock
                .Setup(s => s.CreateEmployeeUser(It.IsAny<CreateEmployeeCommand>()))
                .ReturnsAsync(false);

            // Act
            var result = await handlerMock.Object.Handle(command);

            // Assert
            employeeRepositoryMock.Verify(v => v.Commit(), Times.Never);
        }
    }
}