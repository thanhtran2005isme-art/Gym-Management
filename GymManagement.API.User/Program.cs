using GymManagement.DbHelper;
using GymManagement.API.User.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddSingleton<IDbHelper>(new SqlServerHelper(connectionString!));

// Đăng ký Services
builder.Services.AddScoped<DatLichPTService>();
builder.Services.AddScoped<LopHocNhomService>();
builder.Services.AddScoped<ThongTinCaNhanService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
