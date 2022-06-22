import { handler } from '../../../src/lambda/http/deleteBlog'
import { APIGatewayProxyEvent } from 'aws-lambda'

jest.mock('../../../src/businessLogic/blogs');

describe('Update Blog Controller tests', () => {

  
    afterEach(() => {
        jest.resetModules();  // reset modules after each test
     })

    it('should return Update Blog', async () => {
      let event: APIGatewayProxyEvent = {
        body: '{}',
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'put',
        isBase64Encoded: false,
        path: '/blogs',
        pathParameters: {['quoteId']: '12345676'},
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