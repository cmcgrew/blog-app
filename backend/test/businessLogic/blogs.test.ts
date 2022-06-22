import {getBlogForUser, updateBlog, deleteBlog, createBlog} from '../../src/businessLogic/blogs'
import {BlogAccess} from '../../src/helpers/blogsAccess'
import { CreateBlogRequest } from '../../src/requests/CreateBlogRequest';
import { UpdateBlogRequest } from '../../src/requests/UpdateBlogRequest';

describe('Business Logic tests', () => {
        afterEach(() => {
            jest.resetModules();  // reset modules after each test
         })

        it('should return a BlogItem', async () => {
            const stubbedResponse = {
                userId: "12345",
                blogId: "12345",
                createdAt: "2022-02-02",
                title: "title",
                name: "This is the body"
            };

            BlogAccess.prototype.getBlogList = jest.fn().mockReturnValue(Promise.resolve(stubbedResponse));
            let result = await getBlogForUser("12345");
            expect(result).toEqual(stubbedResponse)
        });

        it('should return an error', async () => {
            BlogAccess.prototype.getBlogList = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            let result = getBlogForUser("12345");
            expect(result).rejects.toMatch('error')
        });

        it('should return a BlogItem that was updated', async () => {

            const blogToUpdate : UpdateBlogRequest = {
                name: "New String",
                title: "updated Body"
            }

            BlogAccess.prototype.updateBlogItem = jest.fn().mockReturnValue(Promise.resolve(undefined));
            let result = await updateBlog("12345", "67890", blogToUpdate);
            expect(result).toEqual(undefined)
        });

        it('should return an error when calling udpate and it errors', async () => {
            BlogAccess.prototype.updateBlogItem = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            const blogToUpdate : UpdateBlogRequest = {
                name: "New String",
                title: "updated Body"
            }
            
            let result = await updateBlog("12345", "67890", blogToUpdate);
            expect(result.stack).not.toEqual(undefined)
        });

        it('should return a BlogItem that was updated', async () => {

            BlogAccess.prototype.deleteBlogItem = jest.fn().mockReturnValue(Promise.resolve(undefined));
            let result = await deleteBlog("12345", "67890");
            expect(result).toEqual(undefined)
        });

        it('should return an error when calling delete and it errors', async () => {
            BlogAccess.prototype.deleteBlogItem = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            
            let result = await deleteBlog("12345", "67890");
            expect(result.stack).not.toEqual(undefined)
        });




        it('should return a BlogItem that was created', async () => {

            const blogToCreate : CreateBlogRequest = {
                name: 'New String',
                title: 'updated Body'
            }

            BlogAccess.prototype.insertBlogItem = jest.fn().mockReturnValue(Promise.resolve('{"attachmentUrl": undefined, "createdAt": "6/17/2022, 7:47:45 PM", "name": "New String", "title": "updated Body", "blogId": "a36d87a7-e13d-4d15-8b67-873c2eae9377", "userId": "12345"}'));
            let result = await createBlog(blogToCreate,"12345");
            expect(result).not.toEqual(undefined)
        });

        it('should return an error when calling insert and it errors', async () => {
            BlogAccess.prototype.insertBlogItem = jest.fn().mockImplementation(() => {
                throw new Error()
            })
            const blogToCreate : CreateBlogRequest = {
                name: "New String",
                title: "updated Body"
            }
            
            let result = await createBlog(blogToCreate,"12345");
            expect(result.stack).not.toEqual(undefined)
        });
    }
)