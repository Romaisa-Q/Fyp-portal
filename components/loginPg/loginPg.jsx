import { Card, CardContent } from "../ui/card";
import Image from "next/image"; 
import { LoginHeader } from "./loginHeader.jsx";
import { LoginForm } from "./loginForm.jsx";
import { COLLEGE_COLORS } from "../constants/color";

export default function LoginPage() {
  const handleLogin = (email, password, role) => {
    console.log("Login attempt:", { email, password, role });
    // Here you would typically redirect to the appropriate dashboard based on role
    // if (role === 'student') router.push('/student-dashboard')
    // if (role === 'teacher') router.push('/teacher-dashboard')
    // if (role === 'administrator') router.push('/admin-dashboard')
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/bg.jpg" 
          alt="College Campus"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <LoginHeader />
        <CardContent>
          <LoginForm onSubmit={handleLogin} />
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-0  left-1/2 transform -translate-x-1/2 z-10">
        <p
          className="text-sm text-center"
          style={{ color: COLLEGE_COLORS.lightGray }}
        >
          © 2025 College Portal. All rights reserved.
        </p>
      </div>
    </div>
  );
}
