import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateCourse } from '../../businessLogic/courses'
import { UpdateCourseRequest } from '../../requests/UpdateCourseRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const courseId = event.pathParameters.courseId
    const updatedCourse: UpdateCourseRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    console.log('userId:', userId)
    await updateCourse(
      courseId,
      updatedCourse,
      userId
    )
    return {
      statusCode: 204,
      body: ''
    }
  }
)
 //   return undefined


handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
