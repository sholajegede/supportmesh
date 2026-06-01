import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

type KindeEventData = {
  user: {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string | null;
    is_password_reset_requested: boolean;
    is_suspended: boolean;
    organizations: {
      code: string;
      permissions: string | null;
      roles: string | null;
    }[];
    phone?: string | null;
    username?: string | null;
    image_url?: string | null;
  };
};

type KindeEvent = {
  type: string;
  data: KindeEventData;
};

const http = httpRouter();

const handleKindeWebhook = httpAction(async (ctx, request) => {
  const event = await validateKindeRequest(request);
  if (!event) {
    return new Response("Invalid request", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
      await ctx.runMutation(internal.users.createUserKinde, {
        kindeId: event.data.user.id,
        email: event.data.user.email,
        firstName: event.data.user.first_name || "",
        lastName: event.data.user.last_name || ""
      });
      break;
    {/** 
    case "user.updated":
      const existingUserOnUpdate = await ctx.runQuery(
        internal.users.getUserKinde,
        { kindeId: event.data.user.id }
      );

      if (existingUserOnUpdate) {
        await ctx.runMutation(internal.users.updateUserKinde, {
          kindeId: event.data.user.id,
          email: event.data.user.email,
          username: event.data.user.first_name || ""
        });
      } else {
        console.warn(
          `No user found to update with kindeId ${event.data.user.id}.`
        );
      }
      break;
    */}
    case "user.deleted":
      const userToDelete = await ctx.runQuery(internal.users.getUserKinde, {
        kindeId: event.data.user.id,
      });

      if (userToDelete) {
        await ctx.runMutation(internal.users.deleteUserKinde, {
          kindeId: event.data.user.id,
        });
      } else {
        console.warn(
          `No user found to delete with kindeId ${event.data.user.id}.`
        );
      }
      break;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
});

// ===== JWT Validation =====
async function validateKindeRequest(request: Request): Promise<KindeEvent | null> {
  try {
    if (request.headers.get("content-type") !== "application/jwt") {
      console.error("Invalid Content-Type. Expected application/jwt");
      return null;
    }

    const token = await request.text(); // JWT is sent as raw text in the body.
    const JWKS_URL = `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`;
    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));

    const { payload } = await jwtVerify(token, JWKS);

    // Ensure payload contains the expected properties
    if (
      typeof payload === "object" &&
      payload !== null &&
      "type" in payload &&
      "data" in payload
    ) {
      return {
        type: payload.type as string,
        data: payload.data as KindeEventData,
      };
    } else {
      console.error("Payload does not match the expected structure");
      return null;
    }
  } catch (error) {
    console.error("JWT verification failed", error);
    return null;
  }
}

http.route({
  path: "/kinde",
  method: "POST",
  handler: handleKindeWebhook,
});

export default http;