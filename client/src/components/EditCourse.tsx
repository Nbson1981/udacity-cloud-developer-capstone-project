import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, getCourse } from '../api/courses-api'
import { Course } from '../types/Course'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface EditCourseProps {
  match: {
    params: {
      courseId: string
    }
  }
  auth: Auth
}

interface EditCourseState {
  course: Course
  file: any
  uploadState: UploadState
}

export class EditCourse extends React.PureComponent<
  EditCourseProps,
  EditCourseState
> {
  state: EditCourseState = {
    course: {
      courseId: '',
      createdAt: '',
      name: '',
      description: '',
      instructor: '',
      startDate: '',
      endDate: '',
      dueDate: '',
      done: false
    },
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.courseId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('File was uploaded!')
    } catch (e) {
      alert('Could not upload a file: ' + (e as Error).message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const course = await getCourse(this.props.auth.getIdToken(), this.props.match.params.courseId)
      this.setState({
        course: course,
        file: this.state.file,
        uploadState: this.state.uploadState
      })
    } catch (e) {
      alert(`Failed to fetch course: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      
      <div>
        <h1>Upload new image for {this.state.course.name} course </h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit"
        >
          Upload
        </Button>
      </div>
    )
  }
}
