using Microsoft.EntityFrameworkCore;
using BlogPlatform.Models;
namespace BlogPlatform.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {

        }

        public DbSet<ExpenseModels> Expenses { get; set; }
        public DbSet<IncomeModels> Incomes { get; set; }
    }

}
