import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { deleteBlog } from '../../businessLogic/blogs'

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
    const userId = getUserId(event)
    
    try {
      deleteBlog(blogId, userId)
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
    if(!event.pathParameters) {
      throw 'id is required in path params'
    }
  }
}