import { useEffect, useState, useRef } from "react";
import { basicFetchOptions, fetchHandler } from "../utils/fetchData";
import { TOKEN } from "../configs";

interface ArtWork {
  title: string;
  date: string;
  slug: string;
  _links: {
    thumbnail: {
      href: string;
    };
  };
}

interface ArtWorksResponse {
  _embedded: { artworks: ArtWork[] };
  next: string | null;
  total_count: number;
}

const API_ARTWORK_URL = import.meta.env.VITE_API_ARTWORK_URL; // Use the pagination API endpoint

export default function GalleryImages() {
  const [artWorks, setArtWorks] = useState<ArtWork[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [nxtCursor, setNxtCursor] = useState<string | null>(null); // Pagination cursor
  const observerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch artworks with pagination support
  const fetchArtworks = async (cursor: string | null = null) => {
    try {
      const url = cursor
        ? `${API_ARTWORK_URL}?cursor=${cursor}&size=100&total_count=1`
        : `${API_ARTWORK_URL}?size=100&total_count=1`;

      const options: RequestInit = {
        ...basicFetchOptions,
        headers: {
          ...basicFetchOptions.headers,
          "X-xapp-Token": TOKEN,
        },
      };

      const [responseData, fetchError] = await fetchHandler<ArtWorksResponse>(url, options);

      if (fetchError) {
        setError(fetchError.message);
      } else if (responseData) {
        setTotalCount(responseData.total_count || 0); // Total count of artworks
        setArtWorks((prev) =>
          cursor ? [...prev, ...responseData._embedded.artworks] : responseData._embedded.artworks
        );
        setNxtCursor(responseData.next); // Update the pagination cursor
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  // Initial fetch when the component loads
  useEffect(() => {
    fetchArtworks(null);
  }, []);

  // Handle infinite scrolling using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && nxtCursor) {
          fetchArtworks(nxtCursor); // Fetch next page when the observer is triggered
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

  return (
    <div>
      <h1>ArtWork Display</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {artWorks.length > 0 ? (
        <div>
          <ul>
            {artWorks.map((artwork, idx) => (
              <li key={idx}>
                <h3>{artwork.title}</h3>
                <p>{artwork.date}</p>
                {artwork._links.thumbnail.href ? (
                  <img src={artwork._links.thumbnail.href} alt="art" />
                ) : (
                  <p>No image</p>
                )}
              </li>
            ))}
          </ul>
          {/* Invisible div used for infinite scrolling */}
          <div ref={observerRef} style={{ height: "1px" }}></div>
        </div>
      ) : (
        <p>No artworks available</p>
      )}
      <p>Total Artworks: {totalCount}</p> {/* Display the total count */}
    </div>
  );
}
