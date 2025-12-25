using GymManagement.API.User.Services;

var builder = WebApplication.CreateBuilder(args);

// Connection String cho ADO.NET
var connectionString = builder.Configuration.GetConnectionString("GymDB");
builder.Services.AddSingleton(connectionString!);

// Services
builder.Services.AddScoped<ICheckInService, CheckInService>();
builder.Services.AddScoped<IDangKyGoiTapService, DangKyGoiTapService>();
builder.Services.AddScoped<IGoiTapService, GoiTapService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
