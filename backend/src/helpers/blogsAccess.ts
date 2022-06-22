import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { BlogItem } from '../models/BlogItem'
import { BlogUpdate } from '../models/BlogUpdate';

const client = new AWS.DynamoDB.DocumentClient({
  service: new AWS.DynamoDB({
    region: 'us-east-1'
  }),
  region: 'us-east-1'
})

AWSXRay.captureAWSClient((client as any).service);

const logger = createLogger('BlogAccess')

export class BlogAccess {


  constructor(
    private readonly docClient: DocumentClient = client,
    private readonly blogsTable: string = process.env.BLOGS_TABLE,
    private readonly blogsTableIndex: string = process.env.BLOGS_CREATED_AT_INDEX
  ) {

  }

  async getBlogList(userId: string) {

    const params = {
      TableName: this.blogsTable,
      IndexName: this.blogsTableIndex,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      },
    };



    try {
      return await this.docClient.query(params).promise()
    } catch (err) {
      logger.error("Unable to get Blogs from database", {
        methodName: 'blogsAccess.getBlogList',
        userId,
        error: err
      })
      return err
    }

  }

  async insertBlogItem(blogItem: BlogItem) {
    let input = { "userId": blogItem.userId, "blogId": blogItem.blogId, "createdAt": blogItem.createdAt, "name": blogItem.name, "title": blogItem.title, "attachmentUrl": blogItem.attachmentUrl }
    const params: DocumentClient.PutItemInput = {
      TableName: this.blogsTable,
      Item: input
    }

    try {
      await this.docClient.put(params).promise()
    } catch (err) {
      logger.error("Unable to insert Blogs into database", {
        methodName: 'blogsAccess.insertBlogItem',
        blogId: blogItem.blogId,
        error: err
      })
        return err
    }
  }

  async updateBlogItem(blogId: string, userId: string, updatedBlogItem: BlogUpdate) {
    const params = {
      TableName: this.blogsTable,
      Key: { 
        blogId,
        userId
      },
      UpdateExpression: 'set #nm = :name, title = :title',
      ExpressionAttributeNames: {"#nm": "name"},
      ExpressionAttributeValues: { ':name': updatedBlogItem.name, ':title': updatedBlogItem.title },
    }
    try {
      await this.docClient.update(params, function(err) {
        if(err) {
          console.log(err)
        }
      }).promise()
    } catch (err) {
      logger.error("Unable to update Blogs in database", {
        methodName: 'blogsAccess.updateBlogItem',
        blogId: blogId,
        error: err
      })
      return err
    }
  }

  async deleteBlogItem(blogId: string, userId: string) {
    var params = {
      TableName: this.blogsTable,
      Key: { 
        userId,
        blogId },
    }
    try {
      await this.docClient.delete(params, function(err) {
        if (err) {
          console.log(err)
        }
      }).promise()
    } catch (err) {
      logger.error("Unable to delete Blogs in database", {
        methodName: 'blogsAccess.deleteBlogItem',
        blogId: blogId,
        error: err
      })
      return err
    }
  }

  async updateBlogItemAttachmentUrl(blogId: string, userId: string, imageId: string) {
    const params = {
      TableName: this.blogsTable,
      Key: { 
        blogId,
        userId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: { ':attachmentUrl': `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${imageId}` },
    }
    try {
      await this.docClient.update(params, function(err) {
        if(err) {
          console.log(err)
        }
      }).promise()
    } catch (err) {
      logger.error("Unable to Blog attachmentUrl in database", {
        methodName: 'blogsAccess.updateBlogItemAttachmentUrl',
        blogId: blogId,
        error: err
      })
      return err
    }
  }
}


