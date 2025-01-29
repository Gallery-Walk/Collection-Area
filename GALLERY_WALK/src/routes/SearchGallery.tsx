import { useSearchParams } from "react-router-dom";
import { TOKEN } from "../configs";
import { useState, useEffect } from "react";
import { basicFetchOptions, fetchHandler } from "../utils/fetchData";

interface SearchResult {
  title: string;
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
                <img src={result._links.thumbnail.href} alt="art" />
              ) : (
                <p>No image</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}
