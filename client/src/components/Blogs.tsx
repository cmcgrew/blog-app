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

import { createBlog, deleteBlog, getBlog, patchBlog } from '../api/blogs-api'
import Auth from '../auth/Auth'
import { Blog } from '../types/Blog'

interface BlogProps {
  auth: Auth
  history: History
}

interface BlogState {
  blogs: Blog[]
  newBlogTitle: string
  newBlogName: string
  loadingBlog: boolean
}

export class Blog extends React.PureComponent<BlogProps, BlogState> {
  state: BlogState = {
    blogs: [],
    newBlogTitle: '',
    newBlogName: '',
    loadingBlog: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBlogTitle: event.target.value })
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBlogName: event.target.value })
  }

  onEditButtonClick = (blogId: string) => {
    this.props.history.push(`/blogs/${blogId}/edit`)
  }

  onBlogCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newBlog = await createBlog(this.props.auth.getIdToken(), {
        title: this.state.newBlogTitle,
        name: this.state.newBlogName,
        dueDate
      })

      this.setState({
        blogs: this.state.blogs ? [...this.state.blogs, newBlog] : [newBlog],
        newBlogName: '',
        newBlogTitle: ''
      })
    } catch(e) {
      alert('Blog creation failed: ' + e.message)
    }
  }

  onBlogDelete = async (blogId: string) => {
    try {
      await deleteBlog(this.props.auth.getIdToken(), blogId)
      this.setState({
        blogs: this.state.blogs.filter(blog => blog.blogId !== blogId)
      })
    } catch {
      alert('Blog deletion failed')
    }
  }

  // onBlogCheck = async (pos: number) => {
  //   try {
  //     const blog = this.state.blogs[pos]
  //     await patchBlog(this.props.auth.getIdToken(), blog.blogId, {
  //       name: blog.name,
  //       dueDate: blog.dueDate,
  //       done: !blog.done
  //     })
  //     this.setState({
  //       blogs: update(this.state.blogs, {
  //         [pos]: { done: { $set: !blog.done } }
  //       })
  //     })
  //   } catch {
  //     alert('Blog deletion failed')
  //   }
  // }

  async componentDidMount() {
    try {
      const blogs = await getBlog(this.props.auth.getIdToken())
      this.setState({
        blogs,
        loadingBlog: false
      })
    } catch (e) {
      alert(`Failed to fetch messages: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">BLOG FEED</Header>
        {this.renderBlog()}
        {this.renderCreateBlogInput()}
      </div>
    )
  }

  renderCreateBlogInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
        <Input
            // action={{
            //   color: 'teal',
            //   labelPosition: 'left',
            //   icon: 'add',
            //   content: 'Send',
            //   onClick: this.onBlogCreate
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
              onClick: this.onBlogCreate
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

  renderBlog() {
    if (this.state.loadingBlog) {
      return this.renderLoading()
    }

    return this.renderBlogList()
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

  renderBlogList() {
    return (
      <Grid padded>
        {this.state && this.state.blogs && this.state.blogs.map((blog, pos) => {
          return (
            blog && <Grid.Row key={blog.blogId}>
              <Grid.Column width={10} verticalAlign="middle">
                <b><h1>{blog.title}</h1></b>
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {blog.name}
              </Grid.Column>
              {/* <Grid.Column width={3} floated="right">
                {blog.dueDate}
              </Grid.Column> */}
              <Grid.Column width={1} floated="right">
                {/* <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(blog.blogId)}
                >
                  <Icon name="picture" />
                </Button> */}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
              <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(blog.blogId)}
                >
                  <Icon name="picture" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBlogDelete(blog.blogId)}
                >
                  <Icon name="delete" />
                </Button>
              {/* </Grid.Column>
              {blog.attachmentUrl && (
                <Image src={blog.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}> */}
                <Divider />
              </Grid.Column>
              <Grid.Column width={5} verticalAlign="middle">
                {blog.attachmentUrl && (
                  <Image src={blog.attachmentUrl} size="small" wrapped />
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
