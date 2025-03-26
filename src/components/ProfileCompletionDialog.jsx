"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { supabase } from "@/utils/supabase/client";
import "@/styles/ProfileCompletionDialog.css";

const ProfileCompletionDialog = ({ open, onClose, businessId }) => {
  const [formData, setFormData] = useState({
    description: "",
    open_hour: "",
    close_hour: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('business')
        .update({
          description: formData.description,
          open_hour: formData.open_hour,
          close_hour: formData.close_hour
        })
        .eq('business_id', businessId);

      if (updateError) throw updateError;

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        className: 'profile-dialog-paper'
      }}
    >
      <DialogTitle className="profile-dialog-title">
        Complete Your Business Profile
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="profile-dialog-content">
          <TextField
            autoFocus
            margin="dense"
            name="description"
            label="Business Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
            required
            className="profile-text-field"
            InputProps={{
              className: 'profile-input'
            }}
            InputLabelProps={{
              className: 'profile-label'
            }}
          />
          <TextField
            margin="dense"
            name="open_hour"
            label="Opening Hours"
            type="time"
            fullWidth
            value={formData.open_hour}
            onChange={handleChange}
            required
            className="profile-text-field"
            InputProps={{
              className: 'profile-input'
            }}
            InputLabelProps={{
              className: 'profile-label',
              shrink: true
            }}
            inputProps={{ step: 60 }}
          />
          <TextField
            margin="dense"
            name="close_hour"
            label="Closing Hours"
            type="time"
            fullWidth
            value={formData.close_hour}
            onChange={handleChange}
            required
            className="profile-text-field"
            InputProps={{
              className: 'profile-input'
            }}
            InputLabelProps={{
              className: 'profile-label',
              shrink: true
            }}
            inputProps={{ step: 60 }}
          />
          {error && <p className="profile-error">{error}</p>}
        </DialogContent>
        <DialogActions className="profile-dialog-actions">
          <Button onClick={onClose} className="profile-cancel-btn">
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            className="profile-submit-btn"
          >
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileCompletionDialog; 