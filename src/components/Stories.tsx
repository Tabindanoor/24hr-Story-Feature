"use client";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem("stories")) || [];
    const validStories = savedStories.filter(
      (s) => Date.now() - s.timestamp < 24 * 60 * 60 * 1000
    );
    setStories(validStories);
    localStorage.setItem("stories", JSON.stringify(validStories));
  }, []);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newStory = { id: Date.now(), image: reader.result, timestamp: Date.now() };
      const updatedStories = [...stories, newStory];
      setStories(updatedStories);
      localStorage.setItem("stories", JSON.stringify(updatedStories));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const currentIndex = stories.findIndex((s) => s.id === currentStory.id);
    if (currentIndex < stories.length - 1) setCurrentStory(stories[currentIndex + 1]);
    else setCurrentStory(null);
  };

  const handlePrev = () => {
    const currentIndex = stories.findIndex((s) => s.id === currentStory.id);
    if (currentIndex > 0) setCurrentStory(stories[currentIndex - 1]);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      {/* Story Bar */}
      <div className="flex items-center gap-4 overflow-x-auto p-2">
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <div className="flex flex-col items-center">
            <PlusCircleIcon className="w-14 h-14 text-blue-500 hover:text-blue-600" />
            <span className="text-sm">Add Story</span>
          </div>
        </label>

        {stories.map((story) => (
          <div
            key={story.id}
            onClick={() => setCurrentStory(story)}
            className="rounded-full border-2 border-blue-500 overflow-hidden w-16 h-16 cursor-pointer"
          >
            <img src={story.image} alt="story" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Story Viewer */}
      {currentStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <button
            onClick={() => setCurrentStory(null)}
            className="absolute top-4 right-6 text-white text-xl"
          >
            ✕
          </button>
          <button
            onClick={handlePrev}
            className="absolute left-4 text-white text-3xl"
          >
            ‹
          </button>
          <img
            src={currentStory.image}
            alt="story"
            className="max-h-[80vh] max-w-[90vw] rounded-lg"
          />
          <button
            onClick={handleNext}
            className="absolute right-4 text-white text-3xl"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
