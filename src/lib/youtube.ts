import type { Video } from "@/lib/types";

// YouTube API Response Types
interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

interface YouTubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high?: YouTubeThumbnail;
    standard?: YouTubeThumbnail;
    maxres?: YouTubeThumbnail;
  };
  channelTitle: string;
  liveBroadcastContent?: string;
  publishTime?: string;
}

interface YouTubeSearchItemId {
  kind: string;
  videoId: string;
}

interface YouTubeSearchItem {
  kind: string;
  etag: string;
  id: YouTubeSearchItemId;
  snippet: YouTubeSnippet;
}

interface YouTubePlaylistItem {
  kind: string;
  etag: string;
  id: string;
  snippet: YouTubeSnippet & {
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    startAt?: string;
    endAt?: string;
    note?: string;
    videoPublishedAt: string;
  };
}

interface YouTubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  regionCode?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubeSearchItem[];
  error?: YouTubeApiError;
}

interface YouTubePlaylistResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YouTubePlaylistItem[];
  error?: YouTubeApiError;
}

interface YouTubeApiError {
  code: number;
  message: string;
  errors?: Array<{
    message: string;
    domain: string;
    reason: string;
  }>;
}

// Error Types
export type YouTubeErrorType = 
  | 'API_KEY_MISSING' 
  | 'API_KEY_INVALID' 
  | 'QUOTA_EXCEEDED' 
  | 'NETWORK_ERROR' 
  | 'UNKNOWN';

export interface YouTubeError {
  type: YouTubeErrorType;
  message: string;
  details?: any;
}

export interface YouTubeApiResult<T> {
  success: boolean;
  data?: T;
  error?: YouTubeError;
}

// Logging Interface
export interface YouTubeLogger {
  logRequest(endpoint: string, params: Record<string, any>): void;
  logResponse(success: boolean, data?: any, error?: any): void;
  logError(error: YouTubeError): void;
}

// Default Console Logger Implementation
class ConsoleYouTubeLogger implements YouTubeLogger {
  logRequest(endpoint: string, params: Record<string, any>): void {
    console.log(`[YouTube Service] API Request to ${endpoint}`, {
      params: this.sanitizeParams(params),
      timestamp: new Date().toISOString()
    });
  }

