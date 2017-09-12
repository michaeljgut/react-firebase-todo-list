import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodoText: '',
      currentTodo: '',
      currentTodoText: '',
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

    this.handleNewTodoTextChange = this.handleNewTodoTextChange.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.handleCurrentTodoTextChange = this.handleCurrentTodoTextChange.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.selectTodo = this.selectTodo.bind(this);
    this.updateCurrentTodo = this.updateCurrentTodo.bind(this);
  }

  handleCurrentTodoTextChange(event){
    event.preventDefault();
    this.setState({currentTodoText: event.target.value})
  }

  createTodo(event) {
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

  handleNewTodoTextChange(event) {
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
      this.setState({todos: response.data});
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
    this.setState({currentTodo: todoId,
                    currentTodoText: this.state.todos[todoId].title});
  }

  updateCurrentTodo(event) {
    event.preventDefault();
    const id = this.state.currentTodo;
    const newTodo = {
      title: this.state.currentTodoText
    }
    axios({
      url: `/todos/${id}.json`,
      baseURL: 'https://todo-list-app-77d84.firebaseio.com/',
      method: 'patch',
      data: newTodo
    }).then((response) => {
      let newTodos = this.state.todos;
      newTodos[id] = newTodo;
      this.setState({todos: newTodos});
    }).catch((err) => {
      console.log('err = ',err);
    });
  }

  renderNewTodoBox() {
    return (
      <div className="new-todo-box pb-2">
        <form onSubmit={this.createTodo}>
          <input
            className="w-100"
            placeholder="What do you have to do?"
            value={this.state.newTodoText}
            onChange={this.handleNewTodoTextChange} />
        </form>
      </div>
    );
  }

  renderSelectedTodo() {
    let content;
    if (this.state.currentTodo) {
      content = (
        <form onSubmit={this.updateCurrentTodo}>
          <input
            className="w-100"
            value={this.state.currentTodoText}
            onChange={this.handleCurrentTodoTextChange} />
        </form>
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
