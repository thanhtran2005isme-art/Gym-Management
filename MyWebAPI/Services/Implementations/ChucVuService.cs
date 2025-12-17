using Microsoft.EntityFrameworkCore;
using MyWebAPI.Data;
using MyWebAPI.Models.DTO;
using MyWebAPI.Models.Entities;
using MyWebAPI.Services.Interfaces;

namespace MyWebAPI.Services.Implementations
{
    public class ChucVuService : IChucVuService
    {
        private readonly MyDbContext _context;

        public ChucVuService(MyDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ChucVuDto>> GetAllAsync()
        {
            return await _context.ChucVus
                .Select(x => new ChucVuDto
                {
                    MaChucVu = x.MaChucVu,
                    TenChucVu = x.TenChucVu,
                    MoTa = x.MoTa
                })
                .ToListAsync();
        }

        public async Task<ChucVuDto?> GetByIdAsync(int id)
        {
            var entity = await _context.ChucVus.FindAsync(id);
            if (entity == null) return null;

            return new ChucVuDto
            {
                MaChucVu = entity.MaChucVu,
                TenChucVu = entity.TenChucVu,
                MoTa = entity.MoTa
            };
        }

        public async Task<ChucVuDto> CreateAsync(ChucVuDto dto)
        {
            var entity = new ChucVu
            {
                TenChucVu = dto.TenChucVu,
                MoTa = dto.MoTa
            };

            _context.ChucVus.Add(entity);
            await _context.SaveChangesAsync();

            dto.MaChucVu = entity.MaChucVu;
            return dto;
        }

        public async Task<ChucVuDto?> UpdateAsync(int id, ChucVuDto dto)
        {
            var entity = await _context.ChucVus.FindAsync(id);
            if (entity == null) return null;

            entity.TenChucVu = dto.TenChucVu;
            entity.MoTa = dto.MoTa;

            await _context.SaveChangesAsync();

            return new ChucVuDto
            {
                MaChucVu = entity.MaChucVu,
                TenChucVu = entity.TenChucVu,
                MoTa = entity.MoTa
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.ChucVus.FindAsync(id);
            if (entity == null) return false;

            _context.ChucVus.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
