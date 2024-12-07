import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen text-center">
      <div className="bg-gray-800 rounded-md p-4 shadow-lg shadow-white hover:shadow-2xl hover:shadow-purple-600">
        <h1>TODO APPLICATION</h1>
        <p>Hello world</p>
        <UserButton />
      </div>
    </main>
  );
}
