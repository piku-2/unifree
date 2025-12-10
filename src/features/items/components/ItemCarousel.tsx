import useEmblaCarousel from 'embla-carousel-react';
import { useEffect, useState } from 'react';

type ItemCarouselProps = {
  images: string[];
};

export function ItemCarousel({ images }: ItemCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square flex items-center justify-center border border-border bg-muted rounded-lg">
        <div className="w-32 h-32 border-2 border-primary/30 rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] aspect-square min-w-0 relative" key={index}>
              <img
                src={src}
                alt={`Item image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbs / Dots */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            className={`flex-shrink-0 w-16 h-16 border rounded overflow-hidden transition-all ${
              selectedIndex === index ? 'border-primary ring-2 ring-primary/30' : 'border-border opacity-70 hover:opacity-100'
            }`}
          >
            <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
