export const dynamic = "force-dynamic";

import ProfileSetupForm from "@/components/ProfileSetupForm";

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen py-8 px-4" style={{backgroundColor: "#E0E1DD"}}>
      <div className="max-w-lg mx-auto">
        <h1
          className="text-3xl font-bold mb-2"
          style={{color: "#0B3954", fontFamily: "var(--font-playfair)"}}
        >
          Set Up Your Profile
        </h1>
        <p className="mb-8" style={{color: "#7A6263"}}>
          Welcome to Nexus! Let's set up your profile before you get started.
        </p>
        <ProfileSetupForm />
      </div>
    </div>
  );
}