  logResponse(success: boolean, data?: any, error?: any): void {
    if (success) {
      console.log(`[YouTube Service] API Response Success`, {
        itemCount: data?.items?.length || 0,
        timestamp: new Date().toISOString()
      });
    } else {
      console.error(`[YouTube Service] API Response Error`, {
        error: error?.message || 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  logError(error: YouTubeError): void {
    console.error(`[YouTube Service] Error - ${error.type}:`, {
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString()
    });
  }

  private sanitizeParams(params: Record<string, any>): Record<string, any> {
    const sanitized = { ...params };
    if (sanitized.key) {
      const key = sanitized.key;
      sanitized.key = `${key.substring(0, 5)}...${key.substring(key.length - 5)}`;
    }
    return sanitized;
  }
}

// YouTube Service Interface
export interface YouTubeServiceInterface {
  getChannelVideos(channelId: string, maxResults?: number): Promise<YouTubeApiResult<Video[]>>;
  getPlaylistVideos(playlistId: string, maxResults?: number): Promise<YouTubeApiResult<any[]>>;
  validateApiKey(): Promise<YouTubeApiResult<boolean>>;
}

// YouTube Service Implementation
export class YouTubeService implements YouTubeServiceInterface {
  private apiKey: string;
  private logger: YouTubeLogger;
  private validationPromise: Promise<YouTubeApiResult<boolean>> | null = null;
  private lastValidationTime: number = 0;
  private validationCacheTime: number = 5 * 60 * 1000; // 5 minutes cache

  constructor(apiKey?: string, logger?: YouTubeLogger) {
    this.apiKey = apiKey || process.env.YOUTUBE_API_KEY || '';
    this.logger = logger || new ConsoleYouTubeLogger();
  }

  async validateApiKey(): Promise<YouTubeApiResult<boolean>> {
    const now = Date.now();
    
    // Check if we have a cached result that's still valid
    if (this.validationPromise && (now - this.lastValidationTime) < this.validationCacheTime) {
      return this.validationPromise;
    }
    
    // If we're already validating, return the existing promise
    if (this.validationPromise && (now - this.lastValidationTime) < this.validationCacheTime + 30000) {
      return this.validationPromise;
    }
    
    // Create a new validation promise
    this.validationPromise = this.performApiKeyValidation();
    this.lastValidationTime = now;
    
    return this.validationPromise;
  }
  
  private async performApiKeyValidation(): Promise<YouTubeApiResult<boolean>> {
    if (!this.apiKey || this.apiKey === "YOUR_YOUTUBE_API_KEY_HERE" || this.apiKey.trim() === "") {
      const error: YouTubeError = {
        type: 'API_KEY_MISSING',
        message: 'YouTube API key is missing or not configured. Please ensure you have a .env.local file with YOUTUBE_API_KEY=your_actual_api_key_here and restart your Next.js development server.',
        details: { apiKeyExists: !!this.apiKey, apiKeyValue: this.apiKey }
      };
      this.logger.logError(error);
      return { success: false, error };
    }

    // Clean the API key
    this.apiKey = this.apiKey.trim().replace(/^["'](.*)["']$/, "$1");

    // Re-check after cleaning
    if (!this.apiKey) {
      const error: YouTubeError = {
        type: 'API_KEY_MISSING',
        message: 'YouTube API key is empty after cleaning',
        details: { cleanedKey: this.apiKey }
      };
      this.logger.logError(error);
      return { success: false, error };
    }

    // Test API key with a simple request
    try {
      const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&maxResults=1&type=video&key=${this.apiKey}`;
      
      this.logger.logRequest('search (validation)', { 
        q: 'test', 
        maxResults: 1, 
        type: 'video',
        key: this.apiKey
      });

      const response = await fetch(testUrl);
      const data = await response.json();

      if (!response.ok || data.error) {
        const errorType = this.classifyError(response.status, data.error);
        const error: YouTubeError = {
          type: errorType,
          message: data.error?.message || `API key validation failed with status ${response.status}`,
          details: { status: response.status, error: data.error }
        };
        this.logger.logError(error);
        return { success: false, error };
      }

      this.logger.logResponse(true, data);
      return { success: true, data: true };
    } catch (error) {
      const youtubeError: YouTubeError = {
        type: 'NETWORK_ERROR',
        message: 'Network error during API key validation',
        details: error
      };
      this.logger.logError(youtubeError);
      return { success: false, error: youtubeError };
    }
  }

  async getChannelVideos(channelId: string, maxResults: number = 9): Promise<YouTubeApiResult<Video[]>> {
    const validation = await this.validateApiKey();
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&type=video&order=date&key=${this.apiKey}`;
    
    this.logger.logRequest('search (channel videos)', {
      channelId,
      maxResults,
      type: 'video',
      order: 'date',
      key: this.apiKey
    });

    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData: YouTubeSearchResponse;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          const error: YouTubeError = {
            type: 'NETWORK_ERROR',
            message: `YouTube API request failed with status ${response.status}`,
            details: { status: response.status, responseText: responseText.substring(0, 500) }
          };
          this.logger.logError(error);
          return { success: false, error };
        }

        const errorType = this.classifyError(response.status, errorData.error);
        const error: YouTubeError = {
          type: errorType,
          message: errorData.error?.message || `YouTube API request failed with status ${response.status}`,
          details: { status: response.status, error: errorData.error }
        };
        this.logger.logError(error);
        return { success: false, error };
      }

      const data: YouTubeSearchResponse = JSON.parse(responseText);

      if (data.error) {
        const errorType = this.classifyError(200, data.error);
        const error: YouTubeError = {
          type: errorType,
          message: data.error.message,
          details: data.error
        };
        this.logger.logError(error);
        return { success: false, error };
      }

      if (!data.items || data.items.length === 0) {
        this.logger.logResponse(true, data);
        return { success: true, data: [] };
      }

      const videos: Video[] = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title || "Untitled Video",
        description: item.snippet.description
          ? item.snippet.description.substring(0, 200) +
            (item.snippet.description.length > 200 ? "..." : "")
          : "No description available.",
        thumbnailUrl:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          "https://dummyimage.com/480x360/e0e0e0/ffffff&text=No+Thumbnail",
        youtubeVideoId: item.id.videoId,
        thumbnailAiHint: this.generateAiHint(item.snippet.title),
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
      }));

      this.logger.logResponse(true, { items: videos });
      return { success: true, data: videos };

    } catch (error) {
      const youtubeError: YouTubeError = {
        type: 'NETWORK_ERROR',
        message: 'Network error during channel videos request',
        details: error
      };
      this.logger.logError(youtubeError);
      return { success: false, error: youtubeError };
    }
  }

  async getPlaylistVideos(playlistId: string, maxResults: number = 50): Promise<YouTubeApiResult<any[]>> {
    const validation = await this.validateApiKey();
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${this.apiKey}&playlistId=${playlistId}&part=snippet,contentDetails&maxResults=${maxResults}`;
    
    this.logger.logRequest('playlistItems', {
      playlistId,
      maxResults,
      part: 'snippet,contentDetails',
      key: this.apiKey
    });

    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        const responseText = await response.text();
        let errorData: YouTubePlaylistResponse;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          const error: YouTubeError = {
            type: 'NETWORK_ERROR',
            message: `YouTube API request failed with status ${response.status}`,
            details: { status: response.status, responseText: responseText.substring(0, 500) }
          };
          this.logger.logError(error);
          return { success: false, error };
        }

        const errorType = this.classifyError(response.status, errorData.error);
        const error: YouTubeError = {
          type: errorType,
          message: errorData.error?.message || `YouTube API request failed with status ${response.status}`,
          details: { status: response.status, error: errorData.error }
        };
        this.logger.logError(error);
        return { success: false, error };
      }

      const data: YouTubePlaylistResponse = await response.json();

      if (data.error) {
        const errorType = this.classifyError(200, data.error);
        const error: YouTubeError = {
          type: errorType,
          message: data.error.message,
          details: data.error
        };
        this.logger.logError(error);
        return { success: false, error };
      }

      const items = data.items || [];
      
      // Sort by published date (newest first) - matching existing playlist behavior
      const sortedItems = items.sort(
        (a, b) =>
          new Date(b.snippet.publishedAt).getTime() -
          new Date(a.snippet.publishedAt).getTime(),
      );

      this.logger.logResponse(true, { items: sortedItems });
      return { success: true, data: sortedItems };

    } catch (error) {
      const youtubeError: YouTubeError = {
        type: 'NETWORK_ERROR',
        message: 'Network error during playlist videos request',
        details: error
      };
      this.logger.logError(youtubeError);
      return { success: false, error: youtubeError };
    }
  }

  private classifyError(status: number, error?: YouTubeApiError): YouTubeErrorType {
    if (!error) {
      if (status === 403) return 'API_KEY_INVALID';
      if (status >= 500) return 'NETWORK_ERROR';
      return 'UNKNOWN';
    }

    const reason = error.errors?.[0]?.reason;
    const message = error.message?.toLowerCase() || '';

    if (reason === 'keyInvalid' || message.includes('api key')) {
      return 'API_KEY_INVALID';
    }
    if (reason === 'quotaExceeded' || message.includes('quota')) {
      return 'QUOTA_EXCEEDED';
    }
    if (status >= 500 || message.includes('network') || message.includes('timeout')) {
      return 'NETWORK_ERROR';
    }

    return 'UNKNOWN';
  }

  private generateAiHint(title?: string): string {
    if (typeof title !== "string" || !title.trim()) {
      return "meditation video";
    }
    const words = title.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return `${words[0]} ${words[1]}`;
    } else if (words.length === 1) {
      return words[0];
    }
    return "meditation video";
  }
}

// Default service instance
export const youtubeService = new YouTubeService();

// Utility functions for backward compatibility
export async function getChannelVideos(channelId: string, maxResults?: number): Promise<Video[]> {
  const result = await youtubeService.getChannelVideos(channelId, maxResults);
  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to fetch channel videos');
  }
  return result.data || [];
}

export async function getPlaylistVideos(playlistId: string, maxResults?: number): Promise<any[]> {
  const result = await youtubeService.getPlaylistVideos(playlistId, maxResults);
  if (!result.success) {
    throw new Error(result.error?.message || 'Failed to fetch playlist videos');
  }
  return result.data || [];
}