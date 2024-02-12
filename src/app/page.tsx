import SignInButton2 from "@/components/SignInButton2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FcGoogle } from 'react-icons/fc'
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();  if (session?.user) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-screen justify-center items-center flex-col bg-[#f1d9d8] dark:bg-[#070616]  ">
        <div className="text-center my-[1rem] md:hidde">
            <h1 className="text-4xl font-bold  ">Sign up now</h1>
            <p className="text-sm pt-3 max-w-[70%] mx-auto">Quizard is a platform for creating quizzes using AI!. Get started by
            loggin in below!</p>
        </div>
      <Card className="w-full md:w-[40%] dark:bg-white overflow-hidden rounded-3xl">
      <section className="bg-white dark:bg-white py-12">
    <div className=" flex items-center justify-center  px-6 mx-auto">
        <form className="w-full max-w-md flex flex-col gap-5  ">
            <div className="">
                <label htmlFor="" className="text-black ">Email</label>
                <div className="relative flex items-center mt-1">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </span>

                    <input type="email" className=" w-full py-3 text-black bg-white border rounded-lg px-11 dark:text-black" placeholder="Email address" />
                </div>
            </div>

            <div className="">
                <label htmlFor="" className="text-black ">Password</label>
                <div className="relative flex items-center mt-1">
                    <span className="absolute">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </span>

                    <input type="password" className="block w-full px-10 py-3 text-black bg-white border rounded-lg dark:text-black dark:border-black " placeholder="Password" />
                </div>
            </div>

            <div className="mt-6">
                <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                    Sign in
                </button>

                <p className="mt-4 text-center text-black ">or sign in with</p>

                <SignInButton2 />

                <div className="mt-6 text-center ">
                    <a href="#" className="text-sm text-blue-500 hover:underline dark:text-blue-400">
                        Don’t have an account yet? Sign up
                    </a>
                </div>
            </div>
        </form>
    </div>
</section>
        {/* <CardHeader>
          <CardTitle>Welcome to Quizzzy 🔥!</CardTitle>
          <CardDescription>
            Quizzzy is a platform for creating quizzes using AI!. Get started by
            loggin in below!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInButton text="Sign In with Google" />
        </CardContent> */}
      </Card>
    </div>
  );
}
