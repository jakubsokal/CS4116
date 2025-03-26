"use client";

import LandingPage from "../pages/LandingPage";
import ProfileCompletionDialog from "@/components/ProfileCompletionDialog";
import { useEffect, useState } from "react";
import { isBusinessProfileIncomplete } from "@/utils/businessProfileCheck";
import useSessionCheck from "@/utils/hooks/useSessionCheck";
import { supabase } from "@/utils/supabase/client";

export default function Page() {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [businessId, setBusinessId] = useState(null);
  const { session, loading } = useSessionCheck();

  useEffect(() => {
    const checkBusinessProfile = async () => {
      if (!loading && session?.user) {
        try {
          const { data: userData } = await supabase
            .from('users')
            .select('user_id, permission')
            .eq('uuid', session.user.id)
            .single();

          if (userData && userData.permission === 2) { 
            const { data: businessData } = await supabase
              .from('business')
              .select('business_id')
              .eq('user_id', userData.user_id)
              .single();

            if (businessData) {
              setBusinessId(businessData.business_id);
              const isIncomplete = await isBusinessProfileIncomplete(businessData.business_id);
              setShowProfileDialog(isIncomplete);
            }
          }
        } catch (error) {
          console.error('Error checking business profile:', error);
        }
      }
    };

    checkBusinessProfile();
  }, [session, loading]);

  return (
    <>
      <LandingPage />
      {businessId && (
        <ProfileCompletionDialog
          open={showProfileDialog}
          onClose={() => setShowProfileDialog(false)}
          businessId={businessId}
        />
      )}
    </>
  );
}