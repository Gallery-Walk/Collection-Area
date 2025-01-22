import { useEffect, useState, useRef } from "react"
import { basicFetchOptions, fetchHandler } from "../utils/fetchData"
import { TOKEN } from "../configs"

interface ArtWork {
  title: string,
  date: string,
  slug: string,
  _links: {
    thumbnail: {
      href: string
    }
  },
};

interface ArtWorksResponse {
  _embedded: { artworks: ArtWork[] },
  next: string | null,
  total_count: number
}

const API_BASE_URL = 'https://api.artsy.net/api/artworks'

export default function GalleryImages() {

  const [artWorks, setArtWorks] = useState<ArtWork[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [nxtCursor, setNxtCursor] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const pageSize = 10

  useEffect(() => {
    const fetchArtworks = async (cursor: string | null = null) => {
      try {
        const url = cursor
          ? `${API_BASE_URL}?cursor=${cursor}$size=${pageSize}$total_count=1`
          : `${API_BASE_URL}?size=20&total_count=1`;
        const options: RequestInit = {
          ...basicFetchOptions,
          headers: {
            ...basicFetchOptions.headers,
            'X-xapp-Token': TOKEN
          },
        };

        const [responseData, fetchError] = await fetchHandler<ArtWorksResponse>(url, options);

        if (fetchError) {
          setError(fetchError.message);
        } else if (responseData) {
          setTotalCount(responseData.total_count || 0)
          setArtWorks((prev) => [...prev, ...responseData._embedded.artworks])
          setNxtCursor(responseData.next)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    };
    fetchArtworks();

  }, [nxtCursor])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && nxtCursor) {
          setNxtCursor(nxtCursor)
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [nxtCursor]);

  return <div>
    <h1>ArtWork Display</h1>
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
        <div ref={observerRef} style={{ height: '1px' }}></div>
      </div>
    ) : (
      <p>No artworks available</p>
    )}
  </div>
}