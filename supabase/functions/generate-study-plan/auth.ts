/**
 * Authentication utilities for generate-study-plan Edge Function
 * Copied from generate-quiz pattern
 */

import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

export interface AuthResult {
    success: boolean;
    userId?: string;
    supabase?: SupabaseClient;
    user?: {
        id: string;
        email?: string;
    };
    error?: string;
}

export async function validateAuth(req: Request): Promise<AuthResult> {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return { success: false, error: "Missing authorization header" };
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } },
    );

    const {
        data: { user },
        error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
        return { success: false, error: "Invalid or expired token" };
    }

    return {
        success: true,
        userId: user.id,
        user,
        supabase: supabaseClient,
    };
}
