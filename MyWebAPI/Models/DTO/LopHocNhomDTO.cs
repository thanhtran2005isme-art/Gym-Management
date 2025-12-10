namespace MyWebAPI.Models.DTO
{
    public class LopHocNhomDto
    {
        public int MaLopHoc { get; set; }
        public string TenLopHoc { get; set; } = null!;
        public string? LoaiLop { get; set; }
        public byte? DoKho { get; set; }
        public string? MoTa { get; set; }
        public byte TrangThai { get; set; }
    }
}
