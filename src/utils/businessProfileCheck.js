export const isBusinessProfileIncomplete = async (businessId) => {
  try {
    const response = await fetch(`/api/business-profile/check?businessId=${businessId}`);
    
    if (!response.ok) {
      throw new Error('Failed to check business profile');
    }

    const data = await response.json();
    return data.isIncomplete;
  } catch (error) {
    console.error('Error checking business profile:', error);
    return true; // Assume incomplete on error
  }
}; 