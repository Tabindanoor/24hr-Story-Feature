"use client";
import { useEffect, useState, useRef, ChangeEvent } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useSwipeable } from "react-swipeable";

interface Story {
  id: number;
  image: string;
  timestamp: number;
}

export default function Stories() {
  // const [stories, setStories] = useState<Story[]>([]);
  // const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  // const [progress, setProgress] = useState<number[]>([]);
  // const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedStories: Story[] = JSON.parse(localStorage.getItem("stories") || "[]");
    const validStories = savedStories.filter(
      (s) => Date.now() - s.timestamp < 24 * 60 * 60 * 1000
    );
    setStories(validStories);
    setProgress(new Array(validStories.length).fill(0));
    localStorage.setItem("stories", JSON.stringify(validStories));
  }, []);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newStory: Story = {
        id: Date.now(),
        image: reader.result as string,
        timestamp: Date.now(),
      };
      const updatedStories = [...stories, newStory];
      setStories(updatedStories);
      setProgress(new Array(updatedStories.length).fill(0));
      localStorage.setItem("stories", JSON.stringify(updatedStories));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (currentIndex === null) return;
    setProgress((prev) => {
      const updated = [...prev];
      updated[currentIndex] = 0;
      return updated;
    });

    // let progressValue = 0;
    // intervalRef.current = setInterval(() => {
    //   progressValue += 2; 
    //   setProgress((prev) => {
    //     const updated = [...prev];
    //     updated[currentIndex!] = progressValue;
    //     return updated;
    //   });
    //   if (progressValue >= 100) {
    //     clearInterval(intervalRef.current!);
    //     handleNext();
    //   }
    // }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex === null) return;
    if (currentIndex < stories.length - 1) setCurrentIndex(currentIndex + 1);
    else setCurrentIndex(null);
  };

  const handlePrev = () => {
    if (currentIndex === null) return;
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <div className="flex items-center gap-4 overflow-x-auto p-2">
        <label className="cursor-pointer flex flex-col items-center">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <PlusCircleIcon className="w-14 h-14 text-blue-500 hover:text-blue-600" />
          <span className="text-sm">Add Story</span>
        </label>

        {stories.map((story, idx) => (
          <div key={story.id} className="relative">
            <div
              onClick={() => setCurrentIndex(idx)}
              className="rounded-full border-2 border-blue-500 overflow-hidden w-16 h-16 cursor-pointer"
            >
              <img src={story.image} alt="story" className="w-full h-full object-cover" />
            </div>

            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-1 bg-blue-500"
                style={{ width: `${progress[idx]}%`, transition: "width 0.1s linear" }}
              ></div>
            </div>
          </div>
        ))}
      </div>t

      {currentIndex !== null && (
        <div
          {...swipeHandlers}
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50"
        >
          <div className="absolute top-0 left-0 w-full flex space-x-1 p-2">
            {stories.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
              >
                <div
                  className={`h-1 ${
                    i < currentIndex ? "bg-blue-500 w-full" : "bg-blue-500"
                  }`}
                  style={{
                    width:
                      i === currentIndex ? `${progress[currentIndex]}%` : i < currentIndex ? "100%" : "0%",
                    transition: "width 0.1s linear",
                  }}
                ></div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex(null)}
            className="absolute top-4 right-6 text-white text-xl"
          >
            ✕
          </button>

          <img
            src={stories[currentIndex].image}
            alt="story"
            className="max-h-[80vh] max-w-[90vw] rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
