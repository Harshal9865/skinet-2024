using API.Middleware;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Identity;
using API.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Text;
using Infrastructure.Services;
using API.RequestHelpers;

var builder = WebApplication.CreateBuilder(args);

// ----------------------------
// Add Services to the Container
// ----------------------------

builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:4200", "https://localhost:4200");
    });
});

// Store database
builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Identity database
builder.Services.AddDbContext<AppIdentityDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection"));
});

// Repositories & UoW
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IBasketRepository, BasketRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IOrderService, OrderService>(); // ✅ Removed duplicate

// Services
builder.Services.AddScoped<ITokenService, TokenService>();

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);

// Identity Core
builder.Services.AddIdentityCore<AppUser>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppIdentityDbContext>()
.AddSignInManager<SignInManager<AppUser>>();

// JWT Authentication
var tokenKey = builder.Configuration["Token:Key"] 
    ?? throw new ArgumentNullException("Token:Key is missing in configuration.");
var issuer = builder.Configuration["Token:Issuer"] 
    ?? throw new ArgumentNullException("Token:Issuer is missing in configuration.");
var audience = builder.Configuration["Token:Audience"] 
    ?? throw new ArgumentNullException("Token:Audience is missing in configuration.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
            ValidIssuer = issuer,
            ValidAudience = audience,
            ValidateIssuer = true,
            ValidateAudience = true
        };
    });

// Swagger + JWT Auth
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Skinet API", Version = "v1" });

    // Enable JWT in Swagger UI
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
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// Kestrel Port Config
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(5050);
    serverOptions.ListenAnyIP(5051, listenOptions => listenOptions.UseHttps());
});

var app = builder.Build();

// ----------------------------
// Configure Middleware Pipeline
// ----------------------------

// Global exception handler
app.UseMiddleware<ExceptionMiddleware>();

// Swagger (Development only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Skinet API v1");
    });
}

// DB migration and seeding
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var storeContext = services.GetRequiredService<StoreContext>();
        await storeContext.Database.MigrateAsync();

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

// Standard middleware
app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=604800"); // 7 days
    }
});

app.UseCors("CorsPolicy");

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

app.Run();
