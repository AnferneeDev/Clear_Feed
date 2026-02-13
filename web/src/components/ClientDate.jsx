'use client';
import { useState, useEffect } from 'react';

export default function ClientDate({ date, options }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (date) {
      setFormattedDate(new Date(date).toLocaleDateString('en-US', options));
    }
  }, [date, options]);

  // Render a placeholder (or nothing) on the server, and the date on the client
  // Using a non-breaking space to prevent layout shift if desired, or just null
  if (!formattedDate) return null; 

  return <>{formattedDate}</>;
}
