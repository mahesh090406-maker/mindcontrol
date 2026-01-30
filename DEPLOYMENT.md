# How to Deploy MindConnect Online

Yes, you can run this application online! The best platform for Next.js applications is **Vercel** (the creators of Next.js).

## Prerequisite: GitHub
1.  Create a repository on [GitHub](https://github.com).
2.  Push this project code to that repository.

## Method 1: Deploy with Vercel (Easiest)
1.  Go to [Vercel.com](https://vercel.com) and sign up (you can use your GitHub account).
2.  Click **"Add New..."** > **"Project"**.
3.  Select your `MindConnect` repository from GitHub.
4.  Click **Deploy**.
    *   Vercel detects it is a Next.js app automatically.
    *   It will build and give you a public URL (e.g., `mindconnect.vercel.app`).

## Important Notes for Online Use
1.  **HTTPS**: Vercel provides HTTPS automatically. This is **required** for the Web Serial API (connecting the sensor) to work in Chrome.
2.  **Simulation Mode**: The "Manual Reading" slider we added will work perfectly online, allowing you to demo the app to anyone, anywhere.
3.  **Environment Variables**: If you use the AI features, you will need to add your `GEMINI_API_KEY` in the Vercel Project Settings (under "Environment Variables").

## Alternative: Netlify
You can also use Netlify by dragging and dropping your "build" folder, but Vercel is smoother for Next.js.
