'use client'

import { signIn } from 'next-auth/react'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'

type Props = {}

const SignInButton2 = (props: Props) => {
  return (
    <button type='button' onClick={() => {
        signIn("google").catch(console.error);
      }} className="flex gap-2 items-center justify-center px-6 py-3 mt-4 text-black transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-black hover:bg-gray-50 w-full"> <FcGoogle className="text-3xl" /> Sign in with Google </button>
  )
}

export default SignInButton2