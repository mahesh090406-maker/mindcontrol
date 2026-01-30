import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { adminId, password } = body;

        // Hardcoded secure credentials (as per plan/demo)
        if (adminId === "admin" && password === "mindconnect") {

            const response = NextResponse.json({ success: true });

            // Set cookie on the response object
            response.cookies.set("admin_session", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 1 day
                path: "/",
            });

            return response;
        }

        return NextResponse.json(
            { error: "Invalid credentials. Access denied." },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
