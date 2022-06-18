import { handler } from '../../../src/lambda/http/deleteTodo'
import { APIGatewayProxyEvent } from 'aws-lambda'

jest.mock('../../../src/businessLogic/todos');

describe('Get Todos Controller tests', () => {

  
    afterEach(() => {
        jest.resetModules();  // reset modules after each test
     })

    it('should return List of Todos', async () => {
      let event: APIGatewayProxyEvent = {
        body: '{}',
        headers: {},
        multiValueHeaders: {},
        httpMethod: 'delete',
        isBase64Encoded: false,
        path: '/todos',
        pathParameters: null,
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