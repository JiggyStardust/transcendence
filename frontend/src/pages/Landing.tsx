export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-500 to-indigo-700 text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to Transcendence</h1>
      <a
        href="/game"
        className="px-6 py-3 bg-white text-blue-700 rounded-xl hover:bg-gray-200"
      >
        Login or SignUp
      </a>
    </div>
  );
}

