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
    <div className="flex flex-col sm:flex-row gap-6 items-center mb-8">
      <div className="flex flex-col items-center gap-2 w-full sm:w-auto bg-gray-700/5 rounded-lg dark:bg-gray-900/40">
        <ToggleGroup
          type="single"
          value={sortBy}
          onValueChange={(value) => setSortBy(value || 'newest')}
          aria-label="Sort by"
        >
          <ToggleGroupItem
            value="newest"
            aria-label="Newest first"
            className="data-[state=on]:bg-neutral-200 data-[state=on]:text-accent-foreground"
          >
            Newest
          </ToggleGroupItem>
          <ToggleGroupItem
            value="popular"
            aria-label="Popular"
            className="data-[state=on]:bg-neutral-200 data-[state=on]:text-accent-foreground"
          >
            Popular
          </ToggleGroupItem>
          <ToggleGroupItem
            value="oldest"
            aria-label="Oldest first"
            className="data-[state=on]:bg-neutral-200 data-[state=on]:text-accent-foreground"
          >
            Oldest
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {showSlider && (
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
