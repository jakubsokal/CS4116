import userCheck from "@/api/user/userCheck";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const useBusinessSessionCheck = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [business, setBusiness] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
        const sessionResult = await userCheck();

    if (!sessionResult || sessionResult.loggedIn === false) {
        setStatus(401);
        setLoading(false);
        return;
    }

    const currentSession = sessionResult.session;
    const user_id = currentSession.user_id;
    setSession(currentSession);
    setStatus(200);

    try {

        const { data: userData, error: userError } = await supabase
        .from("users")
        .select("business_id")
        .eq("user_id", user_id)
        .single();

        if (userError || !userData?.business_id) {
        throw new Error("business_id not found for user.");
        }

        const business_id = userData.business_id;

        const bizRes = await fetch(`/api/business/getBusinessDetails?businessId=${business_id}`);
        const bizResult = await bizRes.json();

        if (bizResult?.data) {
        setBusiness(bizResult.data);
        }

    } catch (err) {
        console.error("Error fetching business session details:", err.message);
    }

    setLoading(false);
    };

    checkSession();
}, []);

return { session, business, loading, status };
};

export default useBusinessSessionCheck;