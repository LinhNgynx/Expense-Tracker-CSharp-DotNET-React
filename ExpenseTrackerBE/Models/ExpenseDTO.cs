namespace BlogPlatform.Models
{
    public class ExpenseDTO
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required decimal Amount { get; set; }
        public string? Description { get; set; }
        public DateTime Date { get; set; }
    }
}
