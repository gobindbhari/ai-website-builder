"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"

import { useForm } from "react-hook-form";
import { Loader } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"


type FormData = {
  email: string;
  password: string;
};



export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const router = useRouter();


  const onSubmit = async (formData: FormData) => {

    console.log("data:", formData)
    const { email, password } = formData

    const { data, error } = await authClient.signIn.email({
      email,
      password, 
      callbackURL: "/",
      /**
       * remember the user session after the browser is closed. 
       * @default true
       */
      rememberMe: false
    }, {
      onRequest: (ctx) => {
          //show loading
          console.log("ctx ----", ctx)
      },
      onSuccess: (ctx) => {
          //redirect to the dashboard or sign in page
          console.log("ctx ---- 72", ctx)
          toast("Successfully logged in")
      },
      onError: (ctx) => {
          // display the error message
          console.log("ctx ----", ctx)
          toast(ctx.error.message)
          // alert(ctx.error.message);
      },
    }
  )

  console.log("data", data)
  console.log("error", error)

    return;

    // try {
    //   const res = await axios.post("/api/signin", {
    //     email: data.email,
    //     password: data.password,
    //   });

    //   const result = res;
    //   console.log("res", res)

    //   if (res.status === 200) {
    //     setCookie("authToken", res.data.token)
    //     setCookie("userData", JSON.stringify(res.data.user))
    //     toast(res.data.message)
    //     router.push("/")
    //     reset()
    //     return;
    //   }
    //   toast(res.data.message)

    //   console.log("User created:", result);
    // } catch (err) {
    //   console.error(err);
    //   toast.error("Something went wrong")
    // }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="dark:bg-gray-900/40 bg-gray-900  duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-xl bg-linear-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-gradient">
            Log In into your account
          </CardTitle>
          <CardDescription className="text-white">
            Enter your email below to Log In your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>

              <Field className="text-white!">
                <FieldLabel htmlFor="email" className="text-white">Email</FieldLabel>
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email",
                    },
                  })}
                  type="email"
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <p className="text-red-500/90 text-xs">
                    {errors.email.message}
                  </p>
                )}
              </Field>
              <Field>
                <Field className="text-white!">
                  <Field>
                    <FieldLabel htmlFor="password" className="text-white">Password</FieldLabel>
                    <Input
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Minimum 6 characters",
                        },
                      })}
                      type="password"
                    />
                    {errors.password && (
                      <p className="text-red-500/90 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={"bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white duration-300 transition-colors"} >
                  {isSubmitting ?
                    <><Loader className="animate-spin h-4 w-4" /> logging... </>
                    :
                    "Submit"
                  }
                </Button>
                <FieldDescription className="text-center text-xs">
                  does not have an account? <Link href="/signup" className="cursor-pointer hover:text-white!"> Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
