import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";

import TodoScreen from "./screens/TodoScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";

import { Id } from "./convex/_generated/dataModel";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function App() {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  let content;

  if (userId) {
    content = <TodoScreen userId={userId} />;
  } else if (isLogin) {
    content = (
      <LoginScreen
        onLogin={(id: Id<"users">) => setUserId(id)}
        goToSignup={() => setIsLogin(false)}
      />
    );
  } else {
    content = (
      <SignupScreen goToLogin={() => setIsLogin(true)} />
    );
  }

  return (
    <ConvexProvider client={convex}>
      {content}
    </ConvexProvider>
  );
}