import * as dayjs from "dayjs";

export function sortTodos(todos) {
  todos.sort((a, b) => {
    if (!a.isComplete && !b.isComplete) {
      if (!a.dueDate) return 1;
      else if (!b.dueDate) return -1;
      else if (a.dueDate < b.dueDate) return -1;
      else return 1;
    } else if (a.isComplete) return 1;
    else if (b.isComplete) return -1;
    else return 0;
  });
  return todos;
}

export function parseDate(date) {
  const parsed = date ? dayjs(date).format("MM/DD/YYYY") : "";
  return parsed;
}

export async function fetchTodos() {
  const response = await fetch(
    "https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/get",
    {
      headers: {
        "X-Api-Key":
          "PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c",
      },
    }
  );
  let result = await response.json();
  result = sortTodos(result);
  result.forEach((todo) => {
    if (!todo.isComplete && dayjs(todo.dueDate).isBefore(dayjs())) {
      todo.isOverdue = true;
    } else {
      todo.isOverdue = false;
    }
  });
  return result;
}

export async function postTodos(id, checked) {
  const response = await fetch(
    `https://944ba3c5-94c3-4369-a9e6-a509d65912e2.mock.pstmn.io/patch/${id}`,
    {
      method: "PATCH",
      headers: {
        "X-Api-Key":
          "PMAK-5ef63db179d23c004de50751-10300736bc550d2a891dc4355aab8d7a5c",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isComplete: checked,
      }),
    }
  );
  const result = await response.json();
  return result;
}
