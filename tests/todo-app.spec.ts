import { test, expect, type Page } from "@playwright/test";

// Add database cleanup helper
async function clearAllTodos(page: Page) {
  // ideally we would use an API call to delete all todos
  const response = await page.request.get(
    `${process.env.VITE_API_BASE_URL}/todos`
  );
  const todos = await response.json();
  for (const todo of todos) {
    // Send a delete request for each todo
    await page.request.delete(
      `${process.env.VITE_API_BASE_URL}/todos/${todo.id}`
    );
  }

  await page.goto("/");
}

test.beforeEach(async ({ page }) => {
  // Clear existing data before each test
  await clearAllTodos(page);
  await page.goto("/", { waitUntil: "networkidle" });
});

const TODO_ITEMS = ["buy some cheese", "feed the cat"] as const;

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({ page }) => {
    const newTodo = page.getByPlaceholder(/title/i);

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    // Make sure the list only has one todo item.
    await expect(page.getByTestId("task-list-item")).toHaveCount(1);
    await expect(page.getByTestId("task-list-item").first()).toContainText(
      TODO_ITEMS[0]
    );

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press("Enter");

    // Make sure the list now has two todo items.
    await expect(page.getByTestId("task-list-item")).toHaveCount(2);
    // Check that the new item appears
    await expect(page.getByTestId("task-list-item")).toContainText([
      TODO_ITEMS[1],
      TODO_ITEMS[0],
    ]);
  });

  test("should clear text input field when an item is added", async ({
    page,
  }) => {
    const newTodo = page.getByPlaceholder(/title/i);

    // Create one todo item.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press("Enter");

    // Check that input is empty.
    await expect(newTodo).toBeEmpty();
  });
});

test.describe("Item", () => {
  test("should allow me to mark items as complete", async ({ page }) => {
    await createDefaultTodos(page);

    // Wait for items to be created
    await expect(page.getByTestId("task-list-item")).toHaveCount(2);

    // Check first item.
    const firstTodo = page.getByTestId("task-list-item").filter({
      hasText: TODO_ITEMS[0],
    });
    await firstTodo.getByRole("checkbox").click();

    // Check second item.
    const secondTodo = page.getByTestId("task-list-item").filter({
      hasText: TODO_ITEMS[1],
    });
    await secondTodo.getByRole("checkbox").click();

    // open completed tasks section
    await page
      .getByRole("button", {
        name: /completed tasks/i,
      })
      .click();

    await expect(firstTodo.getByRole("checkbox")).toBeChecked();
    await expect(secondTodo.getByRole("checkbox")).toBeChecked();
  });

  test("should allow me to edit an item", async ({ page }) => {
    await createDefaultTodos(page);

    const todoItems = page.getByTestId("task-list-item");
    await expect(todoItems).toHaveCount(2);

    const secondTodo = todoItems.nth(1);
    await secondTodo.click();

    const editInput = page.getByRole("textbox", { name: "title" });
    await expect(editInput).toBeVisible();
    await expect(editInput).toHaveValue(TODO_ITEMS[0]);

    await editInput.fill("buy some sausages");
    await editInput.press("Enter");

    await expect(secondTodo).toContainText("buy some sausages");
  });
});

test.describe("Persistence", () => {
  test("should persist its data", async ({ page }) => {
    await createDefaultTodos(page);

    const todoItems = page.getByTestId("task-list-item");
    await expect(todoItems).toHaveCount(2);

    const firstTodoCheck = todoItems.nth(0).getByRole("checkbox");
    await firstTodoCheck.click();

    await page
      .getByRole("button", {
        name: /completed tasks/i,
      })
      .click();

    await expect(
      page
        .getByTestId("task-list-item")
        .filter({ hasText: TODO_ITEMS[1] })
        .getByRole("checkbox")
    ).toBeChecked();

    // Now reload.
    await page.reload();
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("button", {
        name: /completed tasks/i,
      })
      .click();

    // Verify data persisted
    await expect(page.getByTestId("task-list-item")).toHaveCount(2);
    const reloadedItems = page.getByTestId("task-list-item");
    await expect(reloadedItems.nth(1).getByRole("checkbox")).toBeChecked();
  });
});

async function createDefaultTodos(page: Page) {
  const newTodo = page.getByPlaceholder(/title/i);

  for (const item of TODO_ITEMS) {
    await newTodo.fill(item);
    await newTodo.press("Enter");
  }

  // Wait for all items to be created
  await expect(page.getByTestId("task-list-item")).toHaveCount(
    TODO_ITEMS.length
  );
}
