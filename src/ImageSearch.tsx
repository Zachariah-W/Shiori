import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export type UnsplashImage = {
  urls: {
    regular: string;
    small: string;
  };
  links: {
    download_location: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
};

const ImageSearch = ({
  unsplashPhoto,
  onPhotoChange,
}: {
  unsplashPhoto: UnsplashImage | undefined;
  onPhotoChange: (unsplashPhoto: UnsplashImage | undefined) => void;
}) => {
  const [input, setInput] = useState<string>();
  const [photos, setPhotos] = useState<UnsplashImage[]>([]);

  return (
    <div>
      <div className="mb-2 flex flex-row items-center justify-between gap-1.5">
        <input
          type="text"
          placeholder="Enter search content..."
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button
          className="cursor-pointer items-center rounded-full border border-black p-1.5 font-semibold transition-all duration-500 hover:bg-neutral-800 hover:text-neutral-200 dark:border-neutral-300 dark:hover:bg-neutral-300 dark:hover:text-black"
          onClick={async (e) => {
            e.preventDefault();
            const url = `https://api.unsplash.com/search/photos?page=1&query=${input}&orientation=landscape&per_page=5`;
            const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
            try {
              const response = await fetch(url, {
                method: "GET",
                headers: {
                  Authorization: `Client-ID ${accessKey}`,
                },
              });
              if (!response.ok) {
                throw new Error(`${response.status}`);
              }
              const data = await response.json();
              setPhotos(
                data.results.map((result: UnsplashImage) => {
                  return {
                    urls: {
                      regular: result.urls.regular,
                      small: result.urls.small,
                    },
                    links: {
                      download_location: result.links.download_location,
                    },
                    alt_description: result.alt_description,
                    user: {
                      name: result.user.name,
                      links: {
                        html: result.user.links.html,
                      },
                    },
                  };
                }),
              );
            } catch (error: unknown) {
              console.error(error);
            }
          }}
        >
          <FiSearch />
        </button>
      </div>
      {photos.length > 0 && (
        <div className="hidden-scrollbar bg-dotted-bg mb-2 flex snap-x gap-6 overflow-x-scroll rounded-xl border border-black p-5">
          {photos.map((photo, i) => (
            <div key={i} className="snap-start scroll-mx-6">
              <button
                type="button"
                className={
                  unsplashPhoto === photo
                    ? `relative h-20 w-36 scale-105 overflow-hidden rounded-md border-2 border-gray-600 duration-150`
                    : `relative h-20 w-36 overflow-hidden rounded-md duration-150 hover:scale-105`
                }
                onClick={() =>
                  onPhotoChange(unsplashPhoto === photo ? undefined : photo)
                }
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="h-full w-full rounded-md border border-gray-900 object-cover"
                />
              </button>
              <p className="mt-2 text-center text-xs">
                Photo By {photo.user.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSearch;
