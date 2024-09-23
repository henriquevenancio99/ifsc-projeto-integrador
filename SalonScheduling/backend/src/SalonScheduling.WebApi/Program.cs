using SalonScheduling.Data;
using SalonScheduling.Domain;
using SalonScheduling.WebApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .ConfigureWebApi(builder.Configuration)
    .ConfigureData(builder.Configuration)
    .ConfigureDomain();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthorization();
app.UseHealthChecks("/health");

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
