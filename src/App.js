import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { fetchTodos, sortTodos, parseDate, postTodos } from "./utiliy";
import "./App.css";

const SUCCESS = "success";

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(false);

  async function handleCheckbox(event) {
    const { checked, id } = event.target;
    setIsLoading(true);
    const { status } = await postTodos(id, checked);
    setIsLoading(false);
    if (status === SUCCESS) {
      let updatedTodos;
      updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isComplete: checked,
          };
        } else return { ...todo };
      });
      updatedTodos = sortTodos(updatedTodos);
      setTodos(updatedTodos);
    } else {
      setError(true);
    }
  }

  useEffect(() => {
    async function initializeTodos() {
      const result = await fetchTodos();
      setTodos(result);
      setIsFetching(false);
    }
    setIsFetching(true);
    initializeTodos();
  }, []);

  return (
    <div className="App">
      <div className="Header">Todo App</div>
      <div className="List">
        <ClipLoader color="#36d7b7" loading={isFetching} />
        {!error ? (
          <ul className="Todo-List">
            {todos.map((todo, index) => (
              <li
                key={index}
                className={`Todo-List-Item ${
                  todo.isComplete ? "Complete" : "Incomplete"
                } ${todo.isOverdue && "Overdue"}`}
              >
                <div>
                  <input
                    className={`${isLoading && "Loading-Todo-Input"}`}
                    id={todo.id}
                    type="checkbox"
                    checked={todo.isComplete}
                    onChange={handleCheckbox}
                  ></input>
                  <span
                    className={`Todo-Desc ${
                      todo.isComplete && "Desc-Complete"
                    }`}
                  >
                    {todo.description}
                  </span>
                </div>
                <div
                  className={`Due-Date ${todo.dueDate && "Due-Date-Border"}`}
                >
                  {parseDate(todo.dueDate)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>internal server error, could not update todo</div>
        )}
        {!isFetching && todos.length === 0 && (
          <div className="Empty">No Data Available</div>
        )}
      </div>
    </div>
  );
}

export default App;
