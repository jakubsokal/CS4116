"use client";

import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import "@/styles/ProfileCompletionDialog.css";

const ProfileCompletionDialog = ({ open, onClose, businessId }) => {
  const [formData, setFormData] = useState({
    description: "",
    open_hour: "",
    close_hour: "",
    phone_number: "",
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
      const response = await fetch('/api/business-profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          ...formData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

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
            name="phone_number"
            label="Phone Number"
            type="tel"
            fullWidth
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="profile-text-field"
            InputProps={{
              className: 'profile-input'
            }}
            InputLabelProps={{
              className: 'profile-label'
            }}
            placeholder="e.g., +353 123 456 789"
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
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </DialogContent>
        <DialogActions className="profile-dialog-actions">
          <Button 
            onClick={onClose} 
            className="profile-cancel-button"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="profile-submit-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProfileCompletionDialog; 