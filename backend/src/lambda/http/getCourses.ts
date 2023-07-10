import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getCoursesForUser as getCoursesForUser } from '../../businessLogic/courses'
import { getUserId } from '../utils';

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const courses = await getCoursesForUser(userId)
    return {
         statusCode: 200,
         body: JSON.stringify({
            items: courses
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
