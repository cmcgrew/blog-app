import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateBlog } from '../../businessLogic/blogs'
import { UpdateBlogRequest } from '../../requests/UpdateBlogRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      validateParameters(event)
    } catch (err) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: err
        })
      }
    }    
    
    const blogId = event.pathParameters.blogId
    const updatedBlog: UpdateBlogRequest = JSON.parse(event.body)
    
    try {
      await updateBlog(blogId, getUserId(event), updatedBlog)
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({})
      }
    } catch (err) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: err
        })
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )

  function validateParameters(event) {
    if(!event) {
      throw 'event is required'
    } else {
      if(!event.pathParameters.blogId) {
        throw 'blogId is required as path param'
      }
      if(!event.body) {
        throw 'body is required'
      } else {
        const body = JSON.parse(event.body);
        if(!body.name) {
          throw 'name attribute required in body'
        }
        if(!body.title) {
          throw 'title attribute required in body'
        }
      }
    }
  }