import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateBlogRequest } from '../../requests/CreateBlogRequest'
import { getUserId } from '../utils';
import { createBlog } from '../../businessLogic/blogs'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createBlog')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      validateParameters(event)
    } catch (err) {
      logger.error('Missing required paramenters', {
        error: err
      })
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

    const newBlog: CreateBlogRequest = JSON.parse(event.body)
    const userId : string = getUserId(event)
    
    try {
      const response = await createBlog(newBlog, userId)
      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(
          {
            item: response
          }
        )
      }
    } catch (err) {
      logger.error('Unable to complete the create Blog Operation for user', {
        userId: userId,
        error: err
      })
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

handler.use(
  cors({
    credentials: true
  })
)

function validateParameters(event) {
  if(!event) {
    throw 'event is required'
  } else {
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