using API.Middleware;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Identity;
using Infrastructure.Services;
using API.Extensions;
using API.RequestHelpers;
using StackExchange.Redis;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ----------------------------
// Add Services to the Container
// ----------------------------

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithOrigins("https://localhost:4200");
    });
});

// PostgreSQL or SQL Server
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        x => x.MigrationsAssembly("API")
    );
});

builder.Services.AddDbContext<AppIdentityDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("IdentityConnection"));
});

// Identity
builder.Services.AddIdentityCore<AppUser>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppIdentityDbContext>()
.AddSignInManager<SignInManager<AppUser>>();

builder.Services.AddIdentityServices(builder.Configuration);

// Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(c =>
{
    var config = builder.Configuration.GetSection("Redis")["ConnectionString"] ?? "localhost:6379";
    return ConnectionMultiplexer.Connect(config);
});

// Repositories & Services
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IBasketRepository, BasketRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Skinet API", Version = "v1" });

    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "Enter 'Bearer {your token}' below.",
        Reference = new OpenApiReference
        {
            Id = "Bearer",
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// ✅ FIXED LOCALHOST PORT (5051)
builder.WebHost.UseUrls("https://localhost:5051");

var app = builder.Build();

// ----------------------------
// Configure Middleware Pipeline
// ----------------------------

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Skinet API v1");
    });
}

// Apply EF Core migrations and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var storeContext = services.GetRequiredService<StoreContext>();
        await storeContext.Database.MigrateAsync();
        await StoreContextSeed.SeedAsync(storeContext);

        var identityContext = services.GetRequiredService<AppIdentityDbContext>();
        await identityContext.Database.MigrateAsync();

        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        await AppIdentityDbContextSeed.SeedUsersAndRolesAsync(userManager, roleManager);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"🔥 Migration/Seeding Error: {ex.Message}");
        throw;
    }
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();
app.MapGet("/", () => Results.Ok("✅ API is running locally on port 5051"));
app.MapControllers();

app.Run();
