import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createTodo, deleteTodo, getTodos, patchTodo } from '../api/todos-api'
import Auth from '../auth/Auth'
import { Todo } from '../types/Todo'

interface TodosProps {
  auth: Auth
  history: History
}

interface TodosState {
  todos: Todo[]
  newTodoTitle: string
  newTodoName: string
  loadingTodos: boolean
}

export class Todos extends React.PureComponent<TodosProps, TodosState> {
  state: TodosState = {
    todos: [],
    newTodoTitle: '',
    newTodoName: '',
    loadingTodos: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoTitle: event.target.value })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoName: event.target.value })
  }

  onEditButtonClick = (todoId: string) => {
    this.props.history.push(`/todos/${todoId}/edit`)
  }

  onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newTodo = await createTodo(this.props.auth.getIdToken(), {
        title: this.state.newTodoTitle,
        name: this.state.newTodoName,
        dueDate
      })

      this.setState({
        todos: this.state.todos ? [...this.state.todos, newTodo] : [newTodo],
        newTodoName: '',
        newTodoTitle: ''
      })
    } catch(e) {
      alert('Todo creation failed: ' + e.message)
    }
  }

  onTodoDelete = async (todoId: string) => {
    try {
      await deleteTodo(this.props.auth.getIdToken(), todoId)
      this.setState({
        todos: this.state.todos.filter(todo => todo.todoId !== todoId)
      })
    } catch {
      alert('Todo deletion failed')
    }
  }

  // onTodoCheck = async (pos: number) => {
  //   try {
  //     const todo = this.state.todos[pos]
  //     await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
  //       name: todo.name,
  //       dueDate: todo.dueDate,
  //       done: !todo.done
  //     })
  //     this.setState({
  //       todos: update(this.state.todos, {
  //         [pos]: { done: { $set: !todo.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Todo deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const todos = await getTodos(this.props.auth.getIdToken())
      this.setState({
        todos,
        loadingTodos: false
      })
    } catch (e) {
      alert(`Failed to fetch messages: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">BLOG FEED</Header>
        {this.renderTodos()}
        {this.renderCreateTodoInput()}
      </div>
    )
  }

  renderCreateTodoInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
        <Input
            // action={{
            //   color: 'teal',
            //   labelPosition: 'left',
            //   icon: 'add',
            //   content: 'Send',
            //   onClick: this.onTodoCreate
            // }}
            fluid
            actionPosition="left"
            placeholder="Title"
            onChange={this.handleTitleChange}
          />
          <Input
            action={{
              color: 'purple',
              labelPosition: 'left',
              icon: 'add',
              content: 'Post',
              onClick: this.onTodoCreate
            }}
            type="textarea"
            fluid
            placeholder="Really awsome blog content..."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderTodos() {
    if (this.state.loadingTodos) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Blog Posts...
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state && this.state.todos && this.state.todos.map((todo, pos) => {
          return (
            todo && <Grid.Row key={todo.todoId}>
              <Grid.Column width={10} verticalAlign="middle">
                <b><h1>{todo.title}</h1></b>
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {todo.name}
              </Grid.Column>
              {/* <Grid.Column width={3} floated="right">
                {todo.dueDate}
              </Grid.Column> */}
              <Grid.Column width={1} floated="right">
                {/* <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="picture" />
                </Button> */}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
              <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(todo.todoId)}
                >
                  <Icon name="picture" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onTodoDelete(todo.todoId)}
                >
                  <Icon name="delete" />
                </Button>
              {/* </Grid.Column>
              {todo.attachmentUrl && (
                <Image src={todo.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}> */}
                <Divider />
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle">
                {todo.attachmentUrl && (
                  <Image src={todo.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
            
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
