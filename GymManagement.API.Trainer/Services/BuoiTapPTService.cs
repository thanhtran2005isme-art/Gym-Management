using GymManagement.API.Trainer.DTOs;

namespace GymManagement.API.Trainer.Services
{
    public class BuoiTapPTService : IBuoiTapPTService
    {
        private static List<BuoiTapPTDto> _buoiTaps = new();
        private static int _nextId = 1;

        public async Task<List<BuoiTapPTDto>> GetMyScheduleAsync(int trainerId)
        {
            return await Task.FromResult(_buoiTaps.Where(b => b.TrainerId == trainerId).ToList());
        }

        public async Task<List<BuoiTapPTDto>> GetByDateAsync(int trainerId, DateTime date)
        {
            return await Task.FromResult(_buoiTaps
                .Where(b => b.TrainerId == trainerId && b.NgayTap.Date == date.Date)
                .ToList());
        }

        public async Task<List<BuoiTapPTDto>> GetUpcomingAsync(int trainerId)
        {
            return await Task.FromResult(_buoiTaps
                .Where(b => b.TrainerId == trainerId && b.NgayTap >= DateTime.Now && b.TrangThai != "HoanThanh")
                .OrderBy(b => b.NgayTap)
                .Take(10)
                .ToList());
        }

        public async Task<BuoiTapPTDto?> GetByIdAsync(int id)
        {
            return await Task.FromResult(_buoiTaps.FirstOrDefault(b => b.Id == id));
        }

        public async Task<BuoiTapPTDto> CreateAsync(int trainerId, CreateBuoiTapPTDto dto)
        {
            var buoiTap = new BuoiTapPTDto
            {
                Id = _nextId++,
                LichDayId = dto.LichDayId,
                TrainerId = trainerId,
                TenTrainer = "PT Demo",
                HocVienId = dto.HocVienId,
                TenHocVien = "Học viên Demo",
                NgayTap = dto.NgayTap,
                GioBatDau = dto.GioBatDau,
                GioKetThuc = dto.GioKetThuc,
                DiaDiem = dto.DiaDiem,
                TrangThai = "ChuaBatDau",
                NoiDungBuoiTap = dto.NoiDungBuoiTap,
                BaiTap = dto.BaiTap,
                SoSet = dto.SoSet,
                SoRep = dto.SoRep,
                CanNangSuDung = dto.CanNangSuDung
            };
            _buoiTaps.Add(buoiTap);
            return await Task.FromResult(buoiTap);
        }

        public async Task<BuoiTapPTDto?> UpdateAsync(int id, UpdateBuoiTapPTDto dto)
        {
            var buoiTap = _buoiTaps.FirstOrDefault(b => b.Id == id);
            if (buoiTap == null) return null;

            if (dto.TrangThai != null) buoiTap.TrangThai = dto.TrangThai;
            if (dto.NoiDungBuoiTap != null) buoiTap.NoiDungBuoiTap = dto.NoiDungBuoiTap;
            if (dto.BaiTap != null) buoiTap.BaiTap = dto.BaiTap;
            if (dto.SoSet.HasValue) buoiTap.SoSet = dto.SoSet.Value;
            if (dto.SoRep.HasValue) buoiTap.SoRep = dto.SoRep.Value;
            if (dto.CanNangSuDung.HasValue) buoiTap.CanNangSuDung = dto.CanNangSuDung;
            if (dto.DanhGiaTrainer != null) buoiTap.DanhGiaTrainer = dto.DanhGiaTrainer;
            if (dto.GhiChuHocVien != null) buoiTap.GhiChuHocVien = dto.GhiChuHocVien;

            return await Task.FromResult(buoiTap);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var buoiTap = _buoiTaps.FirstOrDefault(b => b.Id == id);
            if (buoiTap == null) return false;
            
            buoiTap.TrangThai = "HuyBo";
            return await Task.FromResult(true);
        }

        public async Task<BuoiTapPTDto?> CompleteAsync(int id)
        {
            var buoiTap = _buoiTaps.FirstOrDefault(b => b.Id == id);
            if (buoiTap == null) return null;

            buoiTap.TrangThai = "HoanThanh";
            buoiTap.ThoiGianCheckOut = DateTime.Now;
            return await Task.FromResult(buoiTap);
        }

        public async Task<List<BuoiTapPTDto>> GetHistoryAsync(int trainerId, DateTime from, DateTime to)
        {
            return await Task.FromResult(_buoiTaps
                .Where(b => b.TrainerId == trainerId && b.NgayTap >= from && b.NgayTap <= to)
                .OrderByDescending(b => b.NgayTap)
                .ToList());
        }
    }
}
