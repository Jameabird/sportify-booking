"use client";
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useRouter } from "next/navigation";
import TopBar_Owner from '@components/Topbar_Owner';

const SendMessages = () => {
  const router = useRouter();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (recipient && message) {
      // Handle sending the message
      alert(`Message sent to ${recipient}: ${message}`);
      router.push('/owner'); // Navigate back to owner home
    }
  };

  return (
    <>
      <TopBar_Owner textColor={"black"} />
      <Box sx={{ padding: 4, maxWidth: 600, margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Send a Message
        </Typography>
        <TextField
          label="Section"
          fullWidth
          sx={{ marginBottom: 2 }}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <TextField
          label="Message"
          fullWidth
          multiline
          rows={6}
          sx={{ marginBottom: 2 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSend}
          disabled={!recipient || !message}
        >
          Send Message
        </Button>
      </Box>
    </>
  );
};

export default SendMessages;
