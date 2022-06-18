import {getTodosForUser, updateTodo, deleteTodo, createTodo} from '../../src/businessLogic/todos'
import {TodosAccess} from '../../src/helpers/todosAccess'
import { CreateTodoRequest } from '../../src/requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../../src/requests/UpdateTodoRequest';

describe('Business Logic tests', () => {
        afterEach(() => {
            jest.resetModules();  // reset modules after each test
         })

        it('should return a BlogItem', async () => {
            const stubbedResponse = {
                userId: "12345",
                todoId: "12345",
                createdAt: "2022-02-02",
                title: "title",
                name: "This is the body"
            };

            TodosAccess.prototype.getTodoList = jest.fn().mockReturnValue(Promise.resolve(stubbedResponse));
            let result = await getTodosForUser("12345");
            expect(result).toEqual(stubbedResponse)
        });

        it('should return an error', async () => {
            TodosAccess.prototype.getTodoList = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            let result = getTodosForUser("12345");
            expect(result).rejects.toMatch('error')
        });

        it('should return a BlogItem that was updated', async () => {

            const todoToUpdate : UpdateTodoRequest = {
                name: "New String",
                title: "updated Body"
            }

            TodosAccess.prototype.updateTodoItem = jest.fn().mockReturnValue(Promise.resolve(undefined));
            let result = await updateTodo("12345", "67890", todoToUpdate);
            expect(result).toEqual(undefined)
        });

        it('should return an error when calling udpate and it errors', async () => {
            TodosAccess.prototype.updateTodoItem = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            const todoToUpdate : UpdateTodoRequest = {
                name: "New String",
                title: "updated Body"
            }
            
            let result = await updateTodo("12345", "67890", todoToUpdate);
            expect(result.stack).not.toEqual(undefined)
        });

        it('should return a BlogItem that was updated', async () => {

            TodosAccess.prototype.deleteTodoItem = jest.fn().mockReturnValue(Promise.resolve(undefined));
            let result = await deleteTodo("12345", "67890");
            expect(result).toEqual(undefined)
        });

        it('should return an error when calling delete and it errors', async () => {
            TodosAccess.prototype.deleteTodoItem = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            
            let result = await deleteTodo("12345", "67890");
            expect(result.stack).not.toEqual(undefined)
        });




        it('should return a BlogItem that was created', async () => {

            const todoToCreate : CreateTodoRequest = {
                name: 'New String',
                title: 'updated Body'
            }

            TodosAccess.prototype.insertTodoItem = jest.fn().mockReturnValue(Promise.resolve('{"attachmentUrl": undefined, "createdAt": "6/17/2022, 7:47:45 PM", "name": "New String", "title": "updated Body", "todoId": "a36d87a7-e13d-4d15-8b67-873c2eae9377", "userId": "12345"}'));
            let result = await createTodo(todoToCreate,"12345");
            expect(result).not.toEqual(undefined)
        });

        it('should return an error when calling insert and it errors', async () => {
            TodosAccess.prototype.insertTodoItem = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            const todoToCreate : CreateTodoRequest = {
                name: "New String",
                title: "updated Body"
            }
            
            let result = await createTodo(todoToCreate,"12345");
            expect(result.stack).not.toEqual(undefined)
        });
    }
)