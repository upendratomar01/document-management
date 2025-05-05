import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (data: string) => {
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      let currentStatus = "";

      const interval = setInterval(async () => {
        const doc = await prisma.document.findUnique({
          where: { id },
          select: { ingestionStatus: true },
        });

        if (!doc) {
          sendEvent("error");
          clearInterval(interval);
          controller.close();
          return;
        }

        if (doc.ingestionStatus !== currentStatus) {
          currentStatus = doc.ingestionStatus!;
          sendEvent(currentStatus);
        }

        if (["COMPLETED", "FAILED"].includes(doc.ingestionStatus!)) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
