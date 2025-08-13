using FluentValidation;

namespace TodoApi;

public class CreateTodoRequestValidator : AbstractValidator<CreateTodoRequest>
{
    public CreateTodoRequestValidator()
    {
        ApplyCommonRules();
    }

    protected void ApplyCommonRules()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MinimumLength(10).WithMessage("Title must be at least 10 characters")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(10000).WithMessage("Description must not exceed 10000 characters");


        RuleFor(x => x.DueDate)
            .Must(ValidationHelpers.BeAValidDateString).WithMessage("Due date must be in valid ISO format (yyyy-MM-ddTHH:mm:ss)")
            .Must(ValidationHelpers.BeInTheFutureOrToday).WithMessage("Due date cannot be in the past")
            .When(x => !string.IsNullOrEmpty(x.DueDate));
    }
}

public class UpdateTodoRequestValidator : AbstractValidator<UpdateTodoRequest>
{
    public UpdateTodoRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MinimumLength(10).WithMessage("Title must be at least 10 characters")
            .MaximumLength(200).WithMessage("Title must not exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(10000).WithMessage("Description must not exceed 10000 characters");

        RuleFor(x => x.Status)
            .NotEmpty().WithMessage("Status is required")
            .Must(ValidationHelpers.BeAValidTodoStatus).WithMessage("Status must be one of: todo, done");

        RuleFor(x => x.DueDate)
            .Must(ValidationHelpers.BeAValidDateString).WithMessage("Due date must be in valid ISO format (yyyy-MM-ddTHH:mm:ss)")
            .Must(ValidationHelpers.BeInTheFutureOrToday).WithMessage("Due date cannot be in the past")
            .When(x => !string.IsNullOrEmpty(x.DueDate));
    }
}


// Static helper class for validation methods
public static class ValidationHelpers
{
    public static bool BeAValidDateString(string? dateString)
    {
        if (string.IsNullOrEmpty(dateString)) return true;
        return DateTime.TryParse(dateString, out _);
    }

    public static bool BeInTheFutureOrToday(string? dateString)
    {
        if (string.IsNullOrEmpty(dateString)) return true;
        if (DateTime.TryParse(dateString, out var date))
        {
            return date.Date >= DateTime.Today;
        }
        return false;
    }
    
    public static bool BeAValidTodoStatus(string status)
    {
        return Enum.TryParse<TodoStatus>(status, true, out _);
    }
}