import { Image as ImageIcon } from 'lucide-react';

interface PlaceholderImageProps {
  className?: string;
  text?: string;
}

export function PlaceholderImage({ className = '', text = 'Image Placeholder' }: PlaceholderImageProps) {
  return (
    <div className={`flex flex-col items-center justify-center bg-surface-muted border-2 border-dashed border-border rounded-lg text-content-muted ${className}`}>
      <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
