using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public class HopDongPTService : IHopDongPTService
    {
        // TODO: Inject DbContext khi có database
        
        public async Task<List<HopDongPTDto>> GetMyContractsAsync(int trainerId)
        {
            // TODO: Query từ database
            // Giả lập dữ liệu
            return new List<HopDongPTDto>
            {
                new HopDongPTDto
                {
                    Id = 1,
                    MaHopDong = "HD001",
                    TrainerId = trainerId,
                    TenTrainer = "Nguyễn Văn A",
                    MaThanhVien = 1,
                    TenThanhVien = "Trần Văn B",
                    SoDienThoai = "0901234567",
                    GoiPTId = 1,
                    TenGoiPT = "Gói PT 10 buổi",
                    TongSoBuoi = 10,
                    SoBuoiDaSuDung = 3,
                    SoBuoiConLai = 7,
                    NgayBatDau = DateTime.Now.AddDays(-30),
                    NgayKetThuc = DateTime.Now.AddDays(60),
                    GiaTriHopDong = 5000000,
                    TrangThai = "Active",
                    NgayTao = DateTime.Now.AddDays(-30),
                    GhiChu = ""
                }
            };
        }

        public async Task<HopDongPTDto?> GetByIdAsync(int id)
        {
            var contracts = await GetMyContractsAsync(1);
            return contracts.FirstOrDefault(c => c.Id == id);
        }

        public async Task<List<HopDongPTDto>> GetActiveContractsAsync(int trainerId)
        {
            var contracts = await GetMyContractsAsync(trainerId);
            return contracts.Where(c => c.TrangThai == "Active").ToList();
        }

        public async Task<List<HopDongPTDto>> GetByMemberAsync(int maThanhVien)
        {
            var contracts = await GetMyContractsAsync(1);
            return contracts.Where(c => c.MaThanhVien == maThanhVien).ToList();
        }

        public async Task<List<HopDongPTDto>> GetExpiringContractsAsync(int trainerId, int days)
        {
            var contracts = await GetMyContractsAsync(trainerId);
            var expiryDate = DateTime.Now.AddDays(days);
            return contracts.Where(c => c.NgayKetThuc <= expiryDate && c.TrangThai == "Active").ToList();
        }
    }
}
