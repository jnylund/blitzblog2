import React, { ReactNode, PropsWithoutRef } from "react"
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form"
import { z } from "zod"
import { Button } from "./Button"
import deepEqual from "fast-deep-equal"
import { Nullable } from "utils/types"
import { formatZodError } from "blitz"
export { FORM_ERROR } from "final-form"

type FormProps<S extends z.ZodType<any, any>, T = z.infer<S>> = {
  /** All your form fields */
  children: ReactNode | FinalFormProps<T>["render"]
  /** Text to display in the submit button */
  submitText?: string
  onSubmit: FinalFormProps<T>["onSubmit"]
  initialValues?: FinalFormProps<Nullable<T>>["initialValues"]
  schema?: S
  hideError?: boolean
  mutators?: FinalFormProps<T>["mutators"]
} & Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit">

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  className,
  hideError,
  mutators,
  ...props
}: FormProps<S>) {
  return (
    <FinalForm
      initialValues={initialValues}
      initialValuesEqual={deepEqual}
      validate={(values) => {
        if (!schema) return
        try {
          schema.parse(values, {
            errorMap: (error, ctx) => {
              if (error.message) return { message: error.message }
              let message = ctx.defaultError
              switch (error.code) {
                case z.ZodIssueCode.invalid_type:
                  if ((error.expected as any) === true || (error.expected as any) === "true") {
                    message = "Required"
                  } else if (error.received === "undefined" || error.received === "null") {
                    message = "Required"
                  } else if (error.expected === "date" && error.received === "string") {
                    message = "This is not a valid date"
                  }
                  break
              }
              return { message }
            },
          })
        } catch (error) {
          const errors = formatZodError(error)
          return errors
        }
      }}
      onSubmit={onSubmit}
      mutators={mutators}
      render={(formProps) => (
        <form
          onSubmit={formProps.handleSubmit}
          className={"form space-y-6 " + className}
          {...props}
        >
          {/* Form fields supplied as children are rendered here */}
          {typeof children === "function" ? (children as any)(formProps) : children}

          {formProps.submitError && !hideError && (
            <div role="alert" className="pl-1 text-sm text-red-700">
              {formProps.submitError}
            </div>
          )}

          {submitText && (
            <div className="pt-4">
              <span className="block w-full rounded-md shadow-sm">
                <Button type="submit" disabled={formProps.submitting} className="w-full">
                  {submitText}
                </Button>
              </span>
            </div>
          )}
        </form>
      )}
    />
  )
}
