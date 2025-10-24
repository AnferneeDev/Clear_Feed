'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Heart, Copy, Check, Wallet, User, CreditCard } from 'lucide-react';
import { ShinyButton } from '@/components/magicui/shiny-button';

export function SupportButton() {
  // State to track which value has been copied
  const [copiedValue, setCopiedValue] = useState(null);

  /**
   * Handles copying text to the clipboard and provides user feedback.
   * @param {string} value - The text value to copy.
   * @param {string} title - An identifier for the copied item (e.g., 'PayPal', 'Crypto').
   */
  const handleCopy = (value, title) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopiedValue(title); // Set which item was copied
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedValue(null);
        }, 2000);
      })
      .catch((err) => {
        // Handle errors (e.g., clipboard permissions denied)
        console.error('Failed to copy text: ', err);
        // You could show an error message to the user here
      });
  };

  // Helper component for rendering each donation row
  const DonationRow = ({ title, value, description, icon, isLink }) => {
    const Icon = icon;
    const isCopied = copiedValue === title;

    return (
      <div className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold">{title}</span>
            {isLink ? (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline truncate"
                title={value}
              >
                {value.replace('https://www.', '')}
              </a>
            ) : (
              <span
                className="text-sm text-muted-foreground truncate"
                title={value}
              >
                {value}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground/80 font-semibold">
                {description}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleCopy(value, title)}
          className="flex-shrink-0"
        >
          {isCopied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* removed external margins and ensured no wrapping */}
        <ShinyButton className="flex items-center gap-2 whitespace-nowrap bg-[var(--primarius)]">
          <Heart className="h-5 w-5 text-foreground" />
          <span className="font-bold hidden sm:flex">Support me</span>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Support Clear Feed
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Your support helps keep this project running and ad-free.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-8">
          {/* Donation Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-center">
              Donation Methods
            </h3>
            <div className="space-y-3 px-2">
              <DonationRow
                title="PayPal"
                value="https://www.paypal.me/AnferneeAnfernee123"
                icon={CreditCard}
                isLink={true}
              />
              <DonationRow
                title="Binance ID"
                value="210089781"
                icon={User}
                isLink={false}
              />
              <DonationRow
                title="Crypto (BEP20)"
                value="0xd798d44feb763e75870c925f26da2661e4fb9f5e"
                description="Supports: USDT, BTC, ETH, XRP"
                icon={Wallet}
                isLink={false}
              />
            </div>
          </div>

          {/* Contact & Feedback Section */}
          <div className="space-y-2 text-center">
            <h3 className="font-semibold text-lg">Feedback & Bug Reports</h3>
            <p className="text-sm text-muted-foreground px-4">
              The best way you can support this project is by reporting bugs and
              sending your feedback. Help me make Clear Feed better for
              everyone.
            </p>
            {/* You can add a mailto link here later */}
            <span className="text-sm font-medium">
              clearfeed.contact@gmail.com
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
