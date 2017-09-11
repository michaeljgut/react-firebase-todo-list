import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodoText: '',
      currentTodo: '',
      todos: {}
    };

    // ^^^ Setting `todos` in state to an empty object. The collection of todos
    // in this app will be represented by an object in stead of an array. The
    // keys of this object will be the uniq identifier of each todo object, and
    // the values of this object will be the todo's themselves.
    //
    // If this doesn't make sense now, just wait until you implement the CREATE
    // feature. Then you will be able to view your data in the Firebase console
    // and it should all be clear.

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.selectTodo = this.selectTodo.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const newTodo = {
      title: this.state.newTodoText,
      createdAt: new Date()
    }
    axios({
      url: '/todos.json',
      baseURL: 'https://todo-list-app-77d84.firebaseio.com/',
      method: 'post',
      data: newTodo
    }).then((response) => {
      let newTodos = this.state.todos;
      newTodos[response.data.name] = newTodo;
      this.setState({todos: newTodos, newTodoText: ''});
    }).catch((err) => {
      console.log('err = ',err);
    });
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({newTodoText: event.target.value});
  }

  componentDidMount() {
    console.log('in compnonentDidMount');
    axios({
      url: '/todos.json',
      baseURL: 'https://todo-list-app-77d84.firebaseio.com/',
      method: 'get'
    }).then((response) => {
      console.log('status = ',response.status)
      console.log('data = ',response.data);
    }).catch((err) => {
      console.log('err = ',err);
    });
  }

  deleteTodo(todoId) {
    axios({
      url: `/todos/${todoId}.json`,
      baseURL: 'https://todo-list-app-77d84.firebaseio.com/',
      method: 'delete',
      data: todoId
    }).then((response) => {
      console.log('in deleteTodo');
      console.log('status = ',response.status);
      console.log('data = ',response.data);
      let newTodos = this.state.todos;
      delete newTodos[todoId];
      this.setState({todos: newTodos});
    }).catch((err) => {
      console.log('err = ',err);
    });
  }

  selectTodo(todoId) {
    this.setState({currentTodo: todoId});
  }

  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <form onSubmit={this.handleSubmit}>
          <input
            className="w-100"
            placeholder="What do you have to do?"
            value={this.state.newTodoText}
            onChange={this.handleChange} />
        </form>
      </div>
    );
  }

  renderSelectedTodo() {
    let content;
    if (this.state.currentTodo) {
      let currentTodo = this.state.todos[this.state.currentTodo];
      content = (
        <div>
          <h2>{currentTodo.title}</h2>
        </div>
      );
    }
    return content;
  }

  renderTodoList() {
    let todoElements = [];

    // Using a `for...in` loop here because `this.state.todos` is an object and
    // we will use the keys of this object (todo_id's from Firebase) as the `key`
    // of each React element in the todos list. If `this.state.todos` was an array,
    // we would be using the array map function.
    for(let todoId in this.state.todos) {
      let todo = this.state.todos[todoId]

      todoElements.push(
        <div className="todo d-flex justify-content-between pb-4" key={todoId}>
          <div className="mt-2" onClick={() => this.selectTodo(todoId)}>
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
          </div>
        <button
          className="ml-4 btn btn-link"
          onClick={() => { this.deleteTodo(todoId) }}>
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      );
    }

    return (
      <div className="todo-list">
        {todoElements}
      </div>
    );
  }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
          <div className="col-6 px-4">
            {this.renderSelectedTodo()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
