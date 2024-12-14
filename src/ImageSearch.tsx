import { useState } from "react";

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
      <div className="flex flex-row items-center mb-2">
        <input
          type="text"
          placeholder="Enter search content..."
          className="title-input w-70"
          onChange={(e) => {
            setInput(e.target.value);
          }}
        ></input>
        <button
          className="bg-gray-200 text-black hover:bg-gray-300 border-none py-[5px] px-[8px] rounded-[8px] cursor-pointer dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white ml-2 w-20 h-10"
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
                })
              );
            } catch (error: unknown) {
              console.error(error);
            }
          }}
        >
          Search
        </button>
      </div>
      {photos.length > 0 && (
        <div className="hidden-scrollbar flex snap-x gap-6 overflow-x-scroll p-5 border border-black rounded-xl bg-dotted-bg">
          {photos.map((photo, i) => (
            <div key={i} className="snap-start scroll-mx-6">
              <button
                type="button"
                className={
                  unsplashPhoto === photo
                    ? `w-36 h-20 relative overflow-hidden rounded-md border-2 border-gray-600 scale-105 duration-150`
                    : `w-36 h-20 relative overflow-hidden rounded-md hover:scale-105 duration-150`
                }
                onClick={() =>
                  onPhotoChange(unsplashPhoto === photo ? undefined : photo)
                }
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="border border-gray-900 object-cover w-full h-full rounded-md"
                />
              </button>
              <p className="text-center mt-2 text-xs">
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
