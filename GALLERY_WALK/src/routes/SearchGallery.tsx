import { useSearchParams } from "react-router-dom";
import { TOKEN } from "../configs";
import { useState, useEffect, useContext } from "react";
import { basicFetchOptions, fetchHandler } from "../utils/fetchData";
import { CurrentUserContext } from "../contexts/currentUser-context-provider";
import { getPostOptions } from "../utils/fetchData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { Search } from "lucide-react"

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

  const [isFocused, setIsFocused] = useState<boolean>(false)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>("")
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/gallery/search?q=${encodeURIComponent(searchQuery)}`)
    }
    console.log(searchQuery)
  }


  return (
    <div className="main_container">
      <div className="search_gallery_container">
        <section className="searchbar_container">
          <form onSubmit={handleSearch} className="search_form">
            <motion.div
              initial={{
                width: "20%"
              }}
              animate={{
                width: isFocused ? "70%" : "20%"
              }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
              }}
            >
              <input
                type="text"
                placeholder="Search by title or artist"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </motion.div>

            <button type="submit" className="search_button"><Search className="icon" /></button>
          </form>
        </section>
        <h1 className="search_result">Search Results for "{query}"</h1>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        <div className="card_container">
          {results.length > 0 ? (
            <ul className="card_list">
              {results.map((result, idx) => {
                if (result._links.thumbnail?.href === "art") {
                  return null
                }

                return (
                  <li key={idx}>
                    <div className="img_card">
                      {result._links.thumbnail?.href ? (
                        <img
                          src={result._links.thumbnail.href}
                          alt="Could not find image"
                          style={{ cursor: "pointer" }}
                          onClick={() => setExpandArt(result)}
                          className="artwork_img"
                        />
                      ) : (
                        <p>No image</p>
                      )}
                    </div>

                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No results found.</p>
          )}
        </div>

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
    </div>
  );
}
