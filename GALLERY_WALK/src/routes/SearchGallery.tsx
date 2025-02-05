import { useSearchParams } from "react-router-dom";
import { TOKEN } from "../configs";
import { useState, useEffect, useContext } from "react";
import { basicFetchOptions, fetchHandler } from "../utils/fetchData";
import { CurrentUserContext } from "../contexts/currentUser-context-provider";
import { getPostOptions } from "../utils/fetchData";

interface SearchResult {
  title: string;
  date: string;
  _links: {
    thumbnail?: {
      href: string;
    };
  };
}

interface SearchResponse {
  _embedded: {
    results: SearchResult[];
  };
}

const searchUrl = import.meta.env.VITE_SEARCH_API_URL;

export default function SearchResultPage() {

  const [searchParams] = useSearchParams(); // Access query params
  const query = searchParams.get("q"); // Extract the "q" parameter
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandArt, setExpandArt] = useState<SearchResult | null>(null);
  const [saved, setSaved] = useState<string[]>([])
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

  useEffect(() => {
    if (query) {
      const fetchResult = async () => {
        try {
          const endpoint = `${searchUrl}?q=${encodeURIComponent(query)}`;

          const options: RequestInit = {
            ...basicFetchOptions,
            headers: {
              ...basicFetchOptions.headers,
              "X-XAPP-Token": TOKEN,
            },
          };

          const [resData, fetchError] = await fetchHandler<SearchResponse>(endpoint, options);
          console.log("Search API Response:", resData);


          if (fetchError) {
            setError(fetchError.message);
          } else if (resData && resData._embedded?.results) {
            setResults(resData._embedded.results);
          } else {
            setResults(resData?._embedded.results || []);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }

      };

      fetchResult();
    }
  }, [query]);

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
      <h1>Search Results for "{query}"</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {results.length > 0 ? (
        <ul>
          {results.map((result, idx) => (
            <li key={idx}>
              <h3>{result.title}</h3>
              {result._links.thumbnail?.href ? (
                <img
                  src={result._links.thumbnail.href}
                  alt="art"
                  style={{ cursor: "pointer" }}
                  onClick={() => setExpandArt(result)}
                />
              ) : (
                <p>No image</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
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
              <button className="" onClick={() => { handleSaved(expandArt._links.thumbnail?.href ?? "") }}>save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
