namespace TodoApi;

public record CreateTodoRequest(string Title, string Description, string? DueDate);

public record UpdateTodoRequest(string Title, string Description, string Status, string? DueDate);



public class TodoDto
{
    public string Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TodoStatus Status { get; set; }

    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }



    public TodoDto(Todo todoItem) =>
    (Id, Title, Description, Status, DueDate, CreatedAt, UpdatedAt) = (todoItem.Id, todoItem.Title, todoItem.Description, todoItem.Status, todoItem.DueDate, todoItem.CreatedAt, todoItem.UpdatedAt);
}