import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { isTaskDueSoon } from '../../lib/stats';
import type { GroundSchoolData, Todo } from '../../types';

export const TasksView = ({ data, onDataChange }: { data: GroundSchoolData; onDataChange: (data: GroundSchoolData) => void }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const completed = data.todos.filter((todo) => todo.done).length;
  const pct = data.todos.length ? Math.round((completed / data.todos.length) * 100) : 0;

  const addTask = () => {
    if (!text.trim()) return;
    onDataChange({ ...data, todos: [{ text: text.trim(), done: false, dueDate }, ...data.todos] });
    setText('');
    setDueDate('');
  };

  const updateTask = (index: number, patch: Partial<Todo>) => {
    onDataChange({ ...data, todos: data.todos.map((todo, todoIndex) => todoIndex === index ? { ...todo, ...patch } : todo) });
  };

  const deleteTask = (index: number) => {
    onDataChange({ ...data, todos: data.todos.filter((_, todoIndex) => todoIndex !== index) });
  };

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Todo</span>
          <h2>Tasks</h2>
        </div>
      </div>
      <div className="task-compose">
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="New task..." onKeyDown={(event) => { if (event.key === 'Enter') addTask(); }} />
        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <button onClick={addTask}><Plus size={17} /> Add Task</button>
      </div>
      <div className="progress"><div className="bar" style={{ width: `${pct}%` }} /></div>
      <p className="status">{completed}/{data.todos.length} complete ({pct}%)</p>
      <div className="stack-list">
        {data.todos.length ? data.todos.map((todo, index) => (
          <div className={todo.done ? 'todo-row done' : 'todo-row'} key={`${todo.text}-${index}`}>
            <input className="todo-checkbox" type="checkbox" checked={todo.done} onChange={(event) => updateTask(index, { done: event.target.checked })} />
            <input className="todo-text-input" value={todo.text} onChange={(event) => updateTask(index, { text: event.target.value })} />
            <div className="todo-date-wrap">
              <input type="date" value={todo.dueDate} onChange={(event) => updateTask(index, { dueDate: event.target.value })} />
              {todo.dueDate && <small className={isTaskDueSoon(todo.dueDate) && !todo.done ? 'due-soon' : ''}>{isTaskDueSoon(todo.dueDate) && !todo.done ? 'Due soon' : 'Scheduled'}</small>}
            </div>
            <button className="icon-button danger-icon" onClick={() => deleteTask(index)} aria-label="Delete task"><Trash2 size={17} /></button>
          </div>
        )) : <p className="empty-state">No tasks yet.</p>}
      </div>
    </section>
  );
};
