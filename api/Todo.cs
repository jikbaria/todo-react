using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TodoApi;

public enum TodoStatus
{
    Todo,
    Done
}
public class Todo
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public required string Title { get; set; }
    public string Description { get; set; } = string.Empty;
    public TodoStatus Status { get; set; } = TodoStatus.Todo;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}