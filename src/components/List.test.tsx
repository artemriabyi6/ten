import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import List from './List';
import '@testing-library/jest-dom';

describe('List Component', () => {
  test('renders input and button', () => {
    render(<List />);
    
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByText('➕ Add')).toBeInTheDocument();
  });

  test('adds todo when button is clicked', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByText('➕ Add');

    await user.type(input, 'Test todo');
    await user.click(button);

    expect(screen.getByText('Test todo')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('adds todo when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'Test todo{enter}');
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });



  test('adds multiple todos', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByText('➕ Add');

    await user.type(input, 'First todo');
    await user.click(button);
    
    await user.type(input, 'Second todo');
    await user.click(button);
    
    await user.type(input, 'Third todo');
    await user.click(button);

    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
    expect(screen.getByText('Third todo')).toBeInTheDocument();
  });

  test('clears input after adding todo', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByText('➕ Add');

    await user.type(input, 'Test todo');
    await user.click(button);

    expect(input).toHaveValue('');
  });

  test('input value updates correctly', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');

    await user.type(input, 'Typing test');
    expect(input).toHaveValue('Typing test');
  });

  test('toggles todo completion', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByText('➕ Add');

    await user.type(input, 'Test todo');
    await user.click(button);

    const checkbox = screen.getByRole('checkbox');
    const todoText = screen.getByText('Test todo');

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('deletes todo', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('➕ Add');

    await user.type(input, 'Todo to delete');
    await user.click(addButton);

    expect(screen.getByText('Todo to delete')).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /delete todo/i });
    await user.click(deleteButton);

    expect(screen.queryByText('Todo to delete')).not.toBeInTheDocument();
  });

  test('clears completed todos', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('➕ Add');

   
    await user.type(input, 'Completed todo');
    await user.click(addButton);
    
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    
    const clearButton = screen.getByText(/Clear Completed/);
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    
    expect(screen.queryByText('Completed todo')).not.toBeInTheDocument();
  });



  test('shows statistics correctly', async () => {
    const user = userEvent.setup();
    render(<List />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByText('➕ Add');

    await user.type(input, 'Todo 1');
    await user.click(addButton);
    
    await user.type(input, 'Todo 2');
    await user.click(addButton);
    
    await user.type(input, 'Todo 3');
    await user.click(addButton);

    // Перевіряємо статистику
    expect(screen.getByText('Total: 3')).toBeInTheDocument();
    expect(screen.getByText('Active: 3')).toBeInTheDocument();
    expect(screen.getByText('Completed: 0')).toBeInTheDocument();

    // Завершуємо один todo
    const firstCheckbox = screen.getAllByRole('checkbox')[0];
    await user.click(firstCheckbox);

    expect(screen.getByText('Total: 3')).toBeInTheDocument();
    expect(screen.getByText('Active: 2')).toBeInTheDocument();
    expect(screen.getByText('Completed: 1')).toBeInTheDocument();
  });
});