import { useEffect, useState, useRef, useContext } from "react";
import { basicFetchOptions, fetchHandler, getPostOptions } from "../utils/fetchData";
import { TOKEN } from "../configs";
import { CurrentUserContext } from "../contexts/currentUser-context-provider";

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
  const [expandArt, setExpandArt] = useState<ArtWork | null>(null);
  const [saved, setSaved] = useState<string[]>([])
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

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

  const handleSaved = async (artworkUrl: string) => {
    if (!currentUser?.id) {
      console.error("User not logged in");
      return;
    }

    try {
      const apiUrl = `/api/users/${currentUser.id}/like-picture`;

      const [data, error] = await fetchHandler(apiUrl, getPostOptions({ imageUrl: artworkUrl }));

      if (error) {
        console.error("Error saving artwork:", error);
        return;
      }

      if (data) {
        setSaved((prevSaved) => [...prevSaved, artworkUrl]); // ✅ Works now
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };


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
                    style={{ cursor: "pointer" }}
                    onClick={() => setExpandArt(artwork)}
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
      {expandArt && (
        <div className="artwork_modal_overlay" onClick={() => setExpandArt(null)}>
          <div className="artwork_modal_content" onClick={(e) => e.stopPropagation()}>
            <div className="modal_img_container">
              <img
                src={expandArt._links.thumbnail?.href}
                alt={`Artwork titled ${expandArt.title}`}
                className="artwork_modal_img"
              />
            </div>
            <div className="modal_artInfo_container">
              <h2 className="artwork_modal_title">{expandArt.title}</h2>
              <p className="artwork_modal_text">
                {expandArt.date || "No date available."}
              </p>
              <button className="" onClick={() => handleSaved(expandArt._links.thumbnail?.href ?? "")}>save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
