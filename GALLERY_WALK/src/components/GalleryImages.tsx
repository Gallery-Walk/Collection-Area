import { useEffect, useState, useRef } from "react";
import { basicFetchOptions, fetchHandler } from "../utils/fetchData";
import { TOKEN } from "../configs";

interface ArtWork {
  title: string;
  date: string;
  category: string;
  _links: {
    thumbnail?: {
      href: string;
    };
  };
}

interface ArtWorksResponse {
  _embedded: { artworks: ArtWork[] };
  next: string | null;
  total_count: number;
}

const API_ARTWORK_URL = import.meta.env.VITE_API_ARTWORK_URL;

export default function GalleryImages() {
  const [artWorks, setArtWorks] = useState<ArtWork[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [nxtCursor, setNxtCursor] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [expand, setExpand] = useState<boolean>(false);

  const fetchArtworks = async (cursor: string | null = null) => {
    try {
      const url = cursor
        ? `${API_ARTWORK_URL}?cursor=${cursor}&size=200&total_count=1`
        : `${API_ARTWORK_URL}?size=200&total_count=1`;

      const options: RequestInit = {
        ...basicFetchOptions,
        headers: {
          ...basicFetchOptions.headers,
          "X-XAPP-Token": TOKEN,
        },
      };

      const [responseData, fetchError] = await fetchHandler<ArtWorksResponse>(url, options);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      if (responseData) {
        const fetchedArtworks = responseData._embedded.artworks;
        const fetchedCategories = Array.from(
          new Set(fetchedArtworks.map((artwork) => artwork.category))
        );

        setCategories((prev) => Array.from(new Set([...prev, ...fetchedCategories])));
        setArtWorks((prev) =>
          cursor ? [...prev, ...fetchedArtworks] : fetchedArtworks
        );
        setNxtCursor(responseData.next);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchArtworks(null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && nxtCursor) {
          fetchArtworks(nxtCursor);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [nxtCursor]);

  const filteredArtWorks = selectedCategory
    ? artWorks.filter((artwork) => artwork.category === selectedCategory)
    : artWorks;

  // const toggleExpand = () => {
  //   setExpand(!expand)
  // }

  return (
    <div>
      <h1>ArtWork Display</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Category Filter Dropdown */}
      <div>
        <label htmlFor="category-select">Filter by Category: </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category, idx) => (
            <option key={idx} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {filteredArtWorks.length > 0 ? (
        <div>
          <ul>
            {filteredArtWorks.map((artwork, idx) => (
              <li key={idx}>
                {/* <h3>{artwork.title}</h3>
                <p>{artwork.date}</p> */}
                {artwork._links.thumbnail?.href ? (
                  <img
                    src={artwork._links.thumbnail.href}
                    alt={`Artwork titled ${artwork.title}`}
                  />
                ) : (
                  <p>No image available</p>
                )}
              </li>
            ))}
          </ul>

          <div ref={observerRef} style={{ height: "1px" }}></div>
        </div>
      ) : (
        <p>No artworks available</p>
      )}
    </div>
  );
}
