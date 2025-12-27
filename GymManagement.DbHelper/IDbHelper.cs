using System.Data;

namespace GymManagement.DbHelper
{
    public interface IDbHelper
    {
        Task<DataTable> ExecuteQueryAsync(string query, Dictionary<string, object>? parameters = null);
        Task<object?> ExecuteScalarAsync(string query, Dictionary<string, object>? parameters = null);
        Task<int> ExecuteNonQueryAsync(string query, Dictionary<string, object>? parameters = null);
    }
}
