import React from 'react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex-1 flex flex-col items-center pl-0 md:pl-[10%] xl:pl-[20%]">
      <main class="flex flex-col items-center justify-center min-h-screen bg-background px-4">
        <div class="max-w-md text-center">
          <h1 class="text-2xl font-semibold text-foreground mb-4">
            Sorry, this page isn't available on NotInsta.
          </h1>
          <p class="text-gray-600 mb-6">
            The link you followed may be broken, or the page may have been removed.
          </p>
          <a 
            href="/" 
            class="inline-block px-6 py-2 text-blue-700 font-medium rounded-lg hover:cursor-pointer transition">
            Go back to NotInsta
          </a>
        </div>
      </main>
    </div>
  )
}

export default NotFound