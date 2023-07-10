import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { CourseItem } from '../models/CourseItem'
import { CourseUpdate } from '../models/CourseUpdate';

var AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('CoursesAccess')

export class CoursesAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly coursesTable = process.env.COURSES_TABLE,
        private readonly coursesIndex = process.env.INDEX_NAME
    ){}

    async getAllCourses(userId: string): Promise<CourseItem[]> {
        logger.info('Getting all the function that is called')

        const result = await this.docClient
        .query({
            TableName: this.coursesTable,
            IndexName: this. coursesIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        .promise()

        const items = result.Items
        return items as CourseItem[]
    }

    async getCourse(userId: string, courseId: string): Promise<CourseItem> {
        logger.info('Getting single course that is called')
        const key = {
            "userId": userId,
            "courseId": courseId
          };
        const result = await this.docClient
        .get({
            TableName: this.coursesTable,
            Key: key
        })
        .promise()

        const item = result.Item
        return item as CourseItem
    }    

    async createCourseItem(courseItem: CourseItem): Promise<CourseItem> {
        logger.info('Calling create function')

        const result = await this.docClient
        .put({
            TableName: this.coursesTable,
            Item: courseItem
        })
        .promise()
        logger.info('Course created', result)
        return courseItem as CourseItem
    }

    async updateCourseItem(
        courseId: string,
        userId: string,
        courseUpdate: CourseUpdate
    ): Promise<CourseUpdate> {
        logger.info('Calling update function')

        const result = await this.docClient
        .update({
            TableName: this.coursesTable,
            Key: {
            courseId,
            userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done, description = :description, instructor = :instructor, startDate = :startDate, endDate = :endDate',
            ExpressionAttributeValues: {
            ':name': courseUpdate.name,
            ':description': courseUpdate.description,
            ':instructor': courseUpdate.instructor,
            ':startDate': courseUpdate.startDate,
            ':endDate': courseUpdate.endDate,
            ':dueDate': courseUpdate.dueDate,
            ':done': courseUpdate.done
            },
            ExpressionAttributeNames: {
            '#name': 'name'
            },
            ReturnValues: 'ALL_NEW'
        })
        .promise()

        const courseItemUpdate = result.Attributes
        logger.info('course updated', courseItemUpdate)
        return courseItemUpdate as CourseUpdate
        
    }

    async deleteCourseItem(courseId: string, userId: string): Promise<string> {
        logger.info('Calling delete function')

        const result = await this.docClient
        .delete({
            TableName: this.coursesTable,
            Key: {
            courseId,
            userId
            }
        })
        .promise()
        logger.info('Course deleted', result)
        return courseId as string
    }

    async updateAttachmentUrl(courseId: string, userId: string, attachmentUrl: string): Promise<void> {
        await this.docClient.update({
          TableName: this.coursesTable,
          Key: {
            courseId,
            userId
          },
          UpdateExpression: 'set attachmentUrl = :attachmentUrl',
          ExpressionAttributeValues:{
              ':attachmentUrl': attachmentUrl
          }
        }).promise()
      }
}