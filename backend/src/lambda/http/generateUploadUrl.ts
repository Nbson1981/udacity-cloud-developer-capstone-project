import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createImagePresignedUrl } from '../../businessLogic/courses'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const courseId = event.pathParameters.courseId
    const userId = getUserId(event)
    console.log('userId:', userId)
    const url = await createImagePresignedUrl(
      courseId,
      userId    
    )
    return {
     statusCode: 201,
     body: JSON.stringify({
       uploadUrl: url
     })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
