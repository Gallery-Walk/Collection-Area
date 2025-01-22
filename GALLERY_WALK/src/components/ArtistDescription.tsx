import { fetchHandler, basicFetchOptions } from "../utils/fetchData";
import { TOKEN } from "../configs";
import { useState, useEffect, useRef } from "react";

const API_BASE_URL = 'https://api.artsy.net/api/artists'
const ARTIST_SLUG = 'andy-warhol'

interface ArtistData {
  id: string,
  slug: string,
  name: string,
  nationality: string,
  _links: {
    thumbnail: {
      href: string;
    };
    [key: string]: unknown;
  }
}

export default function ArtistDescription() {


  const [artistData, setArtistData] = useState<ArtistData | null>(null)
  const [error, setError] = useState<string | null>(null)
  // const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    const fetchArtist = async () => {

      try {
        const url = `${API_BASE_URL}/${ARTIST_SLUG}`
        const options: RequestInit = {
          ...basicFetchOptions,
          headers: {
            ...basicFetchOptions.headers,
            'X-Xapp-Token': TOKEN,
          },
        };
        const [responseData, fetchError] = await fetchHandler(url, options);

        if (fetchError) {
          setError(fetchError.message)
        } else {
          setArtistData(responseData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }
    };

    fetchArtist();
  }, [])

  // const handleFetch = () => {
  //   const xappToken = TOKEN
  //   const artistSlug = 'tom-wesselmann'
  //   fetchArtist(artistSlug, xappToken)
  // }

  return (
    <div>
      <h1>Hello again, we will be testing some more</h1>
      {artistData ? (
        <div>
          <h2>Artist Data</h2>
          {artistData._links.thumbnail.href ? (
            <img src={artistData._links.thumbnail.href} alt="Image" />
          ) : (
            <p>No image</p>
          )}
          {/* <pre>{JSON.stringify(artistData, null, 2)}</pre> */}
        </div>
      ) : (
        <p>No data</p>
      )}
    </div>

  )
}