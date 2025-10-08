import Stories from "@/components/Stories";

export default function Home() {
  return (
    <div >
       <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-4">My Stories</h1>
      <Stories />
    </div>
    </div>
  );
}
