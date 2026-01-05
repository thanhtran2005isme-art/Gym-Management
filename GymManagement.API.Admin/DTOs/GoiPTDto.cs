namespace GymManagement.API.Admin.DTOs
{
    public class GoiPTDto
    {
        public int MaGoiPT { get; set; }
        public string TenGoiPT { get; set; } = string.Empty;
        public int SoBuoi { get; set; }
        public decimal Gia { get; set; }
        public string? MoTa { get; set; }
        public byte TrangThai { get; set; } = 1;
    }
}
