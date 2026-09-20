using DiscoveryService.Application.Abstractions;
using DiscoveryService.Application.Services;
using DiscoveryService.Infrastructure.Configuration;
using DiscoveryService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Allows the React frontend (a different origin) to call this API from the browser.
// Allowed origins are configuration-driven (see appsettings.Development.json) so
// production origins can be set per environment without a code change.
const string FrontendCorsPolicy = "Frontend";

var corsSettings = builder.Configuration.GetSection(CorsSettings.SectionName).Get<CorsSettings>() ?? new CorsSettings();

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
        policy.WithOrigins(corsSettings.AllowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

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

app.UseCors(FrontendCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
