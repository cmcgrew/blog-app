import { BlogAccess } from '../helpers/blogsAccess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { BlogItem } from '../models/BlogItem'
import { CreateBlogRequest } from '../requests/CreateBlogRequest'
import { UpdateBlogRequest } from '../requests/UpdateBlogRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { BlogUpdate } from '../models/BlogUpdate'

const blogAccess: BlogAccess = new BlogAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('businessLayerLogger')
export async function getBlogForUser(userId: string) {
    try {
        let blogs = await blogAccess.getBlogList(userId)
        return blogs
    } catch (err) {
        logger.error("Unable to get list of Blogs", {
            userId,
            error: err
        })
        return err
    }
}


export async function createBlog(blogRequest: CreateBlogRequest, userId: string) {

    const blogId = uuid.v4()
    const blogItem : BlogItem = 
    {
      userId: userId,
      blogId: blogId,
      createdAt: new Date().toLocaleString(),
      title: blogRequest.title,
      name: blogRequest.name,
      attachmentUrl: blogRequest.attachmentUrl
    }

    try {
        await blogAccess.insertBlogItem(blogItem)
        return blogItem
    } catch (err) {
        logger.error("Unable to save Blog Item", {
            methodName: 'blogs.intertBlogItem',
            userId,
            error: err
        })
        return err
    }

}

export async function updateBlog(blogId: string,userId: string, updatedBlogItem: UpdateBlogRequest) {
    const blogUpdate: BlogUpdate = {
        ...updatedBlogItem
    }
    
    try {
        await blogAccess.updateBlogItem(blogId, userId, blogUpdate)
    } catch (err) {
        return err
    }
}

export async function deleteBlog(blogId: string, userId: string) {
    
    try {
        await blogAccess.deleteBlogItem(blogId, userId)
    } catch (err) {
        return err
    }
}

export async function createAttachmentPresignedUrl(blogId: string, userId: string) {
    try {
        const imageId = uuid.v4();
        let url = await attachmentUtils.generateSignedUrl(imageId)
        await blogAccess.updateBlogItemAttachmentUrl(blogId, userId, imageId)
        return url
    } catch (err) {
        logger.error("Unable to update Blog Item attachment Url", {
            methodName: 'blogs.createAttachmentPresignedUrl',
            userId,
            error: err
        })
        return err
    }
}