// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url, method, headers, body } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Invalid URL. Please provide a valid URL." },
        { status: 400 }
      );
    }

    const upperMethod = (method || "GET").toUpperCase();
    const methodHasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(upperMethod);

    const cleanedHeaders: Record<string, string> = {};
    if (headers && typeof headers === "object") {
      Object.keys(headers).forEach((key) => {
        const trimmedKey = key.trim(); // حذف فاصله‌های اضافی
        if (trimmedKey && headers[key]) {
          cleanedHeaders[trimmedKey] = headers[key];
        }
      });
    }

    const fetchOptions: RequestInit = {
      method: upperMethod,
      headers: cleanedHeaders,
    };

    if (methodHasBody && typeof body === "string" && body.length > 0) {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const responseBody = await response.text();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to reach target server: ${message}` },
      { status: 502 }
    );
  }
}