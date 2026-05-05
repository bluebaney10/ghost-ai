import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getLiveblocks, getCursorColor } from "@/lib/liveblocks";
import { getProjectWithAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { room } = await request.json();
  const projectId = room as string;

  const identity = {
    userId: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? null,
  };

  const project = await getProjectWithAccess(projectId, identity);
  if (!project) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await getLiveblocks().getOrCreateRoom(projectId, {
    defaultAccesses: ["room:write"],
  });

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.emailAddresses[0]?.emailAddress ||
    "Anonymous";

  const { status, body } = await getLiveblocks().identifyUser(
    { userId: user.id, groupIds: [] },
    {
      userInfo: {
        displayName,
        avatarUrl: user.imageUrl,
        cursorColor: getCursorColor(user.id),
      },
    }
  );

  return new Response(body, { status });
}
