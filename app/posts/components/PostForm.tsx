import { Form, FormProps } from "app/core/components/Form"
import { Field } from "react-final-form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import { FieldArray } from "react-final-form-arrays"
import arrayMutators from "final-form-arrays"

export function PostForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  //console.log(JSON.stringify(props))
  //console.log(props.mutators.push)
  return (
    <Form<S> className="w-full max-w-sm" {...props}>
      <LabeledTextField name="title" label="Title" placeholder="Title" className="joel" />
      <LabeledTextField name="author" label="Author" placeholder="Author" />
      <LabeledTextField name="content" label="Content" placeholder="content" />

      <div className="buttons">
        <button
          type="button"
          onClick={() => props.mutators.push("comments", { author: "", content: "" }, () => {})}
        >
          Add Comment
        </button>
      </div>
      <FieldArray name="comments">
        {({ fields }) =>
          fields.map((name, index) => (
            <div key={name}>
              <label>Comment. #{index + 1}</label>
              <LabeledTextField name={`comments.${index}.author`} label="Comment Author" />
              <LabeledTextField name={`comments.${index}.content`} label="Comment content" />
              <span onClick={() => fields.remove(index)} style={{ cursor: "pointer" }}>
                ❌
              </span>
            </div>
          ))
        }
      </FieldArray>
    </Form>
  )
}
