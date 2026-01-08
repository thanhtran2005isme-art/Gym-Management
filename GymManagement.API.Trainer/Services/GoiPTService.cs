using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public class GoiPTService : IGoiPTService
    {
        private static readonly List<GoiPTDto> _goiPTs = new()
        {
            new GoiPTDto
            {
                Id = 1,
                MaGoi = "GPT001",
                TenGoi = "Gói PT 10 buổi",
                MoTa = "Gói tập với PT 10 buổi, phù hợp cho người mới",
                SoBuoi = 10,
                ThoiHan = 60,
                Gia = 5000000,
                GiaKhuyenMai = 4500000,
                IsActive = true,
                LoaiGoi = "CoBan",
                NgayTao = DateTime.Now.AddMonths(-6)
            },
            new GoiPTDto
            {
                Id = 2,
                MaGoi = "GPT002",
                TenGoi = "Gói PT 20 buổi",
                MoTa = "Gói tập với PT 20 buổi, tiết kiệm hơn",
                SoBuoi = 20,
                ThoiHan = 90,
                Gia = 9000000,
                GiaKhuyenMai = 8000000,
                IsActive = true,
                LoaiGoi = "NangCao",
                NgayTao = DateTime.Now.AddMonths(-6)
            },
            new GoiPTDto
            {
                Id = 3,
                MaGoi = "GPT003",
                TenGoi = "Gói PT VIP 30 buổi",
                MoTa = "Gói VIP với PT 30 buổi, ưu đãi đặc biệt",
                SoBuoi = 30,
                ThoiHan = 120,
                Gia = 12000000,
                GiaKhuyenMai = 10000000,
                IsActive = true,
                LoaiGoi = "VIP",
                NgayTao = DateTime.Now.AddMonths(-6)
            }
        };

        public async Task<List<GoiPTDto>> GetAllAsync()
        {
            return await Task.FromResult(_goiPTs);
        }

        public async Task<GoiPTDto?> GetByIdAsync(int id)
        {
            return await Task.FromResult(_goiPTs.FirstOrDefault(g => g.Id == id));
        }

        public async Task<List<GoiPTDto>> GetActiveAsync()
        {
            return await Task.FromResult(_goiPTs.Where(g => g.IsActive).ToList());
        }
    }
}
