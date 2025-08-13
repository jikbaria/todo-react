using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace TodoApi;

internal static class TodoApi
{
    public static RouteGroupBuilder MapTodos(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/todos");

        group.WithTags("Todos");


        group.MapGet("/", async (TodoDbContext db) =>
        {
            return await db.Todos.OrderByDescending(todo => todo.CreatedAt).Select(todo => new TodoDto(todo)).ToListAsync();
        });

        group.MapGet("/{id}", async Task<Results<Ok<TodoDto>, NotFound>> (TodoDbContext db, string id) =>
        {
            var todo = await db.Todos.FindAsync(id);
            return todo is not null ? TypedResults.Ok(new TodoDto(todo)) : TypedResults.NotFound();

        });

        group.MapPost("/", async Task<Results<Created<TodoDto>, BadRequest, ValidationProblem>> (TodoDbContext db, CreateTodoRequest newTodo) =>
        {
            var todo = new Todo
            {
                Title = newTodo.Title,
                Description = newTodo.Description,
                DueDate = newTodo.DueDate is not null ? DateTime.Parse(newTodo.DueDate) : null
            };
            

            db.Todos.Add(todo);
            await db.SaveChangesAsync();

            return TypedResults.Created($"/todos/{todo.Id}", new TodoDto(todo));
        });

        group.MapPut("/{id}", async Task<Results<Ok<TodoDto>, NotFound, ValidationProblem>> (TodoDbContext db, string id, [Validate] UpdateTodoRequest todo) =>
        {
            var existingTodo = await db.Todos.FindAsync(id);
            if (existingTodo is null) return TypedResults.NotFound();

            existingTodo.Title = todo.Title;
            existingTodo.Description = todo.Description;
            existingTodo.Status = Enum.Parse<TodoStatus>(todo.Status,true);
            existingTodo.DueDate = todo.DueDate is not null ? DateTime.Parse(todo.DueDate) : null;
            existingTodo.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return TypedResults.Ok(new TodoDto(existingTodo));
        });

        group.MapDelete("/{id}", async Task<Results<NotFound, NoContent>> (TodoDbContext db, string id) =>
        {
            var todo = await db.Todos.FindAsync(id);
            if (todo is null) return TypedResults.NotFound();

            db.Todos.Remove(todo);
            await db.SaveChangesAsync();

            return TypedResults.NoContent();
        });

        return group.AddEndpointFilterFactory(ValidationEndpointFilterFactory.Create);

    }


}

