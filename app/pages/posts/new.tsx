import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createPost from "app/posts/mutations/createPost"
import { PostForm, FORM_ERROR } from "app/posts/components/PostForm"
import { createPostSchema } from "app/pages/posts/validations"
import arrayMutators from "final-form-arrays"

const NewPostPage: BlitzPage = () => {
  const router = useRouter()
  const [createPostMutation] = useMutation(createPost)
  console.log(`mutators are: ${JSON.stringify(arrayMutators)}`)
  //console.log(arrayMutators)
  return (
    <div>
      <h1>Create New Post</h1>

      <PostForm
        submitText="Create Post"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreatePost}
        // initialValues={{}}
        schema={createPostSchema}
        initialValues={{ title: "", comments: [{ author: "bob", content: "" }] }}
        mutators={{ ...arrayMutators }}
        onSubmit={async (values) => {
          try {
            const post = await createPostMutation(values)
            router.push(Routes.ShowPostPage({ postId: post.id }))
          } catch (error: any) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.PostsPage()}>
          <a>Posts</a>
        </Link>
      </p>
    </div>
  )
}

NewPostPage.authenticate = true
NewPostPage.getLayout = (page) => <Layout title={"Create New Post"}>{page}</Layout>

export default NewPostPage
