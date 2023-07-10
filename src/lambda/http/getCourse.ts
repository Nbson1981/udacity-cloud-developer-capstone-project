import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getCourseForUser as getCourseForUser } from '../../businessLogic/courses'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const courseId = event.pathParameters.courseId
    const userId = getUserId(event)
    const course = await getCourseForUser(userId, courseId)
    return {
         statusCode: 200,
         body: JSON.stringify({
            item: course
         }) 
      }
    }
)
    //return undefined

    handler
    .use(httpErrorHandler())
    .use(
      cors({
        credentials: true
      })
    )
