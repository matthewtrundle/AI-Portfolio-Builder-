import Image from "next/image";

export default function TestImages() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Test 1: Direct img tag</h2>
          <img 
            src="/images/biff01_Professional_photography_of_confident_mid-30s_professi_588eaf31-dfba-4548-953a-7e7ca0dfec09_3.png" 
            alt="Test image" 
            className="w-64 h-64 object-cover rounded"
          />
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Test 2: Next.js Image component</h2>
          <div className="relative w-64 h-64">
            <Image
              src="/images/biff01_Professional_photography_of_confident_mid-30s_professi_588eaf31-dfba-4548-953a-7e7ca0dfec09_3.png"
              alt="Test image"
              fill
              className="object-cover rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}