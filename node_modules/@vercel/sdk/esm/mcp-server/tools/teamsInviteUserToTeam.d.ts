import * as z from "zod/v3";
import { ToolDefinition } from "../tools.js";
declare const args: {
    request: z.ZodUnion<[z.ZodUndefined, z.ZodEffects<z.ZodNull, never, null>, z.ZodArray<z.ZodType<import("../../models/inviteusertoteamop.js").InviteUserToTeamRequestBody, z.ZodTypeDef, unknown>, "many">]>;
};
export declare const tool$teamsInviteUserToTeam: ToolDefinition<typeof args>;
export {};
//# sourceMappingURL=teamsInviteUserToTeam.d.ts.map