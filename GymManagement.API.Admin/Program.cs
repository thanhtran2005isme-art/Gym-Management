using GymManagement.DbHelper;
using GymManagement.API.Admin.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbHelper
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddSingleton<IDbHelper>(new SqlServerHelper(connectionString!));

// Services
builder.Services.AddScoped<IChucVuService, ChucVuService>();
builder.Services.AddScoped<IThanhVienService, ThanhVienService>();
builder.Services.AddScoped<IGoiTapService, GoiTapService>();
builder.Services.AddScoped<INhanVienService, NhanVienService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
