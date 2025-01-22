type RequestBody = Record<string, unknown>;
type FetchResponse<T = unknown> = [T | null, Error | null];

export const basicFetchOptions: RequestInit = {
  method: 'GET',
  credentials: 'include',
};

export const deleteOptions: RequestInit = {
  method: 'DELETE',
  credentials: 'include',
};

export const getPostOptions = (body: RequestBody): RequestInit => ({
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const getPatchOptions = (body: RequestBody): RequestInit => ({
  method: 'PATCH',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const fetchHandler = async <T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<FetchResponse<T>> => {
  try {
    const response = await fetch(url, options);
    const { ok, status, headers } = response;

    if (!ok) {
      throw new Error(`Fetch failed with status - ${status}`);
    }

    const isJson = (headers.get('content-type') || '').includes('application/json');
    const responseData = await (isJson ? response.json() : response.text());

    return [responseData as T, null];
  } catch (error) {
    console.warn(error);
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
};
