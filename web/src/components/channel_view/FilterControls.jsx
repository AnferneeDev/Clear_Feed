'use client';

import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';

export function FilterControls({
  sortBy,
  setSortBy,
  durationRange,
  setDurationRange,
  showSlider = true,
}) {
  const [localRange, setLocalRange] = useState(durationRange);

  useEffect(() => {
    setLocalRange(durationRange);
  }, [durationRange]);

  const formatLabel = (value) => {
    return value >= 60 ? 'Any' : `${value} min`;
  };

  return (
    // --- UPDATED: Removed justify-between/justify-end ---
    <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
      <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
        <span className="text-sm font-medium text-muted-foreground">
          Sort By
        </span>
        <ToggleGroup
          type="single"
          value={sortBy}
          onValueChange={(value) => setSortBy(value || 'newest')}
          aria-label="Sort by"
        >
          <ToggleGroupItem value="newest" aria-label="Newest first">
            Newest
          </ToggleGroupItem>
          <ToggleGroupItem value="popular" aria-label="Popular">
            Popular
          </ToggleGroupItem>
          <ToggleGroupItem value="oldest" aria-label="Oldest first">
            Oldest
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {showSlider && (
        // --- UPDATED: Added sm:ml-auto to push this block to the right ---
        <div className="w-full sm:max-w-xs flex flex-col gap-2 sm:ml-auto">
          <div className="flex justify-between text-sm font-medium text-muted-foreground">
            <span>Duration:</span>
            <span>
              {formatLabel(localRange[0])} - {formatLabel(localRange[1])}
            </span>
          </div>
          <Slider
            value={localRange}
            onValueChange={setLocalRange}
            onValueCommit={setDurationRange}
            min={0}
            max={60}
            step={1}
          />
        </div>
      )}
    </div>
  );
}
