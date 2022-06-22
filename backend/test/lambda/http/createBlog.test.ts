import { handler } from '../../../src/lambda/http/createBlog'
import { APIGatewayProxyEvent } from 'aws-lambda'

jest.mock('../../../src/businessLogic/blogs');

jest.mock('../../../src/lambda/utils', () => ({
  getUserId: jest.fn().mockReturnValue("12345")
}))

describe('Create Blog Controller tests', () => {

  
        afterEach(() => {
            jest.resetModules();  // reset modules after each test
         })

        it('should return a BlogItem', async () => {
          let event: APIGatewayProxyEvent = {
            body: '{"title": "Test Title", "name":"This is the body", "dueDate": "2020-09-09"}',
            headers: {},
            multiValueHeaders: {},
            httpMethod: 'post',
            isBase64Encoded: false,
            path: '/',
            pathParameters: {},
            queryStringParameters: {},
            multiValueQueryStringParameters: {},
            stageVariables: {},
            requestContext: undefined,
            resource: ''
          }
            handler(event, {
              callbackWaitsForEmptyEventLoop: false,
              functionName: '',
              functionVersion: '',
              invokedFunctionArn: '',
              memoryLimitInMB: 0,
              awsRequestId: '',
              logGroupName: '',
              logStreamName: '',
              getRemainingTimeInMillis: function (): number {
                throw new Error('Function not implemented.');
              },
              done: function (error?: Error, result?: any): void {
                throw new Error('Function not implemented.' + error + result);
              },
              fail: function (error: string | Error): void {
                expect(error).toEqual('')
              },
              succeed: function (messageOrObject: any): void {
                expect(messageOrObject).toEqual('')
              }
            }, () => {return 'Called the callback'});
        });
    }
)