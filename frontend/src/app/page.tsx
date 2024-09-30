'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
      <div className="flex h-screen justify-center items-center">
          <div
              className="flex flex-col justify-center items-center p-8 border-4 border-gray-600 w-1/4 h-1/2 rounded-2xl">
              <button
                  className="text-2xl p-4 rounded-xl w-56 border-2 border-gray-600 group transition duration-300 hover:bg-gray-300"
                  onClick={() => {
                      router.push("/login")
                  }}>
                  INICIAR SESIÓN
                  <span
                      className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-600"></span>
              </button>
              <p className="text-2xl p-4">O</p>
              <button
                  className="text-2xl p-4 rounded-xl w-56 border-2 border-gray-600 group transition duration-300 hover:bg-gray-300"
                  onClick={() => {
                      router.push("/register")
                  }}>
                  REGISTRARSE
                  <span
                      className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gray-600"></span>
              </button>
          </div>
      </div>
  );
}
