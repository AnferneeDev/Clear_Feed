'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Heart } from 'lucide-react';
import { ShinyButton } from '@/components/magicui/shiny-button';

// Placeholder for a donation method
function DonationOption({ name }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
        {/* Placeholder for an icon */}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

export function SupportButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* removed external margins and ensured no wrapping */}
        <ShinyButton className="flex items-center gap-2 whitespace-nowrap bg-[var(--primarius)]">
          <Heart className="h-5 w-5 text-foreground" />
          <span className="font-bold hidden sm:flex">Support me</span>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
            <div className="flex justify-center gap-4 pt-2">
              <DonationOption name="Ko-fi" />
              <DonationOption name="PayPal" />
              <DonationOption name="Crypto" />
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
            clearfeed.contact@gmail.com
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
