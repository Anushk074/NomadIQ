using DiscoveryService.Application.Abstractions;
using DiscoveryService.Application.Services;
using DiscoveryService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<DiscoveryDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DiscoveryDatabase")));

builder.Services.AddScoped<IDestinationService, DestinationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
