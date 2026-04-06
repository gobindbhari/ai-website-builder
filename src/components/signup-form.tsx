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
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};



export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {
    register,
    handleSubmit,
    watch,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const router = useRouter()

  const password = watch("password");

  const onSubmit = async (formData: FormData) => {

    console.log("data:", formData)
    const { email, password, userName } = formData
    // manual confirm password check
    if (formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }


    // name: userName,
    const { data, error } = await authClient.signUp.email({
      name: userName,
      email: email,
      password: password,
      callbackURL: "/",
    }, {
      onRequest: (ctx) => {
        //show loading
        console.log("ctx ---- 76", ctx)
      },
      onSuccess: (ctx) => {
        //redirect to the dashboard or sign in page
        console.log("ctx ----", ctx)
        toast.success("Successfully created")
      },
      onError: (ctx) => {
        // display the error message
        console.log("ctx ---- 84", ctx)
        alert(ctx.error.message);
      },
    }
    )

    console.log("data", data)
    console.log("error", error)

    // try {
    //   const res = await axios.post("/api/signup", {
    //     email: data.email,
    //     password: data.password,
    //     userName: data.userName,
    //   });

    //   const result = res;
    //   console.log("res", res)

    //   if (res.status > 201) {
    //     toast(res.data.message);
    //     router.push("/signin");
    //     reset();
    //     return;
    //   }
    //   toast(res.data.message);
    //   // console.log("User created:", result);
    // } catch (err) {
    //   console.error(err);
    //   toast.error("Something went wrong")
    // }
  };


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="dark:bg-gray-900/40 bg-gray-900 text-white! duration-300">
        <CardHeader className="text-center">
          <CardTitle className="text-xl bg-linear-to-r from-orange-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-gradient">Create your account</CardTitle>
          <CardDescription className="text-white">
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">User Name</FieldLabel>
                <Input
                  {...register("userName", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters",
                    },
                  })}
                  type="text"
                  placeholder="John_Doe"
                />
                {errors.userName && (
                  <p className="text-red-500/90 text-xs">
                    {errors.userName.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
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
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...register("confirmPassword", {
                        required: "Confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      type="password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500/90 text-xs">
                        {errors.confirmPassword.message}
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
                    <><Loader className="animate-spin h-4 w-4" /> Creating... </>
                    :
                    "Create Account"
                  }
                </Button>
                <FieldDescription className="text-center text-xs">
                  Already have an account? <Link href="/signin" className="cursor-pointer hover:text-white!"> Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="">Terms of Service</a>{" "}
        and <a href="">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  )
}
