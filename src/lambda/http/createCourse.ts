import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateCourseRequest } from '../../requests/CreateCourseRequest'
import { getUserId } from '../utils';
import { createCourse } from '../../businessLogic/courses'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newCourse: CreateCourseRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const newItem = await createCourse(newCourse, userId)
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  }

    //return undefined
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